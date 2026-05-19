import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import crypto from "crypto";

// ─── Rate Limiting Config ────────────────────────────────────────────

const RATE_LIMITS = {
  anonymous: 2,
  authenticated: 5,
};

function getTodayString(): string {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function hashIP(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

async function checkAndIncrementRateLimit(
  identifier: string,
  type: "anonymous" | "authenticated",
): Promise<{ allowed: boolean; remaining: number }> {
  const today = getTodayString();
  const limit = RATE_LIMITS[type];
  const ref = getAdminDb().collection("rateLimits").doc(identifier);

  const doc = await ref.get();
  const data = doc.data();

  // If no record or different day, reset counter
  if (!doc.exists || data?.date !== today) {
    await ref.set({ count: 1, date: today, type });
    return { allowed: true, remaining: limit - 1 };
  }

  const currentCount = data.count || 0;
  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await ref.update({ count: FieldValue.increment(1) });
  return { allowed: true, remaining: limit - currentCount - 1 };
}

// ─── Gemini Config ───────────────────────────────────────────────────

const systemInstruction = `
Kamu adalah seorang Senior Tech Recruiter dan Pakar ATS (Applicant Tracking System) yang asik dan gaul banget. Tugasmu adalah nge-roasting tapi tetap ngebangun (constructive feedback) CV yang di-upload sama user.

Analisis CV berdasarkan kriteria berikut:
1. ATS Friendliness: Gimana nih formatnya? Gampang dibaca mesin ATS nggak? (kasih tau kalo grafiknya lebay, layout dua kolom bikin pusing, atau icon menuh-menuhin doang).
2. Dampak (Impact & Metrics): Pengalaman kerjanya udah pake Action Verbs belum? Ada angka metriknya nggak? (misal: "naikin konversi 15%"), jangan cuma curhat kerjaan tiap hari doang.
3. Struktur & Keterbacaan: Enak diliat nggak riwayat kerja, pendidikan, sama skill-nya?

Kamu HARUS ngeluarin analisis dalam format JSON yang valid. Jangan ngasih teks apa pun di luar blok JSON. Gunakan bahasa Indonesia yang santai, gaul (kayak pake lo-gue atau bahasa tongkrongan tech), tapi tetep ngena dan profesional poinnya.
`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    score: {
      type: "INTEGER",
      description: "Skor keseluruhan CV dari 1 sampai 100",
    },
    atsFriendliness: {
      type: "OBJECT",
      properties: {
        score: { type: "INTEGER", description: "Skor ATS dari 1-100" },
        feedback: {
          type: "STRING",
          description: "Feedback mendalam mengenai keramahan ATS",
        },
        issues: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Daftar masalah ATS (jika ada)",
        },
      },
    },
    impactAndMetrics: {
      type: "OBJECT",
      properties: {
        score: {
          type: "INTEGER",
          description: "Skor Dampak & Metrik dari 1-100",
        },
        feedback: {
          type: "STRING",
          description:
            "Feedback mengenai penggunaan action verbs dan metrik kuantitatif",
        },
        improvements: {
          type: "ARRAY",
          items: { type: "STRING" },
          description:
            "Saran perbaikan untuk membuat poin pengalaman lebih berdampak",
        },
      },
    },
    structureAndReadability: {
      type: "OBJECT",
      properties: {
        score: {
          type: "INTEGER",
          description: "Skor Struktur & Keterbacaan dari 1-100",
        },
        feedback: {
          type: "STRING",
          description:
            "Feedback mengenai struktur, tata letak, dan kemudahan dibaca",
        },
        improvements: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Saran perbaikan untuk struktur",
        },
      },
    },
    overallSummary: {
      type: "STRING",
      description: "Ringkasan keseluruhan dan kesimpulan untuk kandidat",
    },
  },
  required: [
    "score",
    "atsFriendliness",
    "impactAndMetrics",
    "structureAndReadability",
    "overallSummary",
  ],
};

// ─── POST Handler ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // ── 1. Authenticate (optional — guests allowed) ──
    let uid: string | null = null;
    const authHeader = req.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = await getAdminAuth().verifyIdToken(token);
        uid = decoded.uid;
      } catch {
        return NextResponse.json(
          { error: "Token autentikasi nggak valid bro. Coba login ulang." },
          { status: 401 },
        );
      }
    }

    // ── 2. Rate limit check (graceful degradation if Firestore unavailable) ──
    let remaining = -1; // -1 = rate limiting skipped
    try {
      const identifier =
        uid ||
        hashIP(
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") ||
            "unknown",
        );
      const type = uid ? "authenticated" : "anonymous";

      const rateResult = await checkAndIncrementRateLimit(identifier, type);
      remaining = rateResult.remaining;

      if (!rateResult.allowed) {
        const message =
          type === "anonymous"
            ? "Jatah review hari ini udah habis (2x/hari). Login biar dapet 5x/hari!"
            : "Udah mentok 5x review hari ini bro. Cobain lagi besok ya!";
        return NextResponse.json({ error: message }, { status: 429 });
      }
    } catch (rateLimitError) {
      console.warn(
        "Rate limiting unavailable (Firestore issue), skipping:",
        rateLimitError instanceof Error ? rateLimitError.message : rateLimitError,
      );
      // Continue without rate limiting — Firestore may not be set up yet
    }

    // ── 3. File validation ──
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Bro, filenya mana nih? Nggak ketemu." },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Formatnya kudu PDF ya, yang lain nggak mempan." },
        { status: 400 },
      );
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Kegedean filenya bro, maksimal 5MB aja." },
        { status: 400 },
      );
    }

    // ── 4. Process with Gemini ──
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return NextResponse.json(
        {
          error:
            "API Key-nya zonk nih bro. Coba benerin dulu GEMINI_API_KEY-nya.",
        },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "application/pdf",
              },
            },
            {
              text: "Tolong analisis CV ini sesuai dengan instruksi yang diberikan. Ingat, berikan output murni sebagai JSON objects tanpa format teks atau blok kode markdown.",
            },
          ],
        },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("AI-nya lagi bengong, nggak ada respons.");
    }

    const parsedData = JSON.parse(outputText);

    // ── 5. Save to Firestore (authenticated users only) ──
    let analysisId: string | null = null;

    if (uid) {
      try {
        const analysisRef = getAdminDb()
          .collection("users")
          .doc(uid)
          .collection("analyses")
          .doc();
        analysisId = analysisRef.id;

        await analysisRef.set({
          filename: file.name,
          createdAt: FieldValue.serverTimestamp(),
          score: parsedData.score,
          atsFriendliness: parsedData.atsFriendliness,
          impactAndMetrics: parsedData.impactAndMetrics,
          structureAndReadability: parsedData.structureAndReadability,
          overallSummary: parsedData.overallSummary,
        });

        // Increment user's analysis count
        const userRef = getAdminDb().collection("users").doc(uid);
        await userRef.update({
          analysisCount: FieldValue.increment(1),
        });
      } catch (saveError) {
        console.warn(
          "Failed to save analysis to Firestore, skipping:",
          saveError instanceof Error ? saveError.message : saveError,
        );
        // Analysis still succeeded — just won't be saved to history
      }
    }

    return NextResponse.json({
      ...parsedData,
      analysisId,
      remaining,
    });
  } catch (error: any) {
    console.error("Error analyzing CV:", error);

    let errorMessage =
      "Waduh, server lagi ngambek pas ngeproses CV lo. Coba lagi ya.";
    if (
      error.message?.includes("API Key not found") ||
      error.message?.includes("API_KEY_INVALID")
    ) {
      errorMessage =
        "API Key-nya zonk nih bro. Coba benerin dulu GEMINI_API_KEY-nya.";
    } else if (
      error.status === 429 ||
      error.message?.includes("Quota exceeded") ||
      error.message?.includes("RESOURCE_EXHAUSTED")
    ) {
      errorMessage =
        "Yah, kuota API Gemini lo abis. Top up dulu gih atau ntar coba lagi.";
    } else if (
      error.status === 404 ||
      error.message?.toLowerCase().includes("not found") ||
      error.message?.includes("NOT_FOUND")
    ) {
      errorMessage =
        "AI model yang diminta nggak ada nih, coba cek konfigurasinya lagi.";
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

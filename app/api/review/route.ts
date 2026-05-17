import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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
        feedback: { type: "STRING", description: "Feedback mendalam mengenai keramahan ATS" },
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
        score: { type: "INTEGER", description: "Skor Dampak & Metrik dari 1-100" },
        feedback: { type: "STRING", description: "Feedback mengenai penggunaan action verbs dan metrik kuantitatif" },
        improvements: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Saran perbaikan untuk membuat poin pengalaman lebih berdampak",
        },
      },
    },
    structureAndReadability: {
      type: "OBJECT",
      properties: {
        score: { type: "INTEGER", description: "Skor Struktur & Keterbacaan dari 1-100" },
        feedback: { type: "STRING", description: "Feedback mengenai struktur, tata letak, dan kemudahan dibaca" },
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
  required: ["score", "atsFriendliness", "impactAndMetrics", "structureAndReadability", "overallSummary"],
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Bro, filenya mana nih? Nggak ketemu." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Formatnya kudu PDF ya, yang lain nggak mempan." }, { status: 400 });
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Kegedean filenya bro, maksimal 5MB aja." }, { status: 400 });
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({ error: "API Key-nya zonk nih bro. Coba benerin dulu GEMINI_API_KEY-nya." }, { status: 500 });
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
        // The SDK supports passing plain objects for schema, but we map it explicitly
        responseSchema: responseSchema as any,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("AI-nya lagi bengong, nggak ada respons.");
    }

    // Attempt to parse JSON strictly
    const parsedData = JSON.parse(outputText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing CV:", error);
    
    let errorMessage = "Waduh, server lagi ngambek pas ngeproses CV lo. Coba lagi ya.";
    if (error.message?.includes("API Key not found") || error.message?.includes("API_KEY_INVALID")) {
       errorMessage = "API Key-nya zonk nih bro. Coba benerin dulu GEMINI_API_KEY-nya.";
    } else if (error.status === 429 || error.message?.includes("Quota exceeded") || error.message?.includes("RESOURCE_EXHAUSTED")) {
       errorMessage = "Yah, kuota API Gemini lo abis. Top up dulu gih atau ntar coba lagi.";
    } else if (error.status === 404 || error.message?.includes("not found")) {
       errorMessage = "AI model yang diminta nggak ada nih, coba cek konfigurasinya lagi.";
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

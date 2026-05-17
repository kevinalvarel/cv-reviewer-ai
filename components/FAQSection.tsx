import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "Bayar gak sih ini sebenernya?",
      answer:
        "Udah dibilang 100% gratis! Nggak ada biaya tambahan, nggak minta nomor kartu kredit, apalagi minta pinjol. Semuanya murni buat bantu lo dapet kerja.",
    },
    {
      question: "Aman gak nih CV gue di-upload ke sini?",
      answer:
        "Aman sentosa! Data lo cuma diproses bentar buat review doang, abis itu raib. Histori review yang lo liat juga cuma disimpen lokal di browser lo, dan bakal ilang sendiri dalam 24 jam.",
    },
    {
      question: "Emang AI-nya ngerti format ATS?",
      answer:
        "AI kita udah dilatih pake dataset HRD masa kini. Dia tau mana yang ramah mesin ATS dan mana yang cuma keliatan bagus di mata tapi ditolak sama sistem.",
    },
    {
      question: "Kok hasil reviewnya kadang pedes banget?",
      answer:
        "Mending dapet review pedes di sini, daripada CV lo di-ghosting HRD kan? Kita ngasih kritik yang ngebangun (meski kadang agak nyebelin) biar peluang lo dipanggil interview makin gede.",
    },
    {
      question: "Berapa lama proses reviewnya?",
      answer:
        "Cepet banget, biasanya cuma butuh beberapa detik sampe semenit (tergantung antrean server dan amal ibadah lo). Tinggal upload, seduh kopi bentar, tau-tau kelar.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-24 pt-16 border-t border-border/50 relative">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10 mix-blend-multiply" />

      <div className="flex flex-col items-center text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black mb-4 flex items-center justify-center gap-3 tracking-tight">
          <HelpCircle className="w-8 h-8 text-primary" />
          FAQ
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Pertanyaan yang paling sering ditanyain sama kaum pencari kerja kayak
          gua.
        </p>
      </div>

      <Accordion className="w-full flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-border/50 bg-card rounded-2xl px-6 transition-all duration-300 hover:border-primary/40 focus-within:border-primary focus-within:shadow-md data-[state=open]:border-primary"
          >
            <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-6 pt-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

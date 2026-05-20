"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { motion, type Variants } from "motion/react";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 16 },
  },
};

const blobVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 1.2, ease: [0, 0, 0.58, 1] as [number, number, number, number] },
  },
};

export default function FAQSection() {
  const faqs = [
    {
      question: "Bayar gak sih ini sebenernya?",
      answer: "Udah dibilang 100% gratis! Nggak ada biaya tambahan, nggak minta nomor kartu kredit, apalagi minta pinjol. Semuanya murni buat bantu lo dapet kerja.",
    },
    {
      question: "Aman gak nih CV gue di-upload ke sini?",
      answer: "Aman sentosa! Data lo cuma diproses bentar buat review doang, abis itu raib. Histori review yang lo liat juga cuma disimpen lokal di browser lo, dan bakal ilang sendiri dalam 24 jam.",
    },
    {
      question: "Emang AI-nya ngerti format ATS?",
      answer: "AI kita udah dilatih pake dataset HRD masa kini. Dia tau mana yang ramah mesin ATS dan mana yang cuma keliatan bagus di mata tapi ditolak sama sistem.",
    },
    {
      question: "Kok hasil reviewnya kadang pedes banget?",
      answer: "Mending dapet review pedes di sini, daripada CV lo di-ghosting HRD kan? Kita ngasih kritik yang ngebangun (meski kadang agak nyebelin) biar peluang lo dipanggil interview makin gede.",
    },
    {
      question: "Berapa lama proses reviewnya?",
      answer: "Cepet banget, biasanya cuma butuh beberapa detik sampe semenit (tergantung antrean server dan amal ibadah lo). Tinggal upload, seduh kopi bentar, tau-tau kelar.",
    },
  ];

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto mt-24 pt-16 border-t border-border/50 relative"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <motion.div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 mix-blend-multiply" variants={blobVariants} />
      <motion.div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10 mix-blend-multiply" variants={blobVariants} />

      <motion.div className="flex flex-col items-center text-center mb-12" variants={headingVariants}>
        <h2 className="text-3xl md:text-4xl font-black mb-4 flex items-center justify-center gap-3 tracking-tight">
          <HelpCircle className="w-8 h-8 text-primary" />
          FAQ
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Pertanyaan yang paling sering ditanyain sama kaum pencari kerja kayak gua.
        </p>
      </motion.div>

      <Accordion className="w-full flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={itemVariants}>
            <AccordionItem
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
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
}

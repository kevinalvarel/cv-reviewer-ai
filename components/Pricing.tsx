import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    title: "MBG",
    subtitle: "Mau Berlangganan Gratis",
    price: "$0",
    features: [
      { text: "1x ATS check / bulan", active: true },
      { text: "Advanced Metric Analysis", active: false },
      { text: "Priority Support", active: false },
    ],
    isPopular: false,
  },
  {
    title: "Papi i Bos Tambang",
    subtitle: "Cocok buat Si Paling Tambang",
    price: "$19jt",
    features: [
      { text: "Unlimited ATS checks", active: true },
      { text: "Advanced Metric Analysis", active: true },
      { text: "24/7 Human Support", active: false },
    ],
    isPopular: true,
  },
  {
    title: "Kebanyakan Anggaran",
    subtitle: "Uang bukan masalah",
    price: "$58%",
    features: [
      { text: "Everything in Pro", active: true },
      { text: "Review via Video Call", active: true },
      { text: "VIP Support 24/7", active: true },
    ],
    isPopular: false,
  },
];

export default function Pricing() {
  return (
    <div className="w-full max-w-5xl mx-auto mt-20 pt-16 border-t border-border/50 text-center pb-8 flex flex-col items-center overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-foreground">
        Pricing Plans
      </h2>
      <p className="text-muted-foreground mb-12 max-w-2xl px-4 text-lg">
        Pilih paket yang paling cocok buat karier lo (katanya sih gitu).
      </p>

      <div className="relative w-full px-4">
        {/* Fake Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-60 grayscale transition-all duration-500">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "shadow-sm flex flex-col pt-4",
                plan.isPopular
                  ? "border-2 border-primary/50 relative md:-translate-y-4"
                  : "border border-border",
              )}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-foreground">
                  {plan.title}
                </CardTitle>
                <p
                  className={cn(
                    "text-sm font-medium mt-1",
                    plan.isPopular
                      ? "text-primary/80"
                      : "text-muted-foreground",
                  )}
                >
                  {plan.subtitle}
                </p>
                <p className="text-5xl font-black mt-4 text-foreground flex justify-center items-end gap-1">
                  {plan.price}
                  <span className="text-lg font-normal text-muted-foreground pb-1">
                    /mo
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="text-left space-y-4 my-6">
                  {plan.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      {feature.active ? (
                        <CheckCircle2
                          className={cn(
                            "w-5 h-5 shrink-0 mt-0.5",
                            plan.isPopular ? "text-primary" : "text-primary/50",
                          )}
                        />
                      ) : (
                        <XCircle className="w-5 h-5 text-muted-foreground/30 shrink-0 mt-0.5" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="bg-transparent border-t-0 p-6 pt-0">
                <button
                  disabled
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold cursor-not-allowed",
                    plan.isPopular
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  Subscribe Now
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CrossOut Image */}
        <Image
          src="/images/CrossOut.png"
          alt="CrossOut"
          width={1200}
          height={600}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] md:w-[110%] h-[120%] md:h-auto object-contain z-10 pointer-events-none opacity-90"
        />

        {/* Joke Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] md:-translate-y-1/2 rotate-[-3deg] z-20 pointer-events-none w-[110%] md:w-[130%] text-center">
          <span className="font-architects text-3xl md:text-5xl font-black text-primary drop-shadow-2xl leading-relaxed block bg-background/95 px-8 py-6 rounded-[3rem] border-4 border-primary/20 shadow-2xl transform transition-transform hover:scale-105 mx-auto max-w-fit">
            Bercanda, kita 100% GRATIS!
            <br />
            <span className="text-xl md:text-2xl text-muted-foreground font-sans tracking-tight block mt-2">
              (lagian kita gapake dolar)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

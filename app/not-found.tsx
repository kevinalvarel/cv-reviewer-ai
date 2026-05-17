import Link from "next/link";
import { ArrowLeft, MapPinOff } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden pb-20 pt">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -z-10 mix-blend-multiply dark:mix-blend-normal" />

      <div className="flex flex-col items-center text-center px-4 max-w-2xl relative z-10">
        <div className="relative mb-4 md:mb-8 flex items-center justify-center">
          {/* Giant background text */}
          <h1 className="text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-foreground/5 select-none">
            404
          </h1>

          {/* Icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPinOff
              className="w-24 h-24 md:w-32 md:h-32 text-primary drop-shadow-2xl"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
          Waduh, Lo Nyasar Bro!
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg">
          Halaman yang lo cari nggak ketemu nih. Mungkin udah dihapus, atau
          emang dari awal nggak pernah ada. Mending balik fokus benerin CV lo
          aja deh. btw ini bukan gambar kok hehe
        </p>

        <Link
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-primary-foreground bg-primary rounded-2xl hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-primary/30"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Balik ke Jalan yang Benar
        </Link>
      </div>
    </div>
  );
}

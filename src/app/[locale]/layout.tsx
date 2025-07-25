import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "../globals.css";
import { useTranslations } from "next-intl";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Generative Manim",
  applicationName: "Generative Manim",
  description:
    "Tool for generating animation videos from text. GPT for video generation. Built on top of the Manim library.",
  metadataBase: new URL("https://generative-manim.vercel.app"),
  keywords: [
    "Generative Manim",
    "Manim",
    "Generative",
    "GPT",
    "Animation",
    "Video",
    "Text",
  ],
};

const figtree = Figtree({ subsets: ["latin"] });

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const t = useTranslations("Index");
  return (
    <html lang={locale} className={`${figtree.className} dark:[color-scheme:dark]`}>
      <body>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}

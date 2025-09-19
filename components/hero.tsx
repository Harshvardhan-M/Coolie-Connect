"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Luggage, ShieldCheck } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

type Lang = "en" | "hi" | "ta"

const copy: Record<Lang, { title: string; subtitle: string; cta: string; secCta: string; trust: string[] }> = {
  en: {
    title: "CoolieConnect — On-demand coolies for effortless travel",
    subtitle:
      "Verified porters to move your luggage from platforms and gates to taxis, coaches, and exits. Transparent prices, live tracking, and seamless payments.",
    cta: "Book a Coolie",
    secCta: "See How It Works",
    trust: ["Verified IDs", "Upfront Pricing", "Live Tracking"],
  },
  hi: {
    title: "कूली कनेक्ट — आपकी यात्रा के लिए ऑन-डिमांड कूली",
    subtitle:
      "सत्यापित कुली जो आपके सामान को प्लेटफ़ॉर्म/गेट से टैक्सी, कोच और एग्ज़िट तक पहुंचाएं। पारदर्शी कीमतें, लाइव ट्रैकिंग, और आसान भुगतान।",
    cta: "कूली बुक करें",
    secCta: "कैसे काम करता है",
    trust: ["सत्यापित पहचान", "स्पष्ट कीमत", "लाइव ट्रैकिंग"],
  },
  ta: {
    title: "கூலி கனெக்ட் — உங்கள் பயணத்திற்கான உடனடி கூலி சேவை",
    subtitle:
      "உங்கள் மூட்டைகளை தளங்களில் இருந்து டாக்சி/கோச்/வெளியேறும் இடங்களுக்கு கொண்டு செல்ல சரிபார்க்கப்பட்ட கூலிகள். வெளிப்படையான கட்டணம், நேரலை கண்காணிப்பு, எளிய கட்டணம்.",
    cta: "கூலியைப் பதிவு செய்",
    secCta: "எப்படி செயல்படுகிறது",
    trust: ["சரிபார்க்கப்பட்ட ஐடி", "விலை தெளிவு", "நேரலை கண்காணிப்பு"],
  },
}

export function Hero() {
  const [lang, setLang] = useState<Lang>("en")
  const t = copy[lang]

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              Across stations, stands, and airports
            </span>
          </div>
          <h1 className="text-balance text-3xl md:text-5xl font-semibold text-gray-900">{t.title}</h1>
          <p className="mt-4 text-gray-600 leading-relaxed">{t.subtitle}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <Link href="/book">{t.cta}</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="#how">{t.secCta}</a>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> {t.trust[0]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Luggage className="h-4 w-4 text-emerald-500" /> {t.trust[1]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-500" /> {t.trust[2]}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <label htmlFor="lang" className="text-sm text-gray-600">
              Language
            </label>
            <select
              id="lang"
              className="border rounded-md px-2 py-1 text-sm"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label="Select language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
        </div>

        <div aria-hidden className="relative">
          <img src="/map-with-pin-and-luggage-illustration.png" alt="" className="w-full rounded-lg border" />
        </div>
      </div>
    </section>
  )
}

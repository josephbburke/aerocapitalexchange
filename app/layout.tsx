import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Aero Capital Exchange - Aviation Financing & Aircraft Sales",
    template: "%s | Aero Capital Exchange",
  },
  description: "Your trusted partner in aviation financing and aircraft sales. Browse our extensive inventory of business jets, turboprops, helicopters, and piston aircraft.",
  keywords: ["aviation", "aircraft sales", "aviation financing", "business jets", "helicopters", "aircraft broker"],
  authors: [{ name: "Aero Capital Exchange" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aerocapitalexchange.com",
    title: "Aero Capital Exchange - Aviation Financing & Aircraft Sales",
    description: "Your trusted partner in aviation financing and aircraft sales.",
    siteName: "Aero Capital Exchange",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aero Capital Exchange - Aviation Financing & Aircraft Sales",
    description: "Your trusted partner in aviation financing and aircraft sales.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

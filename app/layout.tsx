import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Skills Matrix Portal",
  description: "Manage employee skills and department assignments",
  generator: 'Dawlance',
  icons: {
    icon: [
      {
        url: '/dawlance-d.svg',
        sizes: '32x32',
        type: 'image/png',
      },
      // {
      //   url: '/favicon.ico',
      //   sizes: '16x16',
      //   type: 'image/x-icon',
      // }
    ],
    // shortcut: '/favicon.ico',
    // apple: '/dawlance-logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

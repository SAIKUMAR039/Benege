import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Benge - AI Assistant',
  description: 'An AI chat interface built with Next.js, Tailwind CSS, and Gemini AI. Experience natural conversations with advanced language models.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

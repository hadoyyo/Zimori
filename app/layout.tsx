import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zimori - Symulacja Ekosystemu',
  description: 'Ekosystem Simulation Web App',
  keywords: 'symulacja, ekosystem, zwierzęta, rośliny, interaktywna symulacja',
icons: {
    icon: './favicon.ico'
}
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

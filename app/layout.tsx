import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Take Me Out - Voting',
  description: 'Vote for your favorite contestant!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


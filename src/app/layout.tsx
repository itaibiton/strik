import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Strik - Football Trivia Game',
  description: 'Test your football knowledge with Strik, the ultimate soccer trivia game. Challenge yourself with streak-based gameplay and compete with friends!',
  keywords: 'football, soccer, trivia, game, sports quiz, football knowledge',
  authors: [{ name: 'Strik Team' }],
  openGraph: {
    title: 'Strik - Football Trivia Game',
    description: 'Test your football knowledge with streak-based trivia gameplay',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Strik - Football Trivia Game',
    description: 'Test your football knowledge with streak-based trivia gameplay',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import ConvexClientProvider from '@/components/convex-client-provider'
import { AuthHeader } from '@/components/auth-header'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})


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
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased font-sans`}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange={false}
            >
              <AuthHeader />
              <main className="min-h-[calc(100vh-4rem)]">
                {children}
              </main>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
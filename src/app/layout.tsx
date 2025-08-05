import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

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
    <ClerkProvider>

      <html lang="en" className="h-full" suppressHydrationWarning>
        <body className={`${inter.className} h-full antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <div className="min-h-full">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>

  )
}
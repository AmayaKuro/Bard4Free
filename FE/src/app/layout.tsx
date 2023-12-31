import './globals.css'

import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { NextAuthProvider, Theme, AnimateProvider } from "@/assets/providers/framework";
import AlertProvider from '@/assets/providers/alert';

import AlertPopUp from '@/components/alert.component';


const inter = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Bard4Free',
  description: 'Bard4Free: Next.js and Django-powered platform with Bard API core. Unleash creativity effortlessly. Join now for a seamless artistic experience.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: 'https://bard4free.vercel.app/',
    siteName: 'Bard4Free',
    title: 'Bard4Free',
    description: 'Bard4Free: Next.js and Django-powered platform with Bard API core. Unleash creativity effortlessly. Join now for a seamless artistic experience.',
    images: [
      {
        url: 'https://bard4free.vercel.app/image/bard4free-cropped.png',
        width: 1200,
        height: 630,
        alt: 'Bard4Free',
      },
    ],
  },
  verification: {
    google: "RzOZB2x7jdBBSGs5ukSMDUumzJvuzz-tQDtLizIpUjI",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Theme>
            <AnimateProvider>
              <AlertProvider>
                {children}
                <AlertPopUp />
              </AlertProvider>
            </AnimateProvider>
          </Theme>
        </NextAuthProvider>
      </body>
    </html>
  )
}

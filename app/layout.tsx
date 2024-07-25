import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import NextTopLoader from 'nextjs-toploader';
import ThemeProvider from '@/providers/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';

const siteName = 'Next.js Subscription Starter';
const title = 'Next.js Subscription Starter';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  applicationName: siteName,
  description: description,
  openGraph: {
    title: title,
    description: description,
    url: new URL(getURL()),
    siteName: siteName,
    type: 'website'
  },
  twitter: {
    site: '@vercel',
    creator: '@vercel'
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <NextTopLoader showSpinner={false} height={2} color="#2acf80" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
          >
            {children}
            <Analytics />
          </main>
          <Footer />
        </ThemeProvider>
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}

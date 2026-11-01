import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { getSiteSettings, getPortfolioProfile } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const profile = await getPortfolioProfile()

  return {
    title: settings.site_title || `${profile.full_name} | ${profile.title}`,
    description: settings.site_description || profile.tagline,
    keywords: settings.seo_keywords,
    authors: [{ name: profile.full_name }],
    openGraph: {
      title: settings.site_title || `${profile.full_name} | ${profile.title}`,
      description: settings.site_description || profile.tagline,
      type: 'website',
      images: [
        {
          url: profile.avatar_url || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: profile.full_name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.site_title,
      description: settings.site_description,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  )
}

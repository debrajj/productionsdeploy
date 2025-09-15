import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O2 Nutrition Backend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
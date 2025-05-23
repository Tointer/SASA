import './globals.css'
import NavBar from './NavBar';
import { Public_Sans } from 'next/font/google'

const publicSans = Public_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'SASA',
  description: 'SUI AI Security Assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
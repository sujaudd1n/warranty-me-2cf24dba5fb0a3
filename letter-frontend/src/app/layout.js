import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
import CustomLayout from '../components/CustomLayout'

export const metadata = {
  title: 'Letter',
  description: 'A letter app.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomLayout>
          {children}
        </CustomLayout>
      </body>
    </html>
  )
}

import './globals.css'

export const metadata = {
  title: 'Smart Planner',
  description: 'AI-powered sprint planning assistant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

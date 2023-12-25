import Navbar from "@/components/navbar/Navbar"
import "./globals.css"
import { Nunito } from "next/font/google"
import ClientOnly from "@/components/ClientOnly"
import Modals from "@/components/modals/Modals"

const font = Nunito({ subsets: ["latin"] })

export const metadata = {
  title: "Airbnb",
  description: "Airbnb Clone",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <Navbar />
          <Modals title="hellow" isOpen />
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}

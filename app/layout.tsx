import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer/Footer";
import Image from 'next/image'
import vectorLeftPic from '../public/vector_left.svg'
import vector from '../public/vector.svg'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiAdaptive",
  description: "MultiAdaptive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Image
        width={85}
        height={0}
        alt=''
        src={vectorLeftPic}
        className="absolute top-[100px] left-0"
      />

      <Image
        width={85}
        height={0}
        alt=''
        src={vector}
        className="absolute top-0 right-0"
      />
      <body className={inter.className}>{children}
      <Footer></Footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-context";
import { Nunito } from "next/font/google";
import Header from "@/components/header/header";
import Footer from "@/components/footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Whispbot"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

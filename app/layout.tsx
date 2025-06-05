import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/session-context";
import { Nunito } from "next/font/google";
import Header from "@/components/header/header";
import Footer from "@/components/footer";
import { WebsocketProvider } from "@/components/websocket-context";
import { NotificationProvider } from "@/components/notification-context";

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
        <NotificationProvider>
          <SessionProvider>
            <WebsocketProvider
              url={
                process.env.NODE_ENV == "development"
                  ? "http://localhost:4000"
                  : process.env.WEBSOCKET_URL
              }
            >
              <Header />
              {children}
              <Footer />
            </WebsocketProvider>
          </SessionProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

"use client";

import Footer from "@/components/footer";
import Header from "@/components/header/header";
import { NotificationProvider } from "@/components/notification-context";
import { SessionProvider } from "@/components/session-context";
import StatusPage from "@/components/status-page";
import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";

export default function GlobalError({
  error
}: {
  error: Error & { digest?: string };
}) {
  const [errorId, setErrorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id: string = Sentry.captureException(error);
    setErrorId(id);
  }, [error]);

  return (
    <html>
      <body>
        <NotificationProvider>
          <SessionProvider>
            <Header />
            <StatusPage
              code={400}
              message={"A client sided error occured."}
              error_id={errorId}
            />
            <Footer />
          </SessionProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

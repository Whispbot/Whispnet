"use client";

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
        <StatusPage
          code={400}
          message={"A client error occured"}
          error_id={errorId}
        />
      </body>
    </html>
  );
}

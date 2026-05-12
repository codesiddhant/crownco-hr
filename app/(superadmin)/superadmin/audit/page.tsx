"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export default function SuperAdminAuditPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/hr/compliance");
  }, [router]);
  return null;
}

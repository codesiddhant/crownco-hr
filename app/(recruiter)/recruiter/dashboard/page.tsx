"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export default function RecruiterDashboardPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/hr/recruitment");
  }, [router]);
  return null;
}

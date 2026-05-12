"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export default function RecruiterCandidatesPage() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/hr/recruitment");
  }, [router]);
  return null;
}

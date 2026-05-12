"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/utils";

interface UserCellProps {
  name: string;
  avatar?: string;
  sub?: string;
  size?: "sm" | "md" | "lg";
}

export function UserCell({ name, avatar, sub, size = "md" }: UserCellProps) {
  const sizes = {
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-xs",
    lg: "h-12 w-12 text-sm"
  };
  return (
    <div className="flex items-center gap-3">
      <Avatar className={sizes[size]}>
        {avatar && <AvatarImage src={avatar} alt={name} />}
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium leading-tight">{name}</div>
        {sub && <div className="truncate text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

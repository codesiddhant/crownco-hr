"use client";

import * as React from "react";
import { Building2, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDataset } from "@/hooks/use-dataset";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setBranch } from "@/lib/store/uiSlice";

export function BranchSwitcher() {
  const ds = useDataset();
  const dispatch = useAppDispatch();
  const branchId = useAppSelector((s) => s.ui.branchId);
  const current = branchId ? ds.branches.find((b) => b.id === branchId) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 px-2.5">
          <Building2 className="h-3.5 w-3.5" />
          <span className="hidden font-medium md:inline">{current?.name ?? "All branches"}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Branch</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => dispatch(setBranch(null))}>
          <Building2 className="h-4 w-4" />
          All branches
          {!branchId && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {ds.branches.map((b) => (
          <DropdownMenuItem key={b.id} onClick={() => dispatch(setBranch(b.id))}>
            <span className="h-2 w-2 rounded-full bg-primary/60" />
            <div className="flex flex-1 flex-col text-left">
              <span className="text-sm font-medium">{b.name}</span>
              <span className="text-[11px] text-muted-foreground">{b.city} · {b.employees} employees</span>
            </div>
            {branchId === b.id && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

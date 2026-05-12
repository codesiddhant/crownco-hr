"use client";

import * as React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { store } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        {children}
        <Toaster
          position="top-right"
          theme="system"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast: "border rounded-2xl !shadow-elevated",
              title: "font-semibold"
            }
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}

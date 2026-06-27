import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Crownco HR — AI Workforce Operating System",
  description:
    "AI-powered HRMS for high-performance sales, CRM, field-force, and operations teams. Real attendance, productivity intelligence, automated reporting, and gamified rewards.",
  applicationName: "Crownco HR",
  authors: [{ name: "Crownco" }],
  keywords: [
    "HRMS",
    "AI HR",
    "Workforce Intelligence",
    "Attendance",
    "Productivity",
    "Payroll",
    "Crownco"
  ]
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" }
  ]
};

const themeInitScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme')||'light';var r=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;d.classList.remove('light','dark');d.classList.add(r);d.style.colorScheme=r;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

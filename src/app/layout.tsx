import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "QuickHire — Find Your Dream Job",
  description:
    "Great platform for job seekers searching for new career heights and passionate about startups.",
  keywords: ["jobs", "hiring", "career", "job board", "quickhire"],
  icons: {
    icon: "/QuickHire_Logo.png",
    shortcut: "/QuickHire_Logo.png",
    apple: "/QuickHire_Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          {/* AuthModal is global — triggered from anywhere via openAuthModal() */}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}

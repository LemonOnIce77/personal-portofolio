import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadyaumiladityawarman.netlify.app"
  ),
  title: {
    default: "Muhammad Yaumil Aditya Warman | Portfolio",
    template: "%s | Aditya Warman",
  },
  description:
    "Personal portfolio of Muhammad Yaumil Aditya Warman. Explore web applications, systems development, experiments, and tech projects.",
  keywords: [
    "Portfolio",
    "Next.js",
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Supabase",
    "Full-Stack",
    "Indonesia Developer",
    "Aditya Warman",
  ],
  authors: [{ name: "Muhammad Yaumil Aditya Warman" }],
  creator: "Muhammad Yaumil Aditya Warman",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    title: "Muhammad Yaumil Aditya Warman | Portfolio",
    description:
      "Explore featured web applications, software projects, and interactive experiments.",
    siteName: "Aditya Warman Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Yaumil Aditya Warman | Portfolio",
    description:
      "Explore featured web applications, software projects, and interactive experiments.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-neutral-950 text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
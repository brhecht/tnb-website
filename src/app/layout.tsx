import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The New Builder",
  description:
    "Bringing founders together to rethink how companies get built, with AI as the foundation, not just a tool.",
  metadataBase: new URL("https://thenewbuilder.ai"),
  openGraph: {
    title: "The New Builder",
    description:
      "Bringing founders together to rethink how companies get built, with AI as the foundation, not just a tool.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

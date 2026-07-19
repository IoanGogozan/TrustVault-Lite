import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "TrustVault Lite — Backend Security Demo",
  description:
    "Interactive portfolio demonstration of tenant isolation, RBAC/ABAC, secure sessions, private file delivery, hashed credentials, and audit logging."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

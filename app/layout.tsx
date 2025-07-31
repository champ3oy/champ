import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Cirlorm",
  description: "Welcome to my space",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased z-10`}
      >
        {children}
      </body>
    </html>
  );
}

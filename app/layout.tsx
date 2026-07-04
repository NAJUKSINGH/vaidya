import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Progpt",
  description: "A GPT-powered programming assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
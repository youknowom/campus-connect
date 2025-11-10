import { Inter } from "next/font/google";
import "./globals.css";
import ClerkProviderWrapper from "@/components/ClerkProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Campus Connect",
  description: "Connect with your campus community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProviderWrapper>{children}</ClerkProviderWrapper>
      </body>
    </html>
  );
}

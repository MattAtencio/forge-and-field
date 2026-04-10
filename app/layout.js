import { DM_Serif_Display, Crimson_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Forge & Field — Craft, Equip, Conquer",
  description:
    "Collect resources, craft gear, and send heroes on expeditions. Weekly seasonal events keep the adventure fresh.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Forge & Field",
  },
  openGraph: {
    title: "Forge & Field — Craft, Equip, Conquer",
    description:
      "Collect resources, craft gear, and send heroes on expeditions. Weekly seasonal events keep the adventure fresh.",
    type: "website",
    siteName: "Forge & Field",
  },
  twitter: {
    card: "summary",
    title: "Forge & Field — Craft, Equip, Conquer",
    description:
      "Collect resources, craft gear, and send heroes on expeditions.",
  },
};

export const viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${crimsonPro.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

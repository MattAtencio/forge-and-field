import { DM_Serif_Display, Outfit } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Forge & Field — Craft, Equip, Conquer",
  description:
    "Collect resources, craft gear, and send heroes on expeditions. Weekly seasonal events keep the adventure fresh.",
  manifest: "/manifest.json",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  );
}

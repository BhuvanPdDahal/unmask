import PlausibleProvider from "next-plausible";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import Modals from "@/components/Modals";
import Providers from "@/components/Providers";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Unmask",
        template: "%s - Unmask"
    },
    description: "Unmask is a safe space to share your experiences, thoughts, and feelings - completely anonymously. Whether you want to celebrate a victory, vent about a frustration, or simply connect with others who understand, Unmask provides a supportive and judgement-free community.",
    openGraph: {
        title: "Unmask",
        description: "Unmask is a safe space to share your experiences, thoughts, and feelings - completely anonymously. Whether you want to celebrate a victory, vent about a frustration, or simply connect with others who understand, Unmask provides a supportive and judgement-free community.",
        images: [
            `${baseUrl}/logo-light.svg`,
            `${baseUrl}/thumbnail.png`
        ]
    },
    icons: {
        icon: "/logo-icon.png"
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const domain = baseUrl.replace("https://", "");

    return (
        <html lang="en">
            <head>
                <PlausibleProvider domain={domain} />
                <script
                    defer
                    data-website-id={process.env.METRIK_WEBSITE_ID}
                    data-domain={new URL(baseUrl).host}
                    src="https://metrik-one.vercel.app/js/script.js"
                ></script>
            </head>
            <body className={plusJakartaSans.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <Providers session={session}>
                        {children}
                        <Modals />
                    </Providers>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}

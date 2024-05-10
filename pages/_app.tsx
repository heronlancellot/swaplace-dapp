import "@rainbow-me/rainbowkit/styles.css";
import "tailwindcss/tailwind.css";
import "../styles/global.css";
import {
  chains,
  getSiweMessageOptions,
  wagmiConfig,
} from "../lib/wallet/wallet-config";
import {
  SwapContextProvider,
  ShelfContextProvider,
  OffersContextProvider,
} from "@/lib/client/contexts";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { WagmiConfig } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import cc from "classcat";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const onest = localFont({
  src: "../public/fonts/Onest-VariableFont_wght.woff2",
  variable: "--font-onest",
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <SwapContextProvider>
          <ShelfContextProvider>
            <SessionProvider session={session}>
              <OffersContextProvider>
                <RainbowKitSiweNextAuthProvider
                  getSiweMessageOptions={getSiweMessageOptions}
                >
                  <RainbowKitProvider
                    locale="en-US"
                    theme={{
                      lightMode: lightTheme({
                        accentColor: "black",
                        borderRadius: "small",
                        overlayBlur: "small",
                      }),
                      darkMode: darkTheme({
                        accentColor: "#888888",
                        borderRadius: "small",
                        overlayBlur: "small",
                      }),
                    }}
                    chains={chains}
                  >
                    <Toaster />
                    <ThemeProvider enableSystem={true} attribute="class">
                      <main className={cc([onest.className])}>
                        <Component {...pageProps} />
                      </main>
                    </ThemeProvider>
                  </RainbowKitProvider>
                </RainbowKitSiweNextAuthProvider>
              </OffersContextProvider>
            </SessionProvider>
          </ShelfContextProvider>
        </SwapContextProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default MyApp;

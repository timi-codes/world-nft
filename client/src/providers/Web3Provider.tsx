"use client"

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, base, baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { ReactNode } from "react";

const config = createConfig(
    getDefaultConfig({
        chains: [baseSepolia],
        ssr: true,
        transports: {
            [baseSepolia.id]: http(
                process.env.NEXT_PUBLIC_WEB3_PROVIDER_URL || "https://rpc.sepolia.io",
            ),
        },
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
        appName: "WORLD TOKEN 🌍",
    }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider
                    theme="midnight"
                    customTheme={{
                        "--ck-overlay-background": "rgba(0, 0, 0, 0.5)",
                       "--ck-overlay-backdrop-filter": "blur(10px)",
                    }}
                    options={{
                        disclaimer: (
                            <>
                                By connecting your wallet you agree to the{" "}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://en.wikipedia.org/wiki/Terms_of_service"
                                >
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href="https://en.wikipedia.org/wiki/Privacy_policy"
                                >
                                    Privacy Policy
                                </a>
                            </>
                        ),
                    }}
                >
                    {children}
                </ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
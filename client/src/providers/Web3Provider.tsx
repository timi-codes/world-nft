"use client"

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [mainnet],
        transports: {
            // RPC URL for each chain
            [mainnet.id]: http(
                `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
            ),
        },

        // Required API Keys
        walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

        // Required App Info
        appName: "WORLD TOKEN 🌍",

        // Optional App Info
        appDescription: "Your App Description",
        appUrl: "https://family.co", // your app's url
        appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }) => {
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
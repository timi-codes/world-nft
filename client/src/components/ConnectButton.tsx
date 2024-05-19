
"use client";
import React  from "react";
import { ConnectKitButton } from "connectkit";
import { shortenAddress } from "@/utils";

const ConnectButton = () => { 
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                return (
                    <button role="button" onClick={show} className="px-7 py-3 text-black bg-white rounded-full text-[12px] font-medium">
                        {isConnected ? shortenAddress(address || "") : "Connect Wallet"}
                    </button>
                );
            }}
        </ConnectKitButton.Custom>
    )
}

export default ConnectButton;
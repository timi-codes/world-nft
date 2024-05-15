
"use client";
import React  from "react";
import { ConnectKitButton } from "connectkit";

const ConnectButton = () => { 
    return (
        <ConnectKitButton.Custom>
            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                return (
                    <button role="button" onClick={show} className="px-7 py-3 text-black/70 bg-white rounded-full text-[12px] font-medium hover:bg-opacity-90">
                        {isConnected ? address : "Connect Wallet"}
                    </button>
                );
            }}
        </ConnectKitButton.Custom>
    )
}

export default ConnectButton;
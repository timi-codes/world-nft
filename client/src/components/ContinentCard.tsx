
"use client";
import React from 'react';
import CountDown from "@/components/CountDown";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import avatar from "gradient-avatar"
import { Input } from "@/components/ui/input";
import { Continent } from '@/app/page';

const ContinentCard = ({ continent }: { continent: Continent }) => { 

    return (
        <div className="w-[420px] rounded-md bg-black/30 shadow-md" >
            <div
                style={{ '--image-url': `url(${continent.bg_image})` }} 
                className={"p-4 px-6 bg-contain bg-[image:var(--image-url)]"}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold opacity-95">{continent.name} #{continent.token_id}</h2>
                    <CountDown />
                </div>
                <Tilt>
                    <div className="flex items-center justify-center mt-14 mb-6">
                        <Image src={continent.image} width={220} height={220} alt="africa nft" />
                    </div>
                </Tilt>
            </div>
            <div className="border-b border-[0.5] border-[#545454]/20"></div>

            <div className="flex items-center justify-between py-3 px-3">
                <div className="flex items-center space-x-2">
                    <div className="h-[35px] w-[35px] rounded-full overflow-hidden border border-1 border-white/50">
                        <Image src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar(continent.highest_bidder))}`} width={35} height={35} alt="africa nft" />
                    </div>
                    <div>
                        <p className="text-sm font-light opacity-70">Current bid</p>
                        <p className="-mt-0 text-[17px]">{continent.highest_bid} ETH</p>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Input type="number" placeholder="+ 0.10" step={0.01} className="w-[90px] text-center h-[100] text-base border-b border-[0.5] border-[#545454]/40" />
                    <button role="button" className="bg-black/50 px-6 py-4 rounded-md text-[14px]">Place a bid</button>
                </div>
            </div>
        </div>
    );
}

export default ContinentCard;
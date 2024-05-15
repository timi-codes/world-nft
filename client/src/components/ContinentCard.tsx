
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
        <section className="w-[420px] rounded-md bg-black/30 shadow-md continent-card" >
            <div
                style={{ '--image-url': `url(${continent.bg_image})` }} 
                className={" relative p-4 px-6 bg-contain bg-[image:var(--image-url)]"}
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
                <div role="button" className='flex justify-between items-center absolute bg-white rounded-full text-black text-[10px] pl-2 pr-1 py-[3px] bottom-3 left-[10px] shadow-md'>
                    <span>View Bids</span>
                    <div className='flex justify-center items-center  bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full text-white ml-1 w-5 h-5 text-center'>+4</div>
                </div>
            </div>
            <div className="border-b border-[0.5] border-[#545454]/20"></div>

            <div className="flex items-center justify-between py-3 px-3">
                <div className="flex items-center space-x-2">
                    <div className="h-[35px] w-[35px] rounded-full overflow-hidden border border-1 border-white/50">
                        <Image src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar(continent.highest_bidder))}`} width={35} height={35} alt="africa nft" />
                    </div>
                    <div>
                        <p className="text-xs font-light opacity-70">Current bid</p>
                        <p className="-mt-0 text-[16px]">{continent.highest_bid} ETH</p>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Input type="number" placeholder="+ 0.10" step={0.01} className="w-[90px] text-center h-[100] text-base border-b border-[0.5] border-[#545454]/40 focus:border-white/70" />
                    <button role="button" className="bg-black/40 px-6 py-4 rounded-md text-[14px] hover:bg-white hover:text-black">Place a bid</button>
                </div>
            </div>
        </section>
    );
}

export default ContinentCard;
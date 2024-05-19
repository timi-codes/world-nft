import React from 'react';
import Image from "next/image";
import { shortenAddress } from '@/utils';
import avatar from "gradient-avatar"
import { formatEther } from 'viem';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';


export interface Bidder {
    amount: string,
    timestamp: string,
    address: string
}

export interface BiddersProps { 
    data: {
        bids: Bidder[];
        highestBid: string;
        highestBidder: string;
        onlyWinner: boolean;
        hasEnded?: boolean;
    },
    children?: React.ReactNode
}

const Bidders: React.FC<BiddersProps> = ({ data, children }) => { 

    return (
           <HoverCard>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-78">
                <div className="flex justify-between space-x-4">
                                {
                data.onlyWinner ? (
                    <div>
                        <p className="text-xs font-light opacity-70"> {data.hasEnded ? "Winner🥇" : "Current bid"}</p>
                        <p className="-mt-0 text-[16px]">{data.hasEnded ? shortenAddress(data.highestBidder) : `${formatEther(BigInt(data.highestBid))} ETH`}</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-md font-bold mb-3">Bidders</p>
                        <div></div>
                        {
                                data.bids.map((bid) => (
                                <div key={bid.timestamp} className='flex items-center justify-between w-full mb-2'>
                                    <div className='flex items-center'>
                                        <a href={`https://base-sepolia.blockscout.com/address/${bid.address}`} target='_blank' className='flex items-center hover:underline'>
                                            <Image src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar(bid.address))}`} width={28} height={28} alt="africa nft" className='rounded-full' />
                                            <p className="ml-3 text-[14px] opacity-70 font-bold">{shortenAddress(bid.address)} {data.highestBid === bid.amount && "👑"}</p>
                                        </a>
                                    </div>

                                    <p className="text-[14px] ml-6">{formatEther(BigInt(bid.amount))} ETH</p>
                                </div>
                            ))
                        }
                    </div>
                )
            }
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default Bidders;
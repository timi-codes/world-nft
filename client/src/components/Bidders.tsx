import React from 'react';
import Image from "next/image";
import { shortenAddress } from '@/utils';
import avatar from "gradient-avatar"
import { formatEther } from 'viem';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { ArrowTopRightIcon } from '@radix-ui/react-icons'


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
                {
                    data.onlyWinner && data.hasEnded ? (
                    <div>
                        <p className="text-xs font-light opacity-70">Current bid</p>
                            <p className="-mt-0 text-[16px]">{data.hasEnded ? shortenAddress(data.highestBidder) : `${formatEther(BigInt(data.highestBid))} ETH`}</p>
                            <div className='flex items-center'>
                                <a href={`https://base-sepolia.blockscout.com/address/${data.highestBidder}`} target='_blank' className='flex items-center hover:underline'>
                                    <Image src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar(data.highestBidder))}`} width={28} height={28} alt="africa nft" className='rounded-full' />
                                    <p className="ml-3 text-[14px] opacity-70 font-bold">{shortenAddress(data.highestBidder)} {data.highestBid}</p>
                                </a>
                                <ArrowTopRightIcon className='w-4 h-4 ml-2' />
                            </div>
                    </div>
                ) : (
                    <div>
                        <p className=" font-bold mb-2">Bidders</p>
                        {
                                data.bids.map((bid) => (
                                <div key={bid.timestamp} className='flex items-center justify-between w-full mb-[10px]'>
                                    <div className='flex items-center'>
                                        <a href={`https://base-sepolia.blockscout.com/address/${bid.address}`} target='_blank' className='flex items-center hover:underline'>
                                            <Image src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar(bid.address))}`} width={24} height={24} alt="africa nft" className='rounded-full' />
                                                <p className="ml-3 text-[14px] font-bold">{shortenAddress(bid.address)} {(data.highestBid == bid.amount) && data.hasEnded && "👑"}</p>
                                        </a>
                                        </div>
                                        <p className="text-[12px] ml-6 opacity-70">{formatEther(BigInt(bid.amount))} ETH</p>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            </HoverCardContent>
        </HoverCard>
    )
}

export default Bidders;
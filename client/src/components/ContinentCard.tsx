
"use client";
import React from 'react';
import CountDown from "@/components/CountDown";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import avatar from "gradient-avatar"
import { Input } from "@/components/ui/input";
import { Continent, EthereumAddress } from '@/app/page';
import { shortenAddress, showError, transformIPFSURL } from '@/utils';
import { useWriteContract } from 'wagmi';
import ContinentAuction from '@/contracts/ContinentAuction.json';
import ContinentToken from '@/contracts/ContinentToken.json';
import { formatEther, parseEther } from 'viem';
import { Label } from './ui/label';
import Bidders from './Bidders';

const AUCTION_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_AUCTION_CONTRACT_ADDRESS?.toLowerCase()) as EthereumAddress;
const TOKEN_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS?.toLowerCase()) as EthereumAddress;

const ContinentCard = ({ continent }: { continent: Continent }) => { 
    const highestBid = formatEther(BigInt(continent.auction.highestBid));
    const [bidAmount, setBidAmount] = React.useState(highestBid);
    const [startPrice, setStartPrice] = React.useState("");
    const [bidIncrement, setBidIncrement] = React.useState(0.001);
    const [duration, setDuration] = React.useState(3600);
    const hasCommenced = new Date(continent.auction.endTime).getTime() - Date.now()  > 0;
    const hasEnded = Boolean(continent.auction.endTime) && (new Date(continent.auction.endTime) < new Date());
    const isLive = hasCommenced && !hasEnded;
    const toBeAnnounced = !hasCommenced && !hasEnded;
    
    const nextMinBid = formatEther(BigInt(continent.auction.highestBid) + BigInt(continent.auction.bidIncrement));

    const { writeContract } = useWriteContract({
        mutation: {
            onError(error, variables, context) {
                console.log(error, variables, context)
                console.error(error.message)
                showError(error.message)
            },
        }
    })

    const placeBid = () => { 
        writeContract({
            abi: ContinentAuction.abi,
            address: AUCTION_CONTRACT_ADDRESS,
            functionName: 'placeBid',
            args: [BigInt(continent.tokenId)],
            value:  parseEther(bidAmount)
        })
    }

    const createAuction = () => { 
        writeContract({
            abi: ContinentAuction.abi,
            address: AUCTION_CONTRACT_ADDRESS,
            functionName: 'createAuction',
            args: [BigInt(continent.tokenId), parseEther(startPrice), parseEther(bidIncrement.toString()), BigInt(duration)],
        })
    }

    const buyCitizenship = async () => {
        writeContract({
            abi: ContinentToken.abi,
            address: TOKEN_CONTRACT_ADDRESS,
            functionName: 'buyCitizenship',
            args: [BigInt(continent.tokenId)],
            value: parseEther(continent.citizenTax)
        })
    }

    return (
        <section className={`flex flex-col relative  justify-center w-[420px] rounded-md bg-black/30 shadow-md opacity group overflow-hidden`}>
            <div className={`${toBeAnnounced ? "group-hover:blur-3x group-hover:bg-black" : ""}`}>
                <div
                    style={{ '--image-url': `url(/${continent.tokenId}.png)` } as React.CSSProperties}
                    className={" relative p-4 px-6 bg-contain bg-[image:var(--image-url)]"}
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold opacity-80">{continent.name}</h2>
                        {
                            hasCommenced ? (
                                <CountDown startDate={continent.auction.startTime} endDate={continent.auction.endTime} />
                            ) : hasEnded ? (
                                <span className="text-xs font-light opacity-70"> Ended</span>
                            ) : (
                                <span className="text-xs font-light opacity-70">TBA</span>
                            )
                        }
                    </div>
                    <Tilt>
                        <div className="flex items-center justify-center mt-14 mb-6">
                            <Image src={transformIPFSURL(continent.image)} width={220} height={220} alt="africa nft" />
                        </div>
                    </Tilt>
                    {isLive && (
                        <Bidders data={{ ...continent.auction, hasEnded, onlyWinner: false }} >
                            <div role="button" className='flex justify-between items-center absolute bg-white rounded-full text-black text-[10px] pl-2 pr-1 py-[3px] bottom-3 left-[10px] shadow-md'>
                                <span>{continent.auction.bids.length > 0 ? "View Bids" : "No bids"}</span>
                                <div className='flex justify-center items-center text-[9px] bg-[#27282B] border border-[0.5] border-[#2F3033] rounded-full text-white ml-1 w-5 h-5 text-center'>
                                    {continent.auction.bids.length > 9 && `+${continent.auction.bids.length}`}
                                    {continent.auction.bids.length <= 9 && continent.auction.bids.length}
                                </div>
                            </div>
                        </Bidders>
                    )}
                </div>

                <div className={`flex items-center justify-between py-3 px-3 border-t border-[0.5] border-[#545454]/20 ${toBeAnnounced ? "opacity-40" : ""}`}>
                    {
                        toBeAnnounced ? (
                            <div className="flex items-center justify-between w-full mx-4 opacity-90 h-full mt-2">
                                {
                                    continent.metadata.attributes.map((attr) => (
                                        <div key={`${attr.trait_type}-${attr.value}`}>
                                            <p className="text-xs font-light opacity-70">{attr.trait_type}</p>
                                            <p className="-mt-0 text-[14px]"> {attr.value}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                    <Bidders data={{ ...continent.auction, hasEnded, onlyWinner: false }}>
                                        <Image
                                            role="button"
                                            src={`data:image/svg+xml;utf8,${encodeURIComponent(avatar(continent.auction.highestBidder))}`}
                                            width={35}
                                            height={35}
                                            alt="africa nft"
                                            className='h-[35px] w-[35px] rounded-full overflow-hidden border border-1 border-white/50'
                                        />
                                    </Bidders>
                                <div>
                                    <p className="text-xs font-light opacity-70"> {hasEnded ? "Winner🥇" : "Current bid"}</p>
                                        <p className="-mt-0 text-[16px]">{hasEnded ? shortenAddress(continent.auction.highestBidder) : `${formatEther(BigInt(continent.auction.highestBid))} ETH`}</p>
                                </div>
                            </div>
                        )
                    }

                    {
                        isLive ? (
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    placeholder={`min ${nextMinBid}`}
                                    step={0.001}
                                    className="w-[93px] text-center h-[100] text-base border-b border-[0.5] border-[#545454]/40 focus:border-white/70"
                                    value={bidAmount}
                                    min={Number(nextMinBid)}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                />
                                <button
                                    role="button"
                                    className={`bg-white px-6 py-4 rounded-md text-[14px] hover:bg-white/80 text-black ${Number(bidAmount) >= Number(nextMinBid) ? "opacity-100" : "opacity-10"}`}
                                    onClick={placeBid}
                                    disabled={Number(bidAmount) >= Number(nextMinBid)}
                                >
                                    Place a bid
                                </button>
                            </div>
                        ) : hasEnded ? (
                                <button
                                    role="button"
                                    className="bg-white px-5 py-4 rounded-md text-[14px] hover:bg-white/80 text-black text-xs"
                                    onClick={buyCitizenship}
                                >
                                    Become a citizen ({continent.citizenTax} ETH)
                                </button>
                        ) : (<></>)
                    }
                </div>
            </div>
            {
                (toBeAnnounced && TOKEN_CONTRACT_ADDRESS == continent.owner) && (
                    <div className="hidden absolute group-hover:flex flex-col justify-center items-center rounded-md transform group-hover:translate-y-0 translate-y-4 transition duration-300 ease-in-out top-0 bottom-0 left-0 right-0 group-hover:bg-black">
                        <div className='space-y-4 w'>
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="start-price" className='text-xs font-normal opacity-75'>Start Price(ETH)</Label>
                                <Input value={startPrice} type="number" id="start-price" placeholder="0.001" step={0.001} className='py-6 text-[14px] rounded-md border-b border-[0.5] border-[#545454]/45 focus:border-white/70' onChange={(e) => setStartPrice(e.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="bid-increment" className='text-xs font-normal opacity-75'>Bid Increment(ETH)</Label>
                                <Input value={bidIncrement} type="number" id="bid-increment" placeholder="0.001" step={0.001} className=' py-6 text-[14px] rounded-md border-b border-[0.5] border-[#545454]/45 focus:border-white/70' onChange={(e) => setBidIncrement(Number(e.target.value))}/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="duration" className='text-xs font-normal opacity-75'>Duration(ms)</Label>
                                <Input value={duration} type="number" id="duration" placeholder="3600ms (1hr)" step={3600} className='py-6 text-[14px] rounded-md border-b border-[0.5] border-[#545454]/45 focus:border-white/70' onChange={(e) => setDuration(Number(e.target.value))} />
                            </div>
                        </div>
                        <button role="button" className="bg-white px-6 py-4 rounded-md text-[14px] text-black mt-8" onClick={() => createAuction()}>Start Auction</button>
                    </div>
                )
            }
        </section>
    );
}

export default ContinentCard;
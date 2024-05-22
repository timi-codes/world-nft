"use client";
import ContinentCard from "@/components/ContinentCard";
import Image from "next/image";
import React from "react";
import ConnectButton from "@/components/ConnectButton";
import useFetchContinents from "@/hooks/useFetchAuctions";
import { Bidder } from "@/components/Bidders";
import CardSkeloton from "@/components/CardSkeleton";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

export type EthereumAddress = `0x${string}`;
export interface Continent { 
  tokenId: number;
  name: string;
  image: string;
  owner: string;
  bg_image: string;
  auction: {
    status: number,
    highestBid: string,
    bidIncrement: string,
    highestBidder: string,
    startTime: string,
    endTime: string,
    bids: Bidder[]
  },
  metadata: {
    attributes: {trait_type: string, value: string}[]
  },
  citizenTax: string,
  citizens: EthereumAddress[]
}


export default function Home() {
  const { data: continents } = useFetchContinents();
  const scrollRef = useHorizontalScroll();

  console.log(continents?.data)

  const auctioned = continents?.data?.filter((continent: Continent) => Boolean(continent.auction.endTime) && (new Date(continent.auction.endTime) < new Date())).length;

  return (
    <main ref={scrollRef} className="flex h-screen  overflow-hidden flex-col  justify-between p-24 p-8 z-[-1]  after:-top-40 after:-left-52 after:rounded-full after:absolute after:-z-20 after:h-[400px] after:w-[400px] after:translate-x-1/3 after:bg-[#7D49EA]/15  after:content-[''] after:blur-2xl before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']  before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#7D49EA] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[400px] before:lg:h-[360px] before:-bottom-40 before:right-0 before:hidden">
      <div className="flex flex-col justify-between sticky -left-0 w-full -mt-4">
        <div className="flex justify-end items-center w-full min-h-[48px] space-x-6 ">
          <div className="flex space-x-4">
            <a href={`${process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_URL}`} target="_blank">
              <Image src="/opensea.svg" width={30} height={30} alt="logo" />
            </a>
            <a href={`https://base-sepolia.blockscout.com/address/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}`} target="_blank" className="flex justify-center items-center bg-[#5353D3] rounded-full w-[30px] h-[30px]">
              <Image src="/blockscout.svg" width={20} height={20} alt="logo" />
            </a>
          </div>
          <ConnectButton />
        </div>

        <div className="relative z-[-1] flex flex-col text-center place-items-center ">
          <div className="flex items-center mb-3 text-2xl 2xl:text-4xl font-semibold">
            <span className="">WANNA OWN A PIECE OF THE W</span> <Image src="/earth.png" width={20} height={20} alt="logo" /><span className="mr-2">RLD?</span>
          </div>
          <p className="font-mono m-0 max-w-[60ch] text-sm 2xl:text-base opacity-80 mt-2">
            Collect unique NFTs representing Africa, Asia, Europe, North America, South America, Australia, and Antarctica
          </p>

        </div>

        <div className="py-8 text-center opacity-80">
          <p><span className="font-bold">7</span> Continents, <span className="font-bold">7</span> NFTs, <span className="font-bold">7</span> Owners</p>
          <p className="bg-gradient-to-r from-rose-600 via-amber-500 to-orange-400 inline-block text-transparent bg-clip-text font-bold">Auctioned Ended: {auctioned}/7</p>
          </div>
      </div>
      <div className="flex flex-col"> 
        <div className="flex self-start	space-x-8 relative bottom-0 h-full content-end justify-self-end pr-8">
          {
            continents?.data && continents?.data.map((continent: Continent) => (
              <ContinentCard continent={continent} key={continent.tokenId} />
            ))
          }
          {
            !continents?.data && Array.from({ length: 5 }).map((_, index) => (
              <CardSkeloton key={index} />
            ))
          }
        </div>


      </div>
      <div className="flex flex-col justify-center text-sm text-center sticky  -left-0 w-full mt-4">
        <a href="https://www.github.com/timi-codes/world-nft" className="opacity-30" target="_blank">View on Github</a>
        <a href="#" target="_blank" className="opacity-60">Designed & Developed by timicodes 🍁</a>
      </div>
    </main>
  );
}

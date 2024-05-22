"use client";
import ContinentCard from "@/components/ContinentCard";
import Image from "next/image";
import React from "react";
import ConnectButton from "@/components/ConnectButton";
import useFetchContinents from "@/hooks/useFetchAuctions";
import { Bidder } from "@/components/Bidders";
import CardSkeloton from "@/components/CardSkeleton";

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

  return (
    <main className="flex h-screen overflow-hidden flex-col items-center justify-between p-24 p-8 z-[-1] place-items-center after:-top-40 after:-left-52 after:rounded-full after:absolute after:-z-20 after:h-[400px] after:w-[400px] after:translate-x-1/3 after:bg-[#7D49EA]/15  after:content-[''] after:blur-2xl before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']  before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#7D49EA] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[400px] before:lg:h-[360px] before:-bottom-40 before:right-0 before:hidden">

      <div className="flex justify-end items-center w-full min-h-[48px] space-x-6">
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
        <p className="bg-gradient-to-r from-rose-600 via-amber-500 to-orange-400 inline-block text-transparent bg-clip-text">Auctioned: 4/7</p>
      </div>
      <div>
        <div className="flex wrap space-x-8 overflow-x">
          {
            continents?.data && continents?.data.slice(0, 3).map((continent: Continent) => (
              <ContinentCard continent={continent} key={continent.tokenId} />
            ))
          }
          {
            !continents?.data && Array.from({ length: 3 }).map((_, index) => (
              <CardSkeloton key={index} />
            ))
          }
        </div>

        <div className="flex flex-col pt-5 -mb-3 text-sm max-w-sm ">
          <a href="https://www.github.com/timi-codes/world-nft" className="opacity-30" target="_blank">View on Github</a>
          <a href="#" target="_blank" className="opacity-60">Designed & Developed by timicodes 🍁</a>
        </div>
      </div>
    </main>
  );
}

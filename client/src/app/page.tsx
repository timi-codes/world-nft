"use client";
import ContinentCard from "@/components/ContinentCard";
import Image from "next/image";
import React from "react";
import ConnectButton from "@/components/ConnectButton";
import { continents } from "@/constants";

export interface Continent { 
  token_id: number;
  name: string;
  image: string;
  bg_image: string;
  highest_bid: number;
  highest_bidder: string;
}

export default function Home() {

  return (
    <main className="flex h-screen overflow-hidden flex-col items-center justify-between p-24 p-8 z-[-1] place-items-center after:-top-40 after:-left-52 after:rounded-full after:absolute after:-z-20 after:h-[400px] after:w-[400px] after:translate-x-1/3 after:bg-[#7D49EA]/15  after:content-[''] after:blur-2xl before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']  before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#7D49EA] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[400px] before:lg:h-[360px] before:-bottom-40 before:right-0 before:hidden">

      <div className="flex justify-end items-center w-full">
        <ConnectButton />
      </div>

      <div className="relative z-[-1] flex flex-col text-center place-items-center -mt-32">
        <div className="flex items-center mb-3 text-2xl 2xl:text-4xl font-semibold h-[20px]">
          <span>WANNA OWN A PIECE OF THE W</span> <Image src="/earth.png" width={20} height={20} alt="logo" /><span className="mr-2">RLD?</span>
        </div>
        <p className="font-mono m-0 max-w-[60ch] text-sm 2xl:text-base opacity-80 mt-2">
          Collect unique NFTs representing Africa, Asia, Europe, North America, South America, Australia, and Antarctica
        </p>
      </div>

      <div className="flex space-x-8 overflow-x-auto">
        {
          continents.map((continent) => (
            <ContinentCard continent={continent} key={continent.token_id} />
          ))
        }
      </div>

    </main>
  );
}

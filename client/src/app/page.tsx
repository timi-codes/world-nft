"use client";
import ContinentCard from "@/components/ContinentCard";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
export interface Continent { 
  token_id: number;
  name: string;
  image: string;
  bg_image: string;
  highest_bid: number;
  highest_bidder: string;
}

const continents: Continent[] = [
  {
    name: "Africa",
    token_id: 1,
    image: "/africa.png",
    bg_image: "/africa-pattern.png",
    highest_bid: 0.23,
    highest_bidder: "david.et",
  },
  {
    name: "Asia",
    token_id: 2,
    image: "/asia.png",
    bg_image: "/asia-pattern.png",
    highest_bid: 0.24,
    highest_bidder: "nakamotojjk",
  }, {
    name: "Europe",
    token_id: 3,
    image: "/europe.png",
    bg_image: "/europe-pattern.png",
    highest_bid: 0.25,
    highest_bidder: "satoshi.eth",
  },
  // {
  //   name: "North America",
  //   token_id: 4,
  //   image: "/north-america.png",
  //   bg_image: "/north-america-pattern.png",
  //   highest_bid: 0.26,
  //   highest_bidder: "vitalik.eth",
  // },
  // {
  //   name: "South America",
  //   token_id: 5,
  //   image: "/south-america.png",
  //   bg_image: "/south-america-pattern.png",
  //   highest_bid: 0.27,
  //   highest_bidder: "gavin.eth",
  // },
  // {
  //   name: "Australia",
  //   token_id: 6,
  //   image: "/australia.png",
  //   bg_image: "/australia-pattern.png",
  //   highest_bid: 0.28,
  //   highest_bidder: "charlie.eth",
  // },
  // {
  //   name: "Antarctica",
  //   token_id: 7,
  //   image: "/antarctica.png",
  //   bg_image: "/antarctica-pattern.png",
  //   highest_bid: 0.29,
  //   highest_bidder: "satoshi.eth",
  // }
]

export default function Home() {

  return (
    <main className="flex h-screen overflow-x-hidden flex-col  items-center justify-between p-24 p-8 z-[-1] place-items-center after:-top-40 after:-left-52 after:rounded-full after:absolute after:-z-20 after:h-[400px] after:w-[400px] after:translate-x-1/3 after:bg-[#7D49EA]/15  after:content-[''] after:blur-2xl before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']  before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#7D49EA] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[400px] before:lg:h-[360px] before:-bottom-40 before:right-0 before:hidden">

      <div className="flex justify-end items-center w-full">
        <button className="px-8 py-4 text-black bg-white rounded-full text-sm font-medium">
          Connect Wallet
        </button>
      </div>

      <div className="relative z-[-1] flex flex-col text-center place-items-center -mt-32">
        

        <div className="flex items-center mb-3 text-2xl font-semibold h-[20px]">
          <span>WANNA OWN A PIECE OF THE W</span> <Image src="/earth.png" width={20} height={20} alt="logo" /><span className="mr-2">RLD?</span>
        </div>
        <p className="font-mono m-0 max-w-[60ch] text-sm opacity-80 mt-2">
          Collect unique NFTs representing Africa, Asia, Europe, North America, South America, Australia, and Antarctica
        </p>

      </div>

      <div className="flex flex-nowrap space-x-8 overflow-x-auto">
        {
          continents.map((continent) => (
            <ContinentCard continent={continent} key={continent.token_id} />
          ))
        }
      </div>

    </main>
  );
}

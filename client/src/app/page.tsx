import CountDown from "@/components/CountDown";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col h-screen items-center justify-between p-24 p-10 z-[-1] place-items-center after:-top-40 after:-left-52 after:rounded-full after:absolute after:-z-20 after:h-[400px] after:w-[400px] after:translate-x-1/3 after:bg-[#7D49EA]/45  after:content-[''] after:blur-2xl before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-['']  before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#7D49EA] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[400px] before:lg:h-[360px] before:-bottom-40 before:right-0">


        {/* <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div> */}

      {/* </div> */}

      <div className="relative z-[-1] flex flex-col text-center place-items-center">
        <div className="">
          <h2 className="mb-3 text-6xl font-semibold">
            Own <br/>a piece of the world
          </h2>
        </div>
        <p className="font-mono m-0 max-w-[60ch] text-sm opacity-80 mt-2">
          Collect unique NFTs representing Africa, Asia, Europe, North America, South America, Australia, and Antarctica
        </p>
        <button className="mt-8 px-8 py-4 text-black bg-white rounded-full text-sm font-medium">
          Connect Wallet
        </button>
      </div>

      <div>
        <div className="w-[400px] bg-black rounded-md p-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold">Africa #1</h2>
            <CountDown />
          </div>
        </div>
      </div>

    </main>
  );
}

import { toast } from "sonner";

export function shortenAddress(address: string) {
    let shortenedAddress = address ? address.slice(0, 5) + "..." + address.slice(-5) : "";
    return shortenedAddress;
}

export const transformIPFSURL = (url: string) => {
    if (!url || url === "imageURI/") {
        return "/assets/image/fallback.svg";
    }
    if (url.includes("ipfs://")) {
        return url
            .replace(
                "ipfs://",
                `${process.env.NEXT_PUBLIC_IPFS_GATEWAY || ("https://ipfs.decentralized-content.com" as string)}/ipfs/`
            )
            .replace(/"/g, "");
    }
    try {
        new URL(url);
    } catch (e: any) {
        return "/assets/image/fallback.svg";
    }
    return url;
};


type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type FetchAPIResponse<T> = {
    success: boolean;
    data: T;
    message?: string;
};

export const fetchAPI = async <T>(
    path: string,
    method: HttpMethod = "GET",
    _data?: Record<string, any>
): Promise<FetchAPIResponse<T>> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: _data ? JSON.stringify(_data) : undefined,
    });

    const data = await response.json() as T;
    return data as FetchAPIResponse<T>;;
};

export const showError = (message: string ) => {

    if (message.includes("insufficient funds")) {
        toast.error("Insufficient funds", {
            description: "You do not have enough funds to place this bid. Please top up your wallet and try again. The cost of transaction is calculated as `gas * gas fee + value`",
            position: "top-left",
        })
    }

    if (message.includes("Ownable: caller is not the owner")) {
        toast.error("Transaction failed", {
            description: "You can start an auction only if you own the continent",
            position: "top-left",
        });
    }

    if (message.includes("Continent does not exist")) {
        toast.error("Transaction failed", {
            description: "Continent does not exist",
            position: "top-left",
        });
    }

    if (message.includes("You already own this continent")) {
        toast.error("Transaction failed", {
            description: "You already own this continent",
            position: "top-left",
        });
    }

    if (message.includes("Not enough Ether sent to cover citizenship tax")) {
        toast.error("Transaction failed", {
            description: "Not enough Ether sent to cover citizenship tax",
            position: "top-left",
        });
    }
}
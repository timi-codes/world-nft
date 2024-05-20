export function shortenAddress(address: string) {
    console.log(address)
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
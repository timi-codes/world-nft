export function shortenAddress(address: string) {
    let shortenedAddress = address.slice(0, 5) + "..." + address.slice(-5);
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
            .replace(/"/g, ""); // Some test data contains wrapping strings
    }
    try {
        new URL(url);
    } catch (e: any) {
        return "/assets/image/fallback.svg";
    }
    // TODO: handle other ipfs formats as we find them
    return url;
};

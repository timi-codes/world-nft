export function shortenAddress(address: string) {
    let shortenedAddress = address.slice(0, 5) + "..." + address.slice(-5);
    return shortenedAddress;
}
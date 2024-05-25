# WORLD NFT 
[CNT TOKEN](https://base-sepolia.blockscout.com/token/0x8d098d44032e93528049357611A25Dab4C20230e): This collection is made up world's continents (Africa, Asia, Europe, North America, South America, Australia, and Antarctica). Each continent NFT have an associated opensea metadata standard with a limited supply of 7 items.
Tokens are minted to the contract address immediately during deployment. Then contract owner get to kickstart the auction by calling the `createAuction` methods in ContinentAuction.sol. ContinentAuction.sol is the contract that manages the auctions and bidding. it is initialised with the token address on deployment so tha 

## Deployed to Base 
[CNT TOKEN](https://base-sepolia.blockscout.com/token/0xC50C83af572e34c0E9de43Be504A3ee4793d59fd)
[Auction Contract](https://base-sepolia.blockscout.com/token/0x572610C23EdA4eD0799447f515D79565644E7161)

## [Backend Endpoint](https://world-token-05ceac17e8ac.herokuapp.com)

`/auctions` - merged token data from zora indexer and contract data to display the list of continents.

`/citizenship/join` - api to join a continent as a citizen after auction. transaction should be signed on the dapp and signed transaction hash is send to the backend to be executed. 

## [Frontend DAPP](https://world-q67k4f32u-payscout.vercel.app/)
The frontend showcases a public english auction where the highest bidder automatically wins the token after the deadline  
Tools used - Wagmi, Connectkits, Viem, ReactQuery

## [IPFS Metadata Script](https://github.com/timi-codes/world-nft/blob/main/scripts/deploy_metadata.mjs)

This script spins up a [Helia](https://github.com/ipfs/helia) IPFS Node and Pinned collection to Pinata pinning services.
Tools: Helia, Pinata, IPFS Desktop

## Smart Contract

I developed two contracts. CNT is an ERC721 NFT. Tokens are minted to the contract address immediately during deployment. Then contract owner get to kickstart the auction by calling the `createAuction` methods in ContinentAuction.sol. ContinentAuction is initialised with the token address on deployment.
1. Deployed to [CNT TOKEN](https://base-sepolia.blockscout.com/token/0x8d098d44032e93528049357611A25Dab4C20230e) [File](https://github.com/timi-codes/world-nft/blob/main/contracts/ContinentToken.sol)
2. Auction Smart Contract [](https://github.com/timi-codes/world-nft/blob/main/contracts/ContinentAuction.sol)



## Loom Submission 
1. Walthrough of Project and Backend - [Video 1](https://www.loom.com/share/ed95eb3c652a43a6a8ce567eff66106d)
2. Token Contract - [Video 2](https://www.loom.com/share/727d0b41e0e84ddc940bbc88df2f69da)
3. Continent Auction - [Video 3](https://www.loom.com/share/a7a4445fdee94728bddc2b1a2ea82e83)
4. Test and Closing Remarks - [Video 4](https://www.loom.com/share/efd5ec9436824d3aa5082965f0f28cb2)

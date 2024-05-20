# WORLD NFT 
[CNT TOKEN](https://base-sepolia.blockscout.com/token/0x8d098d44032e93528049357611A25Dab4C20230e): This collection is made of up world's continents (Africa, Asia, Europe, North America, South America, Australia, and Antarctica). Each continent NFT have an associated opensea metadata standard with a limited supply of 7 items.
Tokens are minted to the contract address immediately during deployment. Then contract owner get to kickstart the auction by calling the `createAuction` methods in ContinentAuction.sol. ContinentAuction.sol is the contract that manages the auctions and bidding. it is initialised with the token address on deployment so tha 

## Deployed to Base 

[CNT TOKEN](https://base-sepolia.blockscout.com/token/0x8d098d44032e93528049357611A25Dab4C20230e)

## [Backend Endpoint](https://world-token-05ceac17e8ac.herokuapp.com)
    - `/auctions` - merged token data from zora indexer and contract data to display the list of continents.
    - `/citizenship/join` - api to join a continent as a citizen after auction. transaction should be signed on the dapp and signed transaction hash is send to the backend to be executed. 

## [Frontend DAPP](https://world-q67k4f32u-payscout.vercel.app/)
    The frontend showcases a public english auction where the highest bidder automatically wins the token after the deadline  
    - Tools used - Wagmi, Connectkits, Viem, ReactQuery

## [IPFS Metadata Script](https://github.com/timi-codes/world-nft/blob/main/scripts/deploy_metadata.mjs)
    This script spins up a [Helia]() IPFS Node and Pinned collection to Pinata pinning services.
    - Tools: Helia, Pinata, IPFS Desktop

## Smart Contract
    - I developed two contracts. CNT is an ERC721 NFT. Tokens are minted to the contract address immediately during deployment. Then contract owner get to kickstart the auction by calling the `createAuction` methods in ContinentAuction.sol. ContinentAuction is initialised with the token address on deployment.
    - Deployed to [CNT TOKEN](https://base-sepolia.blockscout.com/token/0x8d098d44032e93528049357611A25Dab4C20230e) [File](https://github.com/timi-codes/world-nft/blob/main/contracts/ContinentToken.sol)
    - Auction Smart Contract [](https://github.com/timi-codes/world-nft/blob/main/contracts/ContinentAuction.sol)



## Loom Submission [Video 1](https://www.loom.com/share/ed95eb3c652a43a6a8ce567eff66106d)
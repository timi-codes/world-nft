# WORLD NFT 
This collection is made of up world's continents (Africa, Asia, Europe, North America, South America, Australia, and Antarctica). Each continent NFT have an associated opensea metadata standard with a limited supply of 7 items.
Tokens are minted to the contract address immediately during deployment. Then contract owner get to kickstart the auction by calling the `createAuction` methods in `ContinentAuction.sol`. `ContinentAuction.sol` is the contract that manages the auctions and bidding. it is initialised with the token address on deployment.

## Technologies
- Solidity
- Truffle
- Wagmi
- Express
- Typescript
- React
- Connectkits, 
- Viem, 
- ReactQuery
- Docker


## Requirement
Node 18 LTS/Hydrogen (LTS is recommended)
Yarn 1+ (1.22.19 is recommended)

## Setup 
### Contracts
1. Create an .env file and add variables.
2. Install all the packages
3. Compile contracts
    ```
    truffle compile && truffle migrate
    ```
4. Deploy contracts
    ```
    truffle migrate --network sepolia
    ```

### Frontend
1. Change directory to client folder
    ```
    cd client
    ```
2. Create an .env file and add variables using `.env.example`
3. Install all the packages
    ```
    yarn
    ```
4. Start frontend application
    ```
    yarn dev
    ```

### Backend
1. Change directory to client folder
    ```
    cd backend
    ```
2. Create an .env file and add variables.
3. Install all the packages
    ```
    yarn
    ```
4. Start backend server
    ```
    yarn dev
    ```
    ### Endpoints

    `/auctions` - merged token data from zora indexer and contract data to display the list of continents.

    `/citizenship/join` - api to join a continent as a citizen after auction. transaction should be signed on the dapp and signed transaction hash is send to the backend to be executed. 


## Deployment
[Frontend](https://world-nft-gamma.vercel.app/)

[Backend](https://world-token-05ceac17e8ac.herokuapp.com)

#### Contract( Chain - Base Sepolia)
[CNT TOKEN Contract ](https://base-sepolia.blockscout.com/token/0xC50C83af572e34c0E9de43Be504A3ee4793d59fd)

[Auction Contract](https://base-sepolia.blockscout.com/token/0x572610C23EdA4eD0799447f515D79565644E7161)

[IPFS Metadata Script](https://github.com/timi-codes/world-nft/blob/main/scripts/deploy_metadata.mjs)
This script spins up a [Helia](https://github.com/ipfs/helia) IPFS Node and Pinned collection to Pinata pinning services.
Tools: Helia, Pinata, IPFS Desktop

## Contributors
- [timicodes](https://github.com/timi-codes)


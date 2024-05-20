import { RequestHandler } from "express";
import Web3 from 'web3'
import auctionBuild from "../contracts/ContinentAuction.json";
import continentBuild from "../contracts/ContinentToken.json"
import { AbiItem } from 'web3-utils';
import { gqlFetch } from "./utils";
import { GET_CONTRACT_TOKENS, ZORA_CLIENT_URL } from "../constants";


const convertToNumber = (value: string) => Number(BigInt(value).toString());

interface ResponseData {
    success: boolean;
    message: string;
    data?: any;

}

interface Auction {
    status: string,
    highestBid: string,
    bidIncrement: string,
    highestBidder: string,
    startTime: string,
    endTime: string,
    bids: any[]
}
    
interface Token { 
    address: string;
    name: string;
    tokenId: string;
    owner: string;
    image: string;
    metadata: any;
    // citizenTax: string,
    // citizens: string[]

}

export const getAuctions: RequestHandler<{}, ResponseData, {}, {}> = async (req, res) => {
    try {

        const web3 = new Web3(`${process.env.WEB3_PROVIDER_URL}`)
        const auctionContract = new web3.eth.Contract(auctionBuild.abi as AbiItem[], process.env.AUCTION_CONTRACT_ADDRESS);
        const continentContract = new web3.eth.Contract(continentBuild.abi as AbiItem[], process.env.TOKEN_CONTRACT_ADDRESS);

        const response = await gqlFetch(ZORA_CLIENT_URL, GET_CONTRACT_TOKENS, {
            collectionAddresses: [process.env.TOKEN_CONTRACT_ADDRESS]
        });
        const { data: tokenData } = await response.json();
        const tokens = tokenData.tokens.nodes.map((node: any) => node.token);



        const auctions = await Promise.all(tokens.map(async (token: any) => { 
            const auction: Auction = await auctionContract.methods.auctions(Number(token.tokenId)).call();
            const bids: string[] = await auctionContract.methods.getBids(Number(token.tokenId)).call();
            const continent: { citizenTax: string, citizens: string[] } = await continentContract.methods.continents(Number(token.tokenId)).call();

            return {
                address: token.collectionAddress,
                name: token.name,
                tokenId: token.tokenId,
                owner: token.owner,
                image: token.image.url,
                metadata: token.metadata,
                auction: {
                    status: BigInt(auction.status).toString(),
                    highestBid: BigInt(auction.highestBid).toString(),
                    bidIncrement: BigInt(auction.bidIncrement).toString(),
                    highestBidder: BigInt(auction.highestBidder).toString(),
                    startTime: convertToNumber(auction.startTime) > 0 ? new Date(convertToNumber(auction.startTime) * 1000) : null,
                    endTime: convertToNumber(auction.endTime) > 0 ? new Date(convertToNumber(auction.endTime) * 1000) : null,
                    bids: bids.map((bid: any) => ({ 
                        amount: convertToNumber(bid[0]),
                        timestamp: new Date(convertToNumber(bid[1]) * 1000),
                        address: convertToNumber(bid[2])
                })).sort((a: any, b: any) => b.amount - a.amount)
                },
                citizenTax: convertToNumber(continent.citizenTax),
                citizens: continent.citizens
            }
        }));

        return res.send({
            success: true,
            message: "Citizen added successfully",
            data: auctions
        });
    } catch (err: any) {
        return res.status(400).send({ success: false, message: err.message })
    }
}
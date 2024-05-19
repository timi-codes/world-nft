import { RequestHandler } from "express";
import Web3 from 'web3'
import { abi } from "@contracts/build/ContinentAuction.json";
import { AbiItem } from 'web3-utils';
import { gqlFetch } from "./utils";
import { GET_CONTRACT_TOKENS, ZORA_CLIENT_URL } from "../constants";

interface ResponseData {
    success: boolean;
    message: string;
    data?: any;

}

export const getAuctions: RequestHandler<{}, ResponseData, {}, {}> = async (req, res) => {
    try {
        const web3 = new Web3(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`)
        const auctionContract = new web3.eth.Contract(abi as AbiItem[], process.env.AUCTION_CONTRACT_ADDRESS);

        const response = await gqlFetch(ZORA_CLIENT_URL, GET_CONTRACT_TOKENS, {
            collectionAddresses: [process.env.TOKEN_CONTRACT_ADDRESS]
        });
        const { data: tokenData } = await response.json();
        const tokens = tokenData.tokens.nodes.map((node: any) => node.token);

        const auctions = await Promise.all(tokens.map(async (token: any) => { 
            const auction = await auctionContract.methods.auctions(Number(token.tokenId)).call();
            const bids = await auctionContract.methods.getBids(Number(token.tokenId)).call();
  
            return {
                address: token.collectionAddress,
                name: token.name,
                tokenId: token.tokenId,
                owner: token.owner,
                image: token.image.url,
                metadata: token.metadata,
                auction: {
                    status: auction.status,
                    highestBid: auction.highestBid,
                    bidIncrement: auction.bidIncrement,
                    highestBidder: auction.highestBidder,
                    startTime: auction.startTime > 0 ? new Date(auction.startTime * 1000) : null,
                    endTime: auction.startTime > 0  ? new Date(auction.endTime * 1000) : null,
                    bids: bids.map((bid: any) => ({ amount: bid[0], timestamp: new Date(bid[1] * 1000), address: bid[2] })).sort((a: any, b: any) => b.amount - a.amount)
                }
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
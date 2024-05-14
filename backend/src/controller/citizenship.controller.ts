import { RequestHandler } from "express";
import Web3 from 'web3'

interface CitizenPayload {
    signed_trx_hash: string;
}

interface ResponseData {
    success: boolean;
    message: string;
    data?: any;

}

const web3 = new Web3(process.env.WEB3_PROVIDER as string)

export const joinCitizenship: RequestHandler<{}, ResponseData, CitizenPayload, {}> = async (req, res) => {
    try {
        const { signed_trx_hash } = req.body
        
        const trx = await web3.eth.sendSignedTransaction(signed_trx_hash)

        return res.send({
            success: true,
            message: "Citizen added successfully",
            data: {
                trx_hash: trx.transactionHash,
                block_number: trx.blockNumber,
                from: trx.from,
                to: trx.to,
                status: trx.status
            }
        });
    } catch (err: any) {
        return res.status(400).send({ success: false, message: err.message })
    }
}
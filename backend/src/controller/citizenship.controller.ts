import { RequestHandler } from "express";

interface CitizenPayload {
    wallet: string;
    token_id: number;
}

interface ResponseData {
    success: boolean;
    message: string;
    data?: any;
}

export const joinCitizenship: RequestHandler<{}, ResponseData, CitizenPayload, {}> = async (req, res) => {
    try {
        const data = req.body
        //TODO: call smart contract to add a citizen to a continent
        return res.send({ success: true, message: "Citizen added successfully", data: {} })
    } catch (err: any) {
        return res.status(400).send({ success: false, message: err.message })
    }
}
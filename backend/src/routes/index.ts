import { Router } from "express";
import * as CitizenshipController from '../controller/citizenship.controller'
import * as AuctionController from '../controller/auction.controller'


const router = Router()
router.post("/citizenship/join", CitizenshipController.joinCitizenship)
router.get("/auctions", AuctionController.getAuctions)

export default router;
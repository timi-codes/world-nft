import { Router } from "express";
import * as CitizenshipController from '../controller/citizenship.controller'

const router = Router()
router.post("/citizenship/join", CitizenshipController.joinCitizenship)

export default router;
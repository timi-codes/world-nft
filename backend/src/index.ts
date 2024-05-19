import express, { Application } from "express";
import { Request, Response } from 'express'
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'

dotenv.config()

const port = process.env.PORT || 4000

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
    res.send("BACKEND IS RUNNING!")
})
app.use(routes);

app.listen(port, () => {
    console.log(`[Server]: is running on port http://localhost:${port}`)
})


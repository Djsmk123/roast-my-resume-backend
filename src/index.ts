import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { routes } from './api/routes'
import { getRoastCount } from './services/roastCount';
import dotenv from 'dotenv';
import generateRoast from './services/roastService';
import multer from 'multer';
import cors from 'cors';
const upload = multer();
dotenv.config();


const app = express()
const port = process.env.PORT || 8080
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],

    }
));

app.get('/', (_req: Request, res: Response) => {
    //health check
    res.status(200).send("Server is running")
})


app.get(`/${routes.roastCount}`, getRoastCount)
app.post(`/${routes.roast}`, upload.any(), generateRoast)





app.listen(port, () => {
    return console.log(`Server is listening on ${port}`)
})


export default app

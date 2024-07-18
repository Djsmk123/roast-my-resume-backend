import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { routes } from './api/routes'
import { getRoastCount } from './services/roastCount';
import dotenv from 'dotenv';
import generateRoast from './services/roastService';
import multer from 'multer';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import getRoastData from './services/roast-Data';
import bot from './services/telegramService';
import roastLinkedIn from './services/roastLinkedIn';
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
// Rate limiter middleware
const apiLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 10,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(apiLimiter);


app.get('/', (_req: Request, res: Response) => {
    //health check
    res.status(200).send("Server is running")
})


app.get(`/${routes.roastCount}`, getRoastCount)
app.post(`/${routes.roast}`, upload.any(), generateRoast)

app.get('/roast/:id', getRoastData);

app.post('/roastLinkedIn', upload.any(), roastLinkedIn);

bot.on("polling_error", console.log);

app.listen(port, () => {
    return console.log(`Server is listening on ${port}`)
})


export default app

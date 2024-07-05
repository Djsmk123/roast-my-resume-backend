import { Request, Response } from 'express';
import firebase from "../db/db";

export async function getRoastCount(request: Request, res: Response) {
    //count the number of documents in the collection
    //check if development or production
    if (process.env.NODE_ENV === 'development') {
        console.log("Development mode")
        return res.status(200).send("Roast count is 0")
    }
    const snapshot = await firebase.resumeRoastCollection.get();
    const roastCount = snapshot.size + 800//initial count of 500 roast,you can change it to 0 if you want to start from 0;
    return res.status(200).send(`Roast count is ${roastCount}`)
}

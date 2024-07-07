
//meme service
import { Meme, Count, MemeData } from "../models/meme_model";
import dotenv from 'dotenv';
dotenv.config();



const apiKey = process.env.GLIF_API_KEY;


export async function getFeaturedMemes() {
    const baseURL = "https://glif.app/api";
    const query = {
        featured: '1'
    };
    const endpoint = "/glifs";
    const response = await fetch(`${baseURL}${endpoint}?${new URLSearchParams(query)}`);
    //parse to meme object
    if (!response.ok) {
        throw new Error("Error fetching memes");
    }
    const data = await response.json();
    const memes: Meme[] = data.map((meme: any) => {
        const count: Count = {
            likes: meme._count.likes,
            comments: meme._count.comments
        };
        return {
            id: meme.id,
            name: meme.name,
            imageUrl: meme.imageUrl,
            description: meme.description,
            createdAt: meme.createdAt,
            updatedAt: meme.updatedAt,
            publishedAt: meme.publishedAt,
            output: meme.output,
            outputType: meme.outputType,
            forkedFromId: meme.forkedFromId,
            featuredAt: meme.featuredAt,
            userId: meme.userId,
            completedSpellRunCount: meme.completedSpellRunCount,
            averageDuration: meme.averageDuration,
            _count: count
        }
    });
    const topMemes = memes.sort((a, b) => b._count.likes - a._count.likes).slice(0, 5);
    const randomIndex = Math.floor(Math.random() * topMemes.length);
    return topMemes[randomIndex];
}

export async function generateMeme(resumeRoastText: string, memeId: String) {

    const baseUrl = "https://simple-api.glif.app/" + memeId;
    const headers = {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
    }
    const body = {
        input1: "if given text provide user real name,please use it as title of meme,Resume Roast Text: " + resumeRoastText,
    };
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error("Error generating meme");
    }
    const data = await response.json();
    const memeData: MemeData = {
        id: data.id,
        inputs: data.inputs,
        output: data.output,
        outputFull: data.outputFull
    };
    return memeData;

}





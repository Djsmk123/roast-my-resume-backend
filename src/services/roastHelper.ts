import loadWordsFromRemoteConfig from "../utils/remote_cofing";
import getPromptHelper from "../utils/prompt-builder";

import { constants } from "../utils/constant";
import model from "../utils/gemini";
import firebase from "../db/db";

import { generateMeme } from './glif';

interface RoastHelperInput {
    roastTone: string;
    roleType: string;
    languageType: string;
    resumeText: string;
    hasMeme: boolean;
}
interface RoastHelperOutput {
    roast: string;
    id: string;
    meme: any | null;
}
async function roastHelper(
    roastRequest: RoastHelperInput
): Promise<RoastHelperOutput> {
    const words = await loadWordsFromRemoteConfig();
    const { roastTone, roleType, languageType, resumeText, hasMeme } = roastRequest;
    const prompt = getPromptHelper(
        roastTone,
        roleType,
        words,
        languageType,
    );
    //generate roast
    const content: any = [
        { role: "model", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: resumeText }] },
    ];

    const result = await model.generateContent(
        {
            contents: content,
            safetySettings: constants.safetySettings,
        }
    );
    const roastText = result.response.text();
    const env = process.env.NODE_ENV;
    console.log(env);
    let docId = "";
    let meme = null;
    if (hasMeme) {
        meme = await generateMeme(roastText, "clxtc53mi0000ghv10g6irjqj");
    }
    const data: any = {
        roastText: roastText,
        roastLevel: roastTone,
        createdAt: new Date(),
        role: roleType,
        language: languageType,
        meme: meme
    };
    const doc = await firebase.resumeRoastCollectionV2.add(data);
    console.log("Document written with ID: ", doc.id);
    docId = doc.id;
    const snapshot = (await firebase.resumeRoastCountCollection.get()).docs[0];
    const roastCount = snapshot.data()['count'] + 1;
    //update document
    await firebase.resumeRoastCountCollection.doc(snapshot.id).update({
        'count': roastCount
    });
    if (meme) {
        return {
            roast: roastText,
            id: docId,
            meme: meme
        };
    }
    return {
        roast: roastText,
        id: docId,
        meme: null
    };


}
export default roastHelper;
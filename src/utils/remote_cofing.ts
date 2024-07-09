import firebase from '../db/db';
import dotenv from 'dotenv';
dotenv.config();

async function loadWordsFromRemoteConfig(): Promise<String[]> {
    const env = process.env.NODE_ENV;
    if (env === 'development') {
        return [];
    }

    let words: string[] = [];
    const remoteConfig = await firebase.remoteConfig.getTemplate();
    var templateStr = JSON.stringify(remoteConfig);
    words = JSON.parse(templateStr).parameters.words.defaultValue.value;;
    return words;
}
export default loadWordsFromRemoteConfig;
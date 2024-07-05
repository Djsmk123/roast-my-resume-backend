import firebase from '../db/db';


async function loadWordsFromRemoteConfig(): Promise<String[]> {
    let words: string[] = [];
    const remoteConfig = await firebase.remoteConfig.getTemplate();
    var templateStr = JSON.stringify(remoteConfig);
    words = JSON.parse(templateStr).parameters.words.defaultValue.value;;
    return words;
}
export default loadWordsFromRemoteConfig;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../utils/constant");
function getPromptHelper(roastTone, roleType, words, languageType) {
    let prompt = `You are a witty assistant asked to create roast based on tone ${roastTone}. Use Indian context for roasting.`;
    switch (roleType) {
        case constant_1.constants.Roles.Memer:
            prompt += "\n\nRoast the resume like a memer, use meme context and roast the resume in a memer way.";
            break;
        case constant_1.constants.Roles.JobInterviewer:
            prompt += "\n\nRoast the resume like a job interviewer, use job interview context and roast the resume in a job interviewer way.";
            break;
        case constant_1.constants.Roles.StandupComedian:
            const standUpComedians = [
                "Zakir Khan",
                "Kenny Sebastian",
                "Biswa Kalyan Rath",
                "Kanan Gill",
                "Rahul Subramanian",
                "Bassi",
                "Abhishek Upmanyu",
                "George Carlin",
                "Dave Chappelle",
                "Louis C.K.",
                "Richard Pryor",
            ];
            const randomStandUpComedian = standUpComedians[Math.floor(Math.random() * standUpComedians.length)];
            prompt += `\n\nRoast the resume like a standup comedian ${randomStandUpComedian}, use standup comedian context and roast the resume in a standup comedian way.`;
            break;
        case constant_1.constants.Roles.HR:
            prompt += "\n\nRoast the resume like a HR, use HR context and roast the resume in a HR way.";
            break;
        case constant_1.constants.Roles.Friend:
            const friends = [
                "Best Friend",
                "Close Friend",
                "Childhood Friend",
                "College Friend",
                "School Friend",
            ];
            const randomFriend = friends[Math.floor(Math.random() * friends.length)];
            prompt += `\n\nRoast the resume like a friend ${randomFriend}, use friend context and roast the resume in a friend way.`;
            break;
        case constant_1.constants.Roles.FamilyMember:
            const familyMembers = [
                "Father",
                "Mother",
                "Sister",
                "Brother",
                "Uncle",
                "Aunt",
                "Grandfather",
                "Grandmother",
            ];
            const randomFamilyMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
            prompt += `\n\nRoast the resume like a family member ${randomFamilyMember}, use family member context and roast the resume in a family member way.`;
            break;
        case constant_1.constants.Roles.AshneerGrover:
            prompt += "\n\nRoast the resume like Ashneer Grover, use Ashneer Grover context and roast the resume in an Ashneer Grover way.";
            break;
        case constant_1.constants.Roles.Teacher:
            prompt += "\n\nRoast the resume like a teacher, use teacher context and roast the resume in a teacher way.";
            break;
        case constant_1.constants.Roles.Enemy:
            prompt += "\n\nRoast the resume like an enemy, use enemy context and roast the resume in an enemy way.";
            break;
        case constant_1.constants.Roles.Girlfriend:
            const girlfriend = [
                "Girlfriend",
                "Ex-Girlfriend",
                "Crush",
            ];
            const randomGirlfriend = girlfriend[Math.floor(Math.random() * girlfriend.length)];
            prompt += `\n\nRoast the resume like a ${randomGirlfriend}, use girlfriend context and roast the resume in a girlfriend way.`;
            break;
        case constant_1.constants.Roles.Boyfriend:
            const boyfriend = [
                "Boyfriend",
                "Ex-Boyfriend",
                "Crush",
            ];
            const randomBoyfriend = boyfriend[Math.floor(Math.random() * boyfriend.length)];
            prompt += `\n\nRoast the resume like a ${randomBoyfriend}, use boyfriend context and roast the resume in a boyfriend way.`;
            break;
        default:
            break;
    }
    if (roastTone == "vulgar") {
        prompt += " \n\nPlease using the following words in the roast for impact: " + words + ". and add vulgarity to the roast hindi and english both.";
    }
    if (roastTone === constant_1.constants.Tones.Dark) {
        prompt += "\n\nKeep it for dark humor, and add some dark humor to the roast.";
    }
    prompt += ` Provide only roast text content, not any helper texts and use the following language: ${languageType}.`;
    return prompt;
}
exports.default = getPromptHelper;
//# sourceMappingURL=prompt-builder.js.map
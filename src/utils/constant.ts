import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

enum Tones {
    SoftHearted = "soft-hearted",
    HardHearted = "hard-hearted",
    Light = "light",
    Dark = "dark",
    Vulgar = "vulgar",
}

enum Roles {
    Memer = "Memer",
    JobInterviewer = "Job Interviewer",
    StandupComedian = "Standup Comedian",
    HR = "HR",
    Friend = "Friend",
    FamilyMember = "Family Member",
    AshneerGrover = "Ashneer Grover",
    Teacher = "Teacher",
    Enemy = "Enemy",
    Girlfriend = "Girlfriend",
    Boyfriend = "Boyfriend",
}

enum Languages {
    English = "English",
    Hindi = "Hindi",
    BothHindiAndEnglish = "Both Hindi and English",
}
const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];
export const constants = {
    Tones,
    Roles,
    Languages,
    safetySettings,
};
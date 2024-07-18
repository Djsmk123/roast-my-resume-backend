"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const constant_1 = require("../utils/constant");
const pdf_text_extractor_1 = __importDefault(require("../utils/pdf-text-extractor"));
const roastHelper_1 = __importDefault(require("./roastHelper"));
dotenv_1.default.config();
// Get the Telegram token from environment variables
const token = process.env.TELEGRAM_TOKEN;
// Create a new instance of the Telegram bot
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// Store user sessions
const userSessions = {};
// Handle polling errors
bot.on("polling_error", console.log);
bot.on("webhook_error", console.log);
// Handle the /start command
bot.onText(/\/start/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const startMessage = `
        Welcome to Roast My Resume!
        /help - Get a list of commands
        /start - Start the bot

        Now, use the /roast or /roastLinkedIn command to get your resume or LinkedIn profile roasted!
        Disclaimer: This bot is for entertainment purposes only. The roasts generated are not meant to be taken seriously.

        Note: Please do not store your resume text on databases or any other storage. We do keep only generated roast and meme for sharing and bot improvement purposes.
    `;
    yield bot.sendMessage(chatId, startMessage);
}));
// Handle the /help command
bot.onText(/\/help/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const text = `
        Welcome to the Roast My Resume bot! Here are the commands you can use: 

        1. /roast <RoastLevel> <Role> <Language> [meme]
           - RoastLevel:
             - 0 = Soft-hearted
             - 1 = Hard-hearted
             - 2 = Light
             - 3 = Dark
             - 4 = Vulgar
           - Role:
             - 0 = Memer
             - 1 = Job Interviewer
             - 2 = Standup Comedian
             - 3 = HR
             - 4 = Friend
             - 5 = Family Member
             - 6 = Boss
             - 7 = Teacher
             - 8 = Enemy
             - 9 = Girlfriend
             - 10 = Boyfriend
           - Language:
             - 0 = English
             - 1 = Hindi
             - 2 = Both Hindi and English
           - Meme (optional): To include a meme in the roast, add "meme" at the end of the command.
        
        Example without meme:
        /roast 3 3 0

        Example with meme:
        /roast 3 3 0 meme

        2. /roastLinkedIn <RoastLevel> <Role> <Language> <LinkedIn Profile URL> [meme]
           - RoastLevel:
             - 0 = Soft-hearted
             - 1 = Hard-hearted
             - 2 = Light
             - 3 = Dark
             - 4 = Vulgar
           - Role:
             - 0 = Memer
             - 1 = Job Interviewer
             - 2 = Standup Comedian
             - 3 = HR
             - 4 = Friend
             - 5 = Family Member
             - 6 = Boss
             - 7 = Teacher
             - 8 = Enemy
             - 9 = Girlfriend
             - 10 = Boyfriend
           - Language:
             - 0 = English
             - 1 = Hindi
             - 2 = Both Hindi and English
           - LinkedIn Profile URL: Provide the URL of the LinkedIn profile you want to roast.
           - Meme (optional): To include a meme in the roast, add "meme" at the end of the command.
        
        Example without meme:
        /roastLinkedIn 3 3 0 https://www.linkedin.com/in/md-mobin-bb928820b/

        Example with meme:
        /roastLinkedIn 3 3 0 https://www.linkedin.com/in/md-mobin-bb928820b/ meme

        Disclaimer: This bot is for entertainment purposes only. The roasts generated are not meant to be taken seriously.
    `;
    yield bot.sendMessage(chatId, text);
}));
// Handle the /roast command
bot.onText(/\/roast (\d) (\d+) (\d+)( meme)?/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const roastLevel = parseInt(match[1]);
    const role = parseInt(match[2]);
    const language = parseInt(match[3]);
    const meme = match[4] ? true : false;
    // Check if the roast level, role, and language are valid
    if (isNaN(roastLevel) || roastLevel < 0 || roastLevel > 4) {
        yield bot.sendMessage(chatId, "Invalid roast level. Please use a number between 0 and 4.");
        return;
    }
    if (isNaN(role) || role < 0 || role > 10) {
        yield bot.sendMessage(chatId, "Invalid role. Please use a number between 0 and 10.");
        return;
    }
    if (isNaN(language) || language < 0 || language > 2) {
        yield bot.sendMessage(chatId, "Invalid language. Please use a number between 0 and 2.");
        return;
    }
    // Save the roast parameters in the user session
    userSessions[chatId] = { roastLevel, role, language, meme };
    yield bot.sendMessage(chatId, "Great! Now please upload your resume PDF file.");
}));
// Handle document uploads
bot.on("document", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    // Check if we are waiting for a document from this user
    if (!userSessions[chatId]) {
        yield bot.sendMessage(chatId, "Please use the /roast command first to specify the roast parameters.");
        return;
    }
    const fileId = msg.document.file_id;
    const filePath = yield bot.getFileLink(fileId);
    // Check if file is valid PDF
    if (!filePath.endsWith(".pdf")) {
        yield bot.sendMessage(chatId, "Invalid file. Please upload a PDF file.");
        return;
    }
    const { roastLevel, role, language, meme } = userSessions[chatId];
    const tone = Object.values(constant_1.constants.Tones)[roastLevel];
    const roleType = Object.values(constant_1.constants.Roles)[role];
    const languageType = Object.values(constant_1.constants.Languages)[language];
    yield bot.sendMessage(chatId, "Processing your request could take a few seconds... Please wait");
    try {
        // Parse PDF
        const resumeText = yield (0, pdf_text_extractor_1.default)({ buffer: null, url: filePath });
        if (!resumeText) {
            yield bot.sendMessage(chatId, "Error parsing PDF file. Please try again.");
            return;
        }
        // Generate roast
        const response = yield roastHelper_1.default.roastHelper({
            roastTone: tone,
            roleType,
            languageType,
            text: resumeText,
            hasMeme: meme == "true",
            entity: "Resume",
        });
        if (!response) {
            yield bot.sendMessage(chatId, "Error generating roast. Please try again.");
            return;
        }
        const message = `We have a new roast from Roast My Resume!.Check it out below: \n\n${response.roast} \n\nCheck it out below: \n\nhttps://roast-my-resume-henna.vercel.app/roast?id=${response.id}\n\n`;
        yield bot.sendMessage(chatId, message);
        if (response.meme) {
            yield bot.sendMessage(chatId, `We also have a meme for you!\n${response.meme.output}`);
        }
    }
    catch (error) {
        yield bot.sendMessage(chatId, "An error occurred while processing your request. Please try again.");
    }
    // Clear the user session
    delete userSessions[chatId];
}));
//on linkedInRoast /roastLinkedIn 3 3 0 <LinkedIn Profile URL> meme
bot.onText(/\/roastLinkedIn (\d) (\d+) (\d+) (.+)( meme)?/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    console.log(chatId);
    try {
        const roastLevel = parseInt(match[1]);
        const role = parseInt(match[2]);
        const language = parseInt(match[3]);
        const linkedInProfile = match[4];
        const meme = match[5] ? true : false;
        // Check if the roast level, role, and language are valid
        if (isNaN(roastLevel) || roastLevel < 0 || roastLevel > 4) {
            yield bot.sendMessage(chatId, "Invalid roast level. Please use a number between 0 and 4.");
            return;
        }
        if (isNaN(role) || role < 0 || role > 10) {
            yield bot.sendMessage(chatId, "Invalid role. Please use a number between 0 and 10.");
            return;
        }
        if (isNaN(language) || language < 0 || language > 2) {
            yield bot.sendMessage(chatId, "Invalid language. Please use a number between 0 and 2.");
            return;
        }
        const roastTone = Object.values(constant_1.constants.Tones)[roastLevel];
        const roleType = Object.values(constant_1.constants.Roles)[role];
        const languageType = Object.values(constant_1.constants.Languages)[language];
        yield bot.sendMessage(chatId, "Great! Now please wait while we roast your LinkedIn profile.");
        const linkedInProfileData = yield roastHelper_1.default.getLinkedInProfile(linkedInProfile);
        if (!linkedInProfileData) {
            yield bot.sendMessage(chatId, "Invalid LinkedIn profile. Please try again.");
            return;
        }
        const resonse = yield roastHelper_1.default.roastHelper({
            roastTone,
            roleType,
            languageType,
            text: "Profile: " + JSON.stringify(linkedInProfileData),
            hasMeme: meme,
            entity: "My Linked Profile",
        });
        if (!resonse) {
            yield bot.sendMessage(chatId, "Error generating roast. Please try again.");
            return;
        }
        const message = `We have a new roast of your profile from Roast My Resume!.Check it out below: \n\n${resonse.roast} \n\nCheck it out below: \n\nhttps://roast-my-resume-henna.vercel.app/roast?id=${resonse.id}\n\n`;
        yield bot.sendMessage(chatId, message);
    }
    catch (e) {
        console.log(e);
        yield bot.sendMessage(chatId, "An error occurred while processing your request. Please try again.");
    }
}));
exports.default = bot;
//# sourceMappingURL=telegramService.js.map
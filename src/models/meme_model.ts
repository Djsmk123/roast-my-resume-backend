
interface Count {
    likes: number;
    comments: number;
}

interface Meme {
    id: string;
    name: string;
    imageUrl: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    output: string;
    outputType: string;
    forkedFromId: string;
    featuredAt: string;
    userId: string;
    completedSpellRunCount: number;
    averageDuration: number;
    _count: Count;
}

//meme output model
interface OutputFull {
    type: string;
    value: string;
    width: number;
    height: number;
    html: string;
}

interface MemeData {
    id: string;
    inputs: {
        input1: string;
    };
    output: string;
    outputFull: OutputFull;
}


export { Meme, Count, MemeData, OutputFull };


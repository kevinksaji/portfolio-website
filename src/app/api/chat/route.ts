import {NextResponse} from "next/server";
import {deepSeekChatComplete} from "@/lib/deepseek";

/**
 * POST /api/chat
 * Body: { messages: [{role,user|assistant, content:string}] }
 * Returns the answer from DeepSeek
 */
export async function POST(req: Request) {
    try {
        const {messages} = await req.json();

        const answer = await deepSeekChatComplete(messages); // call DeepSeek helper

        return NextResponse.json({answer}); // return the answer from DeepSeek
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {error: "Failed to contact DeepSeek."}, // return the error if the request fails
            {status: 500}
        );
    }
}

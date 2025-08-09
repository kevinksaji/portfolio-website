import {NextResponse} from "next/server";
import {deepSeekChatComplete} from "@/lib/deepseek";

/**
 * POST /api/chat
 * Body: { messages: [{role,user|assistant, content:string}] }
 */
export async function POST(req: Request) {
    try {
        const {messages} = await req.json();

        // Call DeepSeek helper
        const answer = await deepSeekChatComplete(messages);

        return NextResponse.json({answer});
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            {error: "Failed to contact DeepSeek."},
            {status: 500}
        );
    }
}

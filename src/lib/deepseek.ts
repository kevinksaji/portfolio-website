/**
 * Very thin wrapper around DeepSeek’s chat-completion endpoint.
 * Adjust the base URL / model according to the latest DeepSeek docs.
 */

export async function deepSeekChatComplete(
    messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages,
        }),
    });

    if (!res.ok) {
        throw new Error(`DeepSeek error ${res.status}`);
    }

    const data = await res.json();
    // Adapt this if the schema differs.
    return data.choices?.[0]?.message?.content ?? "";
}

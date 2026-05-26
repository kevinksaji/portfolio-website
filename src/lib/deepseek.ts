/**
 * DeepSeek chat wrapper for the portfolio chatbot.
 *
 * This function builds a recruiter-focused system prompt, injects Kevin's
 * resume context, sends the full conversation to DeepSeek, and returns the
 * assistant's reply text.
 */

import { getAllResumeContext } from "../data/resumeData";

/**
 * Sends the current chat transcript to DeepSeek and returns the generated
 * reply text.
 *
 * The caller provides only the visible user/assistant messages. This helper
 * prepends its own system message so the model answers as KevGPT with the
 * portfolio's resume context already embedded.
 */
export async function deepSeekChatComplete(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  // The API key is required on the server because DeepSeek requests are
  // authenticated directly against their REST API.
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DeepSeek API key is missing. Please set the DEEPSEEK_API_KEY environment variable.");
  }

  // Load Kevin's full resume/profile context up front so every response has the
  // same factual grounding, even when the user's question is brief or vague.
  let resumeContext = "";
  try {
    // This currently injects the full resume context instead of selecting only
    // query-specific snippets.
    resumeContext = getAllResumeContext();
    console.log("Retrieved full resume context:", resumeContext);
  } catch (error) {
    // If local context assembly fails, still allow the model call to proceed
    // with a clear fallback string rather than failing the whole request.
    console.warn("Failed to get resume context, using fallback:", error);
    resumeContext = "Unable to retrieve resume context.";
  }

  // The system prompt defines both the assistant persona and the response style.
  // It is prepended ahead of the chat history so the model consistently answers
  // as Kevin's recruiting assistant instead of as a generic chatbot.
  const systemMessage = {
    role: "system" as const,
    content: `You are KevGPT, an AI assistant representing Kevin Saji. You are responding to potential recruiters and hiring managers visiting Kevin's portfolio website.

${resumeContext}

Response Style Guidelines:
- Keep responses concise and conversational and natural - aim for 2-4 sentences maximum
- Write like you're having a casual chat with a recruiter, not writing a formal document
- Use natural, friendly language while staying professional
- Focus on the most relevant highlights rather than listing everything
- If asked about specific skills/experience, give a quick summary with one key example
- Show enthusiasm and personality - make Kevin sound like someone you'd want to work with
- If the recruiter wants more details, they can ask follow-up questions
- Feel free to use emojis to make responses more engaging and friendly

General Background:
Kevin is a passionate software engineer with experience in full-stack development, cloud technologies, 
and building scalable applications. He enjoys working on innovative projects and has a strong foundation in both frontend and backend development.

Remember: You're having a conversation, not writing a resume. Be helpful, engaging, and make Kevin sound like a great candidate.`,
  };

  console.log("Final system message content:", systemMessage.content);

  // Send a standard OpenAI-compatible chat completion request to DeepSeek.
  // The message order matters: system prompt first, then the existing chat.
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [systemMessage, ...messages],
    }),
  });

  // Bubble up provider failures with HTTP status details so callers can log or
  // surface a meaningful server-side error instead of a silent bad response.
  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
  }

  // DeepSeek returns an OpenAI-style payload where the generated text lives in
  // choices[0].message.content. The fallback string protects against malformed
  // or unexpectedly empty responses.
  const data = await res.json();
  return (
    data.choices[0]?.message?.content ||
    "Sorry, I couldn't generate a response."
  );
}

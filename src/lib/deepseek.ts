/**
 * Enhanced DeepSeek wrapper with RAG integration
 * Dynamically retrieves relevant resume context based on user queries
 */

import { getAllResumeContext } from "../data/resumeData";

export async function deepSeekChatComplete(
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DeepSeek API key is missing. Please set the DEEPSEEK_API_KEY environment variable.");
  }

  // Get all resume context for every query
  let resumeContext = "";
  try {
    resumeContext = getAllResumeContext(); // Get all context instead of trying to match
    console.log("Retrieved full resume context:", resumeContext);
  } catch (error) {
    console.warn("Failed to get resume context, using fallback:", error);
    resumeContext = "Unable to retrieve resume context.";
  }

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

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (
    data.choices[0]?.message?.content ||
    "Sorry, I couldn't generate a response."
  );
}

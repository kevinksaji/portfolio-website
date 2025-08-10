"use client";

import {useEffect, useState, useCallback, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import ChatWindow, {ChatMessageType} from "@/components/ChatWindow";

/**
 * Main chat page content component that handles:
 * - Single chat session management
 * - Message handling and API communication
 * - URL query parameter processing for starting chats
 */
function ChatPageContent() {
    // Get URL search parameters to check if user wants to start a chat with a specific query
    const searchParams = useSearchParams();
    const startQuery = searchParams.get("q");

    // State for managing the single chat session
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [initialLoading, setInitialLoading] = useState(false);

    /**
     * Sends the initial message to the DeepSeek API when starting a chat from URL
     * This handles the API call and updates the conversation with the AI response
     * @param message - The user's initial message
     */
    const sendInitialMessage = useCallback(async (message: string) => {
        // User message is already added in useEffect, just send to API
        const userMessage = {role: "user" as const, content: message};
        
        try {
            // Make API call to chat endpoint
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: [userMessage]}),
            });
            const data = await res.json();
            
            // Create AI response message and update conversation
            const aiMessage = {role: "assistant" as const, content: data.answer};
            console.log("Creating AI message:", aiMessage);
            setMessages([userMessage, aiMessage]);
        } catch {
            // Handle API errors gracefully
            const errorMessage = {role: "assistant" as const, content: "Sorry, something went wrong."};
            console.log("Creating error message:", errorMessage);
            setMessages([userMessage, errorMessage]);
        } finally {
            setInitialLoading(false); // Stop loading state
        }
    }, []);

    /**
     * Effect: Handle URL query parameters when component mounts
     * This runs when the component mounts or when startQuery changes
     */
    useEffect(() => {
        // If there's a query parameter, start a new chat automatically
        if (startQuery) {
            // First add the user message to the conversation
            const userMessage = {role: "user" as const, content: startQuery};
            setMessages([userMessage]);
            // Then set loading and send the message to API
            setInitialLoading(true);
            sendInitialMessage(startQuery);
        }
    }, [startQuery, sendInitialMessage]);

    // Create a simple conversation object for the ChatWindow component
    const conversation = messages.length > 0 ? { id: "current", messages } : null;

    return (
        <main className="h-screen w-full flex flex-col bg-background pt-14">
            <div className="flex h-full w-full overflow-hidden">
                <div className="w-full h-full">
                    {/* Render the chat interface with the current conversation */}
                    <ChatWindow
                        conversation={conversation}
                        initialLoading={initialLoading}
                        onMessagesChangeAction={setMessages}
                    />
                </div>
            </div>
        </main>
    );
}

/**
 * Main chat page component wrapped in Suspense for loading states
 * This allows the page to show a loading indicator while the main content loads
 */
export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}

"use client";

import {useEffect, useState, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import ChatWindow, {ChatMessageType} from "@/components/ChatWindow";

/**
 * Main chat page content component that handles:
 * - Single chat session management
 * - Message handling and API communication
 * - URL query parameter processing for starting chats
 * 
 * This component acts as the central controller for the chat system,
 * managing the single source of truth for all chat messages and
 * coordinating between the ChatWindow display component and the API.
 */
function ChatPageContent() {
    // Get URL search parameters to check if user wants to start a chat with a specific query
    // This allows users to share chat links or bookmark specific conversations
    const searchParams = useSearchParams();
    const startQuery = searchParams.get("q");

    // State for managing the single chat session
    // messages: Array of all chat messages (user + AI responses)
    // initialLoading: Boolean to show loading state when processing URL queries
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [initialLoading, setInitialLoading] = useState(false);

    /**
     * Sends the initial message to the DeepSeek API when starting a chat from URL
     * This function is called when a user visits /chat?q=some_question
     * 
     * @param message - The initial message from the URL query parameter
     */
    const sendInitialMessage = async (message: string) => {
        // Create the user message object with the query from URL
        const userMessage = {role: "user" as const, content: message};
        
        try {
            // Make API call to DeepSeek with the initial message
            // The API will process this and return an AI response
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: [userMessage]}),
            });
            const data = await res.json();
            
            // Create the AI response message and add both messages to the conversation
            const aiMessage = {role: "assistant" as const, content: data.answer};
            setMessages([userMessage, aiMessage]);
        } catch {
            // If the API call fails, show an error message to the user
            // This ensures the user always gets feedback, even on errors
            const errorMessage = {role: "assistant" as const, content: "Sorry, something went wrong."};
            setMessages([userMessage, errorMessage]);
        } finally {
            // Always turn off loading state, regardless of success or failure
            setInitialLoading(false);
        }
    };

    /**
     * Effect: Handle URL query parameters when component mounts
     * This runs once when the component first loads and whenever startQuery changes
     * 
     * The effect:
     * 1. Checks if there's a query parameter in the URL
     * 2. If yes, immediately shows the user message
     * 3. Sets loading state and calls the API
     * 4. Updates the conversation with both user and AI messages
     */
    useEffect(() => {
        if (startQuery) {
            // Create and display the user message immediately for instant feedback
            const userMessage = {role: "user" as const, content: startQuery};
            setMessages([userMessage]);
            
            // Show loading state while waiting for AI response
            setInitialLoading(true);
            
            // Send the message to the API and handle the response
            sendInitialMessage(startQuery);
        }
    }, [startQuery]); // Only re-run when startQuery changes (which should be never after initial load)

    // Create a simple conversation object for the ChatWindow component
    // ChatWindow expects a conversation object with id and messages
    // If no messages exist yet, pass null to show the empty state
    const conversation = messages.length > 0 ? { id: "current", messages } : null;

    return (
        <main className="h-screen w-full flex flex-col bg-background pt-14">
            <div className="flex h-full w-full overflow-hidden">
                <div className="w-full h-full">
                    {/* Render the chat interface with the current conversation */}
                    {/* 
                        ChatWindow receives:
                        - conversation: The current chat data (or null if empty)
                        - initialLoading: Whether we're processing a URL query
                        - onMessagesChangeAction: Function to update messages (setMessages)
                    */}
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
 * 
 * Suspense provides a fallback UI while the page is loading,
 * which is especially useful for:
 * - Initial page load
 * - Route transitions
 * - Dynamic imports
 * 
 * The fallback shows "Loading..." until ChatPageContent is ready
 */
export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}

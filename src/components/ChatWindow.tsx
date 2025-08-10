// The chat window component that the user is taken to upon first query that displays the chat messages and the chat input bar

"use client";

import {useState, useEffect, useRef} from "react";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import FormattedMessage from "./FormattedMessage";

/**
 * Type definition for chat messages
 * Each message has a role (either "user" or "assistant") and content
 * This ensures type safety throughout the chat system
 */
export type ChatMessageType = { role: "user" | "assistant"; content: string };

/**
 * Props interface for the ChatWindow component
 * 
 * @param conversation - Object containing chat ID and messages array, or null if no messages
 * @param onMessagesChangeAction - Callback function to update messages in the parent component
 * @param initialLoading - Boolean indicating if we're loading an initial message from URL query
 */
type Props = {
    conversation: { id: string; messages: ChatMessageType[] } | null;
    onMessagesChangeAction: (msgs: ChatMessageType[]) => void;
    initialLoading?: boolean;
};

/**
 * ChatWindow Component
 * 
 * This component is responsible for:
 * 1. Displaying all chat messages with proper styling and layout
 * 2. Managing the chat input interface
 * 3. Handling message sending and API communication
 * 4. Providing auto-scrolling and loading states
 * 5. Rendering the empty state when no messages exist
 * 
 * The component receives data from its parent and communicates back through callbacks,
 * maintaining a clean separation of concerns.
 */
export default function ChatWindow({
    conversation,
    onMessagesChangeAction,
    initialLoading = false,
}: Props) {
    // Local loading state for individual message sending
    // This is separate from initialLoading to handle different loading scenarios
    const [loading, setLoading] = useState(false);
    
    // Extract messages from conversation object, defaulting to empty array if null
    // This ensures we always have a valid array to work with
    const messages = conversation?.messages ?? [];
    
    // Reference to the bottom of the messages container for auto-scrolling
    // This allows us to automatically scroll to the latest message
    const messagesEndRef = useRef<HTMLDivElement>(null);

    /**
     * Auto-scroll to bottom when messages change or loading state changes
     * This ensures users always see the latest message without manual scrolling
     * 
     * The effect runs whenever:
     * - New messages are added
     * - Loading state changes (to show typing indicators)
     * - Initial loading state changes (for URL query processing)
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, initialLoading]);

    /**
     * Sends a message to the AI API and updates the conversation
     * 
     * This function:
     * 1. Validates the input message
     * 2. Immediately updates the UI with the user message
     * 3. Makes an API call to get the AI response
     * 4. Updates the conversation with the AI response
     * 5. Handles errors gracefully
     * 
     * @param text - The message text to send
     */
    const sendMessage = async (text: string) => {
        // Prevent sending empty or whitespace-only messages
        if (!text.trim()) return;
        
        // Create the next message array by adding the user's message
        // We update the UI immediately for instant feedback
        const nextMsgs: ChatMessageType[] = [
            ...messages,
            {role: "user", content: text},
        ];
        
        // Notify the parent component to update its state
        // This triggers a re-render with the new user message
        onMessagesChangeAction(nextMsgs);

        // Set loading state to show typing indicator and prevent multiple sends
        setLoading(true);
        
        try {
            // Make API call to DeepSeek with all conversation context
            // The API receives the full conversation history for context-aware responses
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: nextMsgs}),
            });
            const data = await res.json();
            
            // Add the AI response to the conversation
            // This completes the message exchange
            onMessagesChangeAction([
                ...nextMsgs,
                {role: "assistant", content: data.answer},
            ]);
        } catch {
            // If the API call fails, show an error message
            // This ensures the conversation continues even on errors
            onMessagesChangeAction([
                ...nextMsgs,
                {role: "assistant", content: "Sorry, something went wrong."},
            ]);
        } finally {
            // Always turn off loading state, regardless of success or failure
            // This allows the user to send new messages
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-background relative overflow-hidden">
            {/* 
                Chat Messages Container - Fixed Height with Bottom Spacing
                
                This container:
                - Has a fixed height to prevent layout shifts
                - Provides scrolling for long conversations
                - Centers content with max-width for readability
                - Includes padding for visual breathing room
                - Hides scrollbars for a cleaner look
            */}
            <div className="h-[calc(100vh-220px)] overflow-y-auto py-2 w-full flex justify-center scrollbar-hide">
                <div className="w-full max-w-2xl px-4 space-y-3 pt-16 pb-16">
                    {/* 
                        Empty State - Shown when no messages exist and not loading
                        
                        This provides:
                        - Visual feedback that the chat is ready
                        - Clear call-to-action for users
                        - Professional appearance even without content
                    */}
                    {messages.length === 0 && !loading && !initialLoading && (
                        <div className="text-center text-muted-foreground mt-8">
                            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                                {/* Chat bubble icon to represent the chat interface */}
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-muted-foreground mb-2">Start a conversation</p>
                            <p className="text-muted-foreground">Ask me anything and I&apos;ll help you out!</p>
                        </div>
                    )}
                    
                    {/* 
                        Message Rendering Loop
                        
                        This maps through all messages and renders them with:
                        - Different layouts for user vs assistant messages
                        - Proper styling and positioning
                        - Animation effects for smooth appearance
                        - Speech bubble tails for visual appeal
                    */}
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300 ease-out`}
                        >
                            <div
                                className={`max-w-[70%] px-4 py-3 shadow-lg relative ${
                                    m.role === "user"
                                        ? "bg-background text-foreground rounded-2xl rounded-br-md border border-border"
                                        : "bg-background text-foreground border border-border rounded-2xl rounded-bl-md"
                                }`}
                            >
                                {/* 
                                    Speech bubble tail for user messages
                                    This creates the chat bubble effect pointing to the right
                                */}
                                {m.role === "user" && (
                                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[12px] border-l-background border-t-[12px] border-t-transparent"></div>
                                )}
                                
                                {/* 
                                    Speech bubble tail for assistant messages
                                    This creates the chat bubble effect pointing to the left
                                */}
                                {m.role === "assistant" && (
                                    <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[12px] border-r-background border-t-[12px] border-t-transparent"></div>
                                )}
                                
                                {/* 
                                    Render the message content with formatting
                                    FormattedMessage handles markdown-like formatting (bold, italic, code, etc.)
                                */}
                                <FormattedMessage content={m.content} />
                            </div>
                        </div>
                    ))}
                    
                    {/* 
                        Typing Indicator
                        
                        Shows when:
                        - User is waiting for AI response (loading = true)
                        - Processing initial message from URL (initialLoading = true)
                        
                        This provides visual feedback that the system is working
                    */}
                    {(loading || initialLoading) && (
                        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300 ease-out">
                            <TypingIndicator />
                        </div>
                    )}
                    
                    {/* 
                        Spacer div to create bottom separation
                        This ensures the last message isn't hidden behind the input bar
                    */}
                    <div className="h-10"></div>
                    
                    {/* 
                        Invisible div for auto-scrolling
                        This reference point allows us to scroll to the bottom automatically
                    */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 
                Floating Chat Input at Bottom - Fixed Position
                
                This input bar:
                - Stays fixed at the bottom for easy access
                - Is centered and responsive
                - Has proper z-index to stay above other content
                - Receives the sendMessage function and loading states
            */}
            <div className="fixed bottom-27 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-10">
                <ChatInput
                    onSendAction={sendMessage}
                    disabled={loading || initialLoading || !conversation}
                />
            </div>
        </div>
    );
}
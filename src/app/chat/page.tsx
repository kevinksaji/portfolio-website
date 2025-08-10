"use client";

import {useEffect, useState, Suspense, useRef} from "react";
import {useSearchParams} from "next/navigation";
import ChatWindow, {ChatMessageType} from "@/components/ChatWindow";

/**
 * Chat page controller component.
 * Manages chat state, API communication, and URL query processing.
 */
function ChatPageContent() {
    const searchParams = useSearchParams();
    const startQuery = searchParams.get("q");
    const hasInitialized = useRef(false);

    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    /**
     * Sends user message to AI API and updates conversation.
     * Handles validation, API calls, error handling, and loading states.
     */
    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        
        const userMessage = {role: "user" as const, content: text.trim()};
        const nextMsgs: ChatMessageType[] = [...messages, userMessage];
        
        setMessages(nextMsgs);
        setLoading(true);
        
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: nextMsgs}),
            });
            const data = await res.json();
            
            const aiMessage = {role: "assistant" as const, content: data.answer};
            setMessages([...nextMsgs, aiMessage]);
        } catch {
            const errorMessage = {role: "assistant" as const, content: "Sorry, something went wrong."};
            setMessages([...nextMsgs, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle URL query parameters on mount.
     * Processes direct links to specific chat conversations.
     */
    useEffect(() => {
        if (startQuery && !hasInitialized.current) {
            hasInitialized.current = true;
            const userMessage = {role: "user" as const, content: startQuery};
            setMessages([userMessage]);
            setInitialLoading(true);
            
            // Make API call directly here to avoid double calls
            const fetchInitialResponse = async () => {
                try {
                    const res = await fetch("/api/chat", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({messages: [userMessage]}),
                    });
                    const data = await res.json();
                    
                    const aiMessage = {role: "assistant" as const, content: data.answer};
                    setMessages([userMessage, aiMessage]);
                } catch {
                    const errorMessage = {role: "assistant" as const, content: "Sorry, something went wrong."};
                    setMessages([userMessage, errorMessage]);
                } finally {
                    setInitialLoading(false);
                }
            };
            
            fetchInitialResponse();
        }
    }, [startQuery]);

    const conversation = messages.length > 0 ? { id: "current", messages } : null;

    return (
        <main className="h-screen w-full flex flex-col bg-background pt-14">
            <div className="flex h-full w-full overflow-hidden">
                <div className="w-full h-full">
                    <ChatWindow
                        conversation={conversation}
                        loading={loading}
                        initialLoading={initialLoading}
                        onSendMessage={sendMessage}
                    />
                </div>
            </div>
        </main>
    );
}

/**
 * Chat page with Suspense wrapper for loading states.
 */
export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}

"use client";

import {useEffect, useState, useCallback, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import ChatWindow, {ChatMessageType} from "@/components/ChatWindow";

function ChatPageContent() {
    const searchParams = useSearchParams();
    const startQuery = searchParams.get("q");

    const [conversations, setConversations] = useState<
        { id: string; title: string; messages: ChatMessageType[] }[]
    >([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(false);

    const createConversation = useCallback((firstUserMessage: string) => {
        const id = crypto.randomUUID();
        const newConversation = {
            id,
            title: firstUserMessage.slice(0, 30) || "New chat",
            messages: [], // Start with empty messages
        };
        setConversations((prev) => [newConversation, ...prev]);
        setActiveId(id);
        return newConversation;
    }, []);

    const updateConversation = useCallback((id: string, messages: ChatMessageType[]) => {
        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === id ? {...conv, messages} : conv
            )
        );
    }, []);

    const sendInitialMessage = useCallback(async (message: string, convId: string) => {
        // User message is already added in useEffect, just send to API
        const userMessage = {role: "user" as const, content: message};
        
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: [userMessage]}),
            });
            const data = await res.json();
            const aiMessage = {role: "assistant" as const, content: data.answer};
            console.log("Creating AI message:", aiMessage);
            updateConversation(convId, [
                userMessage,
                aiMessage
            ]);
        } catch {
            const errorMessage = {role: "assistant" as const, content: "Sorry, something went wrong."};
            console.log("Creating error message:", errorMessage);
            updateConversation(convId, [
                userMessage,
                errorMessage
            ]);
        } finally {
            setInitialLoading(false);
        }
    }, [updateConversation]);

    useEffect(() => {
        const stored = localStorage.getItem("conversations");
        if (stored) setConversations(JSON.parse(stored));

        if (startQuery) {
            const newConv = createConversation(startQuery);
            // First add the user message to the conversation
            const userMessage = {role: "user" as const, content: startQuery};
            updateConversation(newConv.id, [userMessage]);
            // Then set loading and send the message
            setInitialLoading(true);
            sendInitialMessage(startQuery, newConv.id);
        }
    }, [startQuery, createConversation, sendInitialMessage, updateConversation]);

    useEffect(() => {
        localStorage.setItem("conversations", JSON.stringify(conversations));
    }, [conversations]);

    const activeConv = conversations.find((conv) => conv.id === activeId) ?? null;

    return (
        <main className="h-screen w-full overflow-hidden bg-gray-50">
            <div className="flex h-full w-full overflow-hidden pt-14">
                <div className="w-full h-full">
                    <ChatWindow
                        conversation={activeConv}
                        initialLoading={initialLoading}
                        onMessagesChangeAction={(msgs) => {
                            if (activeId) {
                                updateConversation(activeId, msgs);
                            }
                        }}
                    />
                </div>
            </div>
        </main>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ChatPageContent />
        </Suspense>
    );
}

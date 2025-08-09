// the chat window component that the user is taken to upon first query that displays the chat messages and the chat input bar

"use client";

import {useState, useEffect, useRef, useMemo} from "react";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import FormattedMessage from "./FormattedMessage";

export type ChatMessageType = { role: "user" | "assistant"; content: string };

type Props = {
    conversation: { id: string; messages: ChatMessageType[] } | null;
    onMessagesChangeAction: (msgs: ChatMessageType[]) => void;   // ← renamed
    initialLoading?: boolean;
};

export default function ChatWindow({
                                       conversation,
                                       onMessagesChangeAction,
                                       initialLoading = false,
                                   }: Props) {
    const [loading, setLoading] = useState(false);
    const messages = useMemo(() => conversation?.messages ?? [], [conversation?.messages]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change or loading state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, initialLoading]);

    // Debug logging

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        const nextMsgs: ChatMessageType[] = [
            ...messages,
            {role: "user", content: text},
        ];
        onMessagesChangeAction(nextMsgs);

        setLoading(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: nextMsgs}),
            });
            const data = await res.json();
            onMessagesChangeAction([
                ...nextMsgs,
                {role: "assistant", content: data.answer},
            ]);
        } catch {
            onMessagesChangeAction([
                ...nextMsgs,
                {role: "assistant", content: "Sorry, something went wrong."},
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-background relative overflow-hidden">
            {/* Chat Messages Container - Fixed Height with Bottom Spacing */}
            <div className="h-[calc(100vh-220px)] overflow-y-auto py-2 w-full flex justify-center scrollbar-hide">
                <div className="w-full max-w-2xl px-4 space-y-3 pt-16 pb-16">
                    {messages.length === 0 && !loading && !initialLoading && (
                        <div className="text-center text-muted-foreground mt-8">
                            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 打03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-lg font-medium text-muted-foreground mb-2">Start a conversation</p>
                            <p className="text-muted-foreground">Ask me anything and I&apos;ll help you out!</p>
                        </div>
                    )}
                    {messages.map((m, i) => {
                        console.log(`Message ${i}:`, m, `Role: ${m.role}`, `Is user: ${m.role === "user"}`);
                        return (
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
                                    {/* Speech bubble tail for user messages */}
                                    {m.role === "user" && (
                                        <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[12px] border-l-background border-t-[12px] border-t-transparent"></div>
                                    )}
                                    
                                    {/* Speech bubble tail for assistant messages */}
                                    {m.role === "assistant" && (
                                        <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[12px] border-r-background border-t-[12px] border-t-transparent"></div>
                                    )}
                                    
                                    <FormattedMessage content={m.content} />
                                </div>
                            </div>
                        );
                    })}
                    {(loading || initialLoading) && (
                        <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300 ease-out">
                            <TypingIndicator />
                        </div>
                    )}
                    {/* Spacer div to create bottom separation */}
                    <div className="h-10"></div>
                    {/* Invisible div for auto-scrolling */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Floating Chat Input at Bottom - Fixed Position */}
            <div className="fixed bottom-27 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-10">
                <ChatInput
                    onSendAction={sendMessage}
                    disabled={loading || initialLoading || !conversation}
                />
            </div>
        </div>
    );
}
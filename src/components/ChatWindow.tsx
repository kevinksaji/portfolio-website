"use client";

import { useEffect, useMemo, useRef } from "react";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import FormattedMessage from "./FormattedMessage";
import { cn } from "@/lib/utils";

export type ChatMessageType = { role: "user" | "assistant"; content: string };

type Props = {
    conversation: { id: string; messages: ChatMessageType[] } | null;
    loading: boolean;
    initialLoading: boolean;
    onSendMessage: (text: string) => Promise<void>;
};

/**
 * Chat display component. Renders messages, handles input, and manages UI state.
 * Pure component - receives data via props and communicates via callbacks.
 */
export default function ChatWindow({
    conversation,
    loading,
    initialLoading,
    onSendMessage,
}: Props) {
    const messages = useMemo(() => conversation?.messages ?? [], [conversation?.messages]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages or loading states change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, initialLoading]);

    const handleSendMessage = async (text: string) => {
        await onSendMessage(text);
    };

    return (
        <div className="h-full w-full bg-background overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto w-full scrollbar-hide">
                <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 py-6 sm:py-8">
                    {/* Empty state when no messages */}
                    {messages.length === 0 && !loading && !initialLoading && (
                        <div className="text-center text-muted-foreground mt-8">
                            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>
                    )}

                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex",
                                m.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            <div
                                className={cn(
                                    "max-w-[70%] px-4 py-3 shadow-lg relative",
                                    m.role === "user"
                                        ? "bg-background text-foreground rounded-2xl rounded-br-md border border-border"
                                        : "bg-background text-foreground border border-border rounded-2xl rounded-bl-md"
                                )}
                            >
                                {/* Speech bubble tails */}
                                {m.role === "user" && (
                                    <div className="absolute bottom-0 right-0 w-0 h-0 border-l-[12px] border-l-background border-t-[12px] border-t-transparent" />
                                )}
                                {m.role === "assistant" && (
                                    <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[12px] border-r-background border-t-[12px] border-t-transparent" />
                                )}

                                <FormattedMessage content={m.content} />
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator during API calls */}
                    {(loading || initialLoading) && (
                        <div className="flex justify-start">
                            <TypingIndicator />
                        </div>
                    )}

                    <div className="h-10"></div>
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Sticky input bar */}
            <div className="sticky bottom-0 w-full bg-background/80 backdrop-blur-sm border-t border-border/20">
                <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <ChatInput
                        onSendAction={handleSendMessage}
                        disabled={loading || initialLoading || !conversation}
                    />
                </div>
            </div>
        </div>
    );
}
// the chat window component that the user is taken to upon first query that displays the chat messages and the chat input bar

"use client";

import {useState} from "react";
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
    const messages = conversation?.messages ?? [];

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
        <div className="flex flex-col h-full w-full bg-white">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-50 w-full">
                {messages.length === 0 && !loading && !initialLoading && (
                    <div className="text-center text-gray-500 mt-8">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-2">Start a conversation</p>
                        <p className="text-gray-500">Ask me anything and I&apos;ll help you out!</p>
                    </div>
                )}
                {messages.map((m, i) => {
                    console.log(`Message ${i}:`, m, `Role: ${m.role}`, `Is user: ${m.role === "user"}`);
                    return (
                        <div
                            key={i}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                    m.role === "user"
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-white text-black border border-gray-200 shadow-sm"
                                }`}
                            >
                                <FormattedMessage content={m.content} />
                            </div>
                        </div>
                    );
                })}
                {(loading || initialLoading) && <TypingIndicator />}
            </div>

            {/* Chat Input */}
            <ChatInput
                onSendAction={sendMessage}
                disabled={loading || initialLoading || !conversation}
            />
        </div>
    );
}
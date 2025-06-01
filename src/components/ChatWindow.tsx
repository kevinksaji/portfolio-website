"use client";

import {useState} from "react";
import ChatInput from "./ChatInput";

export type ChatMessageType = { role: "user" | "assistant"; content: string };

type Props = {
    conversation: { id: string; messages: ChatMessageType[] } | null;
    onMessagesChangeAction: (msgs: ChatMessageType[]) => void;   // ← renamed
};

export default function ChatWindow({
                                       conversation,
                                       onMessagesChangeAction,
                                   }: Props) {
    const [loading, setLoading] = useState(false);
    const messages = conversation?.messages ?? [];

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
        <div className="flex flex-col h-full">
            {/* history */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={
                            m.role === "user"
                                ? "text-right"
                                : "text-left text-gray-800 bg-gray-100 rounded-lg p-3 inline-block"
                        }
                    >
                        {m.content}
                    </div>
                ))}
                {loading && <p className="text-gray-400 italic">Thinking…</p>}
            </div>

            {/* composer */}
            <ChatInput
                onSendAction={sendMessage}
                disabled={loading || !conversation}
            />
        </div>
    );
}
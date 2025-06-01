"use client";

import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow, {ChatMessageType} from "@/components/ChatWindow";

/* ────────────────────────────────────────────────────────── */
export default function ChatPage() {
    const params = useSearchParams();
    const startQuery = params.get("q") ?? "";

    const [conversations, setConversations] = useState<
        { id: string; title: string; messages: ChatMessageType[] }[]
    >([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    /* helpers */
    const createConversation = (firstUserMessage: string) => {
        const id = crypto.randomUUID();
        setConversations((prev) => [
            {
                id,
                title: firstUserMessage.slice(0, 30) || "New chat",
                messages: firstUserMessage
                    ? [{role: "user", content: firstUserMessage}]
                    : [],
            },
            ...prev,
        ]);
        setActiveId(id);
    };

    const updateConversation = (id: string, msgs: ChatMessageType[]) =>
        setConversations((p) =>
            p.map((c) => (c.id === id ? {...c, messages: msgs} : c)),
        );

    /* first render */
    useEffect(() => {
        const stored = localStorage.getItem("conversations");
        if (stored) setConversations(JSON.parse(stored));
        if (startQuery) createConversation(startQuery);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* persist */
    useEffect(() => {
        localStorage.setItem("conversations", JSON.stringify(conversations));
    }, [conversations]);

    const activeConv = conversations.find((c) => c.id === activeId) ?? null;

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-white">
            <ChatSidebar
                conversations={conversations}
                activeId={activeId}
                onSelectAction={(id) => setActiveId(id)}
                onNewChatAction={() => createConversation("")}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeId ?? "empty"}
                    transition={{type: "spring", stiffness: 120, damping: 20}}
                    initial={{opacity: 0, x: 30}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: -30}}
                    className="flex flex-col flex-1 h-full"
                >
                    <ChatWindow
                        conversation={activeConv}
                        /* make sure the callback returns void */
                        onMessagesChangeAction={(msgs) => {
                            if (activeId) {
                                updateConversation(activeId, msgs);
                            }
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

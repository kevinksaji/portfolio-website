"use client";

import clsx from "clsx";
import {Button} from "./ui/button";

type Props = {
    conversations: { id: string; title: string }[];
    activeId: string | null;
    onSelectAction: (id: string) => void;   // ← renamed
    onNewChatAction: () => void;            // ← renamed
};

export default function ChatSidebar({
                                        conversations,
                                        activeId,
                                        onSelectAction,
                                        onNewChatAction,
                                    }: Props) {
    return (
        <aside className="w-64 border-r border-gray-200 bg-gray-50 h-full flex flex-col">
            <div className="p-4">
                <Button className="w-full" onClick={onNewChatAction}>
                    + New chat
                </Button>
            </div>

            <nav className="flex-1 overflow-y-auto">
                {conversations.map((c) => (
                    <button
                        key={c.id}
                        className={clsx(
                            "w-full text-left px-4 py-2 truncate hover:bg-gray-100",
                            c.id === activeId && "bg-gray-200 font-medium",
                        )}
                        onClick={() => onSelectAction(c.id)}
                    >
                        {c.title}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

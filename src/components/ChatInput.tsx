"use client";

import {useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";

type Props = {
    onSendAction: (text: string) => Promise<void>;
    disabled?: boolean;
    placeholder?: string;
};

/**
 * Chat input component. Handles text input, validation, and message sending.
 * Delegates actual sending logic to parent via async callback.
 */
export default function ChatInput({ onSendAction, disabled = false, placeholder = "Type a message..." }: Props) {
    const [text, setText] = useState("");

    /**
     * Send message to parent component.
     * Clears input immediately and handles errors gracefully.
     */
    const send = async () => {
        if (!text.trim() || disabled) return;
        
        const messageText = text.trim();
        setText("");
        
        try {
            await onSendAction(messageText);
        } catch (error) {
            setText(messageText);
            console.error("Failed to send message:", error);
        }
    };

    /**
     * Handle Enter key press to send message.
     * Shift+Enter can be used for new lines in the future.
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <div className="bg-background/80 dark:bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
            <div className="flex space-x-2 sm:space-x-3">
                <Input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground shadow-none ring-0"
                />
                
                <Button
                    onClick={send}
                    disabled={disabled || !text.trim()}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-foreground dark:bg-background text-background dark:text-foreground hover:bg-muted-foreground dark:hover:bg-muted disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                    <svg className="w-4 sm:w-5 h-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}

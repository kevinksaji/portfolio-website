// The input bar component used in the chat window component

"use client";

import {useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";

/**
 * Props interface for the ChatInput component
 * 
 * @param onSendAction - Callback function called when user sends a message
 * @param disabled - Boolean to disable the input (e.g., during API calls)
 * @param placeholder - Text to show when input is empty
 */
type Props = {
    onSendAction: (text: string) => void;
    disabled?: boolean;
    placeholder?: string;
};

/**
 * ChatInput Component
 * 
 * This component provides the user interface for typing and sending messages.
 * It handles:
 * 1. Text input management and validation
 * 2. Keyboard event handling (Enter key to send)
 * 3. Button click events
 * 4. Visual feedback during disabled states
 * 5. Responsive design for different screen sizes
 * 
 * The component is designed to be lightweight and focused solely on input handling,
 * delegating the actual message sending logic to its parent through callbacks.
 */
export default function ChatInput({ onSendAction, disabled = false, placeholder = "Type a message..." }: Props) {
    // Local state for the input text
    // This is managed internally and cleared after sending
    const [text, setText] = useState("");

    /**
     * Sends the current message text
     * 
     * This function:
     * 1. Validates the text is not empty or just whitespace
     * 2. Checks if the input is disabled
     * 3. Calls the parent callback with the trimmed text
     * 4. Clears the input field for the next message
     * 
     * The function prevents sending empty messages and respects the disabled state
     */
    const send = () => {
        // Don't send if text is empty/whitespace or input is disabled
        if (!text.trim() || disabled) return;
        
        // Call the parent function with the trimmed message
        onSendAction(text.trim());
        
        // Clear the input for the next message
        setText("");
    };

    /**
     * Handles keyboard events for the input field
     * 
     * This allows users to:
     * - Press Enter to send a message
     * - Use Shift+Enter for new lines (if needed in the future)
     * 
     * @param e - The keyboard event object
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Send message on Enter key (but not Shift+Enter)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevent default form submission behavior
            send();
        }
    };

    return (
        <div className="bg-background/80 dark:bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-2 sm:p-3">
            <div className="flex space-x-2 sm:space-x-3">
                {/* 
                    Text Input Field
                    
                    This input:
                    - Captures user typing
                    - Handles keyboard events
                    - Shows placeholder text when empty
                    - Respects disabled state
                    - Has responsive sizing and styling
                    - Includes focus states and transitions
                */}
                <Input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 text-sm sm:text-base border-0 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0 transition-all bg-background dark:bg-background text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground shadow-none ring-0"
                />
                
                {/* 
                    Send Button
                    
                    This button:
                    - Triggers message sending when clicked
                    - Shows a paper airplane icon
                    - Is disabled when input is empty or component is disabled
                    - Has hover and disabled states
                    - Uses responsive sizing
                    - Includes smooth transitions
                */}
                <Button
                    onClick={send}
                    disabled={disabled || !text.trim()}
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-foreground dark:bg-background text-background dark:text-foreground hover:bg-muted-foreground dark:hover:bg-muted disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                    {/* Paper airplane icon representing "send" */}
                    <svg className="w-4 sm:w-5 h-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}

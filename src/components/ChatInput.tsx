// the input bar compontent used in the chat window component

"use client";

import {useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";

type Props = { onSendAction: (text: string) => void; disabled?: boolean }; // prop that passes in the user message to the LLM during the onSendAction

export default function ChatInput({onSendAction, disabled}: Props) { // chat input component that takes in the onSendAction prop and the disabled prop
    
    const [val, setVal] = useState(""); // state to store the user message

    const send = () => {
        if (!val.trim() || disabled) return; // if the value is empty or the disabled prop is true, return
        onSendAction(val); // pass the user message to the LLM during the onSendAction
        setVal(""); // reset the value to an empty string
    };

    return (
        <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-3 max-w-4xl mx-auto">
                <Input
                    className="flex-1 text-base border-gray-300 rounded-full px-4 py-3 focus:border-black focus:ring-1 focus:ring-black transition-colors"
                    placeholder="Type a message..."
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    disabled={disabled} // if the disabled prop is true, disable the input bar
                />
                <Button 
                    onClick={send} 
                    disabled={disabled || !val.trim()} // if the disabled prop is true or the value is empty, disable the button
                    className="px-6 py-3 rounded-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                    </svg>
                </Button>
            </div>
        </div>
    );
}

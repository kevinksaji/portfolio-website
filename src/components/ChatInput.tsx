"use client";

import {useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";

/* renamed prop -------------------------------------------- */
type Props = { onSendAction: (text: string) => void; disabled?: boolean };

export default function ChatInput({onSendAction, disabled}: Props) {
    const [val, setVal] = useState("");

    const send = () => {
        if (!val.trim() || disabled) return;
        onSendAction(val);          // <-- use new name
        setVal("");
    };

    return (
        <div className="border-t border-gray-200 p-4 flex space-x-2">
            <Input
                className="flex-1"
                placeholder="Send a message..."
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={disabled}
            />
            <Button onClick={send} disabled={disabled}>
                Send
            </Button>
        </div>
    );
}

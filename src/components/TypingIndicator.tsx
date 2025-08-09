"use client";

export default function TypingIndicator() {
    return (
        <div className="flex items-center space-x-1 bg-background border border-border rounded-2xl rounded-bl-md px-4 py-3 shadow-lg relative">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            {/* Speech bubble tail */}
            <div className="absolute bottom-0 left-0 w-0 h-0 border-r-[12px] border-r-background border-t-[12px] border-t-transparent"></div>
        </div>
    );
}

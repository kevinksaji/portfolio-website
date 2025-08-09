"use client";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-black rounded-2xl px-4 py-3 border border-gray-200 shadow-sm max-w-[75%]">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-gray-500 text-sm ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  );
}

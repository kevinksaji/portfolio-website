"use client";

import { useState } from "react";
import React from "react";

interface FormattedMessageProps {
  content: string;
}

export default function FormattedMessage({ content }: FormattedMessageProps) {
  const [expandedCodeBlocks, setExpandedCodeBlocks] = useState<Set<number>>(new Set());

  const toggleCodeBlock = (index: number) => {
    const newExpanded = new Set(expandedCodeBlocks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCodeBlocks(newExpanded);
  };

  const renderContent = () => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let i = 0;
    let codeBlockIndex = 0;

    while (i < lines.length) {
      const line = lines[i];
      
      // Check if this line starts a code block
      if (line.startsWith('```')) {
        const language = line.slice(3);
        const codeLines: string[] = [];
        i++;
        
        // Collect all lines until the closing ```
        while (i < lines.length && lines[i] !== '```') {
          codeLines.push(lines[i]);
          i++;
        }
        
        if (i < lines.length) {
          i++; // Skip the closing ```
        }
        
        const isExpanded = expandedCodeBlocks.has(codeBlockIndex);
        const shouldTruncate = codeLines.length > 10 && !isExpanded;
        const displayLines = shouldTruncate ? codeLines.slice(0, 10) : codeLines;
        
        elements.push(
          <div key={`code-${codeBlockIndex}`} className="bg-card text-foreground rounded-lg p-3 my-2 overflow-x-auto border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-300 dark:text-gray-400 uppercase font-mono">
                {language || 'text'}
              </span>
              {codeLines.length > 10 && (
                <button 
                  onClick={() => toggleCodeBlock(codeBlockIndex)}
                  className="text-xs text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-200 px-2 py-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
            <pre className="text-sm">
              <code>
                {displayLines.map((codeLine, lineIndex) => (
                  <div key={lineIndex} className="font-mono">
                    {codeLine}
                  </div>
                ))}
                {shouldTruncate && (
                  <div className="text-gray-400 dark:text-gray-500 italic">
                    ... and {codeLines.length - 10} more lines
                  </div>
                )}
              </code>
            </pre>
          </div>
        );
        
        codeBlockIndex++;
        continue;
      }
      
      // Regular text line
      if (line.trim() === '') {
        elements.push(<br key={`br-${i}`} />);
        i++;
        continue;
      }
      
      // Process the line for inline formatting
      const processLine = (text: string) => {
        // Handle bold text first (before italic to avoid conflicts)
        if (text.includes('**')) {
          const parts = text.split('**');
          return parts.map((part, partIndex) => 
            partIndex % 2 === 0 ? (
              <span key={partIndex}>{processLine(part)}</span>
            ) : (
              <strong key={partIndex} className="font-semibold">{part}</strong>
            )
          );
        }
        
        // Handle italic text
        if (text.includes('*') && !text.includes('**')) {
          const parts = text.split('*');
          return parts.map((part, partIndex) => 
            partIndex % 2 === 0 ? (
              <span key={partIndex}>{processLine(part)}</span>
            ) : (
              <em key={partIndex} className="italic">{part}</em>
            )
          );
        }
        
        // Handle inline code
        if (text.includes('`')) {
          const parts = text.split('`');
          return parts.map((part, partIndex) => 
            partIndex % 2 === 0 ? (
              <span key={partIndex}>{part}</span>
            ) : (
              <code key={partIndex} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-600">
                {part}
              </code>
            )
          );
        }
        
        return text;
      };
      
      elements.push(
        <div key={`line-${i}`} className="mb-2 leading-relaxed">
          {processLine(line)}
        </div>
      );
      i++;
    }
    
    return elements;
  };

  return (
    <div className="whitespace-pre-wrap">
      {renderContent()}
    </div>
  );
}

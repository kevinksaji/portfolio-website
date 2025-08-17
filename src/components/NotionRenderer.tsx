interface NotionRendererProps {
  recordMap: {
    block: Record<string, {
      value: {
        id: string;
        type: string;
        properties: Record<string, unknown>;
      };
    }>;
  } | null;
}

export default function NotionRenderer({ recordMap }: NotionRendererProps) {
  if (!recordMap) {
    return null;
  }

  const blocks = Object.values(recordMap.block);
  let numberedListCounter = 0;
  
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (!block.value) return null;
        
        const { type, properties } = block.value;
        const blockId = block.value.id || `block-${index}`;
        
        // Handle different block types
        switch (type) {
          case 'divider':
            return <hr key={blockId} className="border-border my-6" />;
            
          case 'heading_1':
            numberedListCounter = 0;
            const h1Text = (properties.rich_text as Array<{ plain_text: string }>) || [];
            return (
              <h1 key={blockId} className="text-3xl font-bold text-foreground">
                {h1Text.map(t => t.plain_text).join('')}
              </h1>
            );
            
          case 'heading_2':
            numberedListCounter = 0;
            const h2Text = (properties.rich_text as Array<{ plain_text: string }>) || [];
            return (
              <h2 key={blockId} className="text-2xl font-semibold text-foreground">
                {h2Text.map(t => t.plain_text).join('')}
              </h2>
            );
            
          case 'heading_3':
            numberedListCounter = 0;
            const h3Text = (properties.rich_text as Array<{ plain_text: string }>) || [];
            return (
              <h3 key={blockId} className="text-xl font-medium text-foreground">
                {h3Text.map(t => t.plain_text).join('')}
              </h3>
            );
            
          case 'paragraph':
            const pText = (properties.rich_text as Array<{ plain_text: string }>) || [];
            const pContent = pText.map(t => t.plain_text).join('');
            if (!pContent.trim()) return null;
            return (
              <p key={blockId} className="text-muted-foreground leading-relaxed">
                {pContent}
              </p>
            );
            
          case 'bulleted_list_item':
            const ulText = (properties.rich_text as Array<{ plain_text: string }>) || [];
            const ulContent = ulText.map(t => t.plain_text).join('');
            if (!ulContent.trim()) return null;
            return (
              <div key={blockId} className="flex items-start gap-2">
                <span className="text-muted-foreground text-lg leading-none mt-0.5">•</span>
                <span className="text-muted-foreground leading-relaxed flex-1">{ulContent}</span>
              </div>
            );
            
          case 'numbered_list_item':
            const olText = (properties.rich_text as Array<{ plain_text: string }>) || [];
            const olContent = olText.map(t => t.plain_text).join('');
            if (!olContent.trim()) return null;
            numberedListCounter++;
            return (
              <div key={blockId} className="flex items-start gap-2">
                <span className="text-muted-foreground text-sm leading-none mt-0.5 min-w-[1.5rem]">{numberedListCounter}.</span>
                <span className="text-muted-foreground leading-relaxed flex-1">{olContent}</span>
              </div>
            );
            
          case 'code':
            const codeText = (properties.rich_text as Array<{ plain_text: string }>) || [];
            const codeContent = codeText.map(t => t.plain_text).join('');
            if (!codeContent.trim()) return null;
            return (
              <pre key={blockId} className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-foreground font-mono">
                  {codeContent}
                </code>
              </pre>
            );
            
          case 'quote':
            const quoteText = (properties.rich_text as Array<{ plain_text: string }>) || [];
            const quoteContent = quoteText.map(t => t.plain_text).join('');
            if (!quoteContent.trim()) return null;
            return (
              <blockquote key={blockId} className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                {quoteContent}
              </blockquote>
            );
            
          default:
            const defaultText = (properties.rich_text as Array<{ plain_text: string }>) || [];
            const defaultContent = defaultText.map(t => t.plain_text).join('');
            if (!defaultContent.trim()) return null;
            return (
              <p key={blockId} className="text-muted-foreground leading-relaxed">
                {defaultContent}
              </p>
            );
        }
      })}
    </div>
  );
}

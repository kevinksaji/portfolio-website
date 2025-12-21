import type { NotionBlock } from '@/lib/notion';
import type { RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { Fragment } from 'react';
import Image from 'next/image';

interface NotionRendererProps {
  blocks: NotionBlock[] | null;
}

function renderRichText(richText: RichTextItemResponse[]) {
  return richText.map((t, idx) => {
    const className = [
      t.annotations.bold ? 'font-semibold' : '',
      t.annotations.italic ? 'italic' : '',
      t.annotations.underline ? 'underline' : '',
      t.annotations.strikethrough ? 'line-through' : '',
      t.annotations.code ? 'font-mono text-sm bg-muted px-1 py-0.5 rounded' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const content = <span className={className}>{t.plain_text}</span>;
    if (t.href) {
      return (
        <a
          key={idx}
          href={t.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          {content}
        </a>
      );
    }

    return <Fragment key={idx}>{content}</Fragment>;
  });
}

function renderBlock(block: NotionBlock): React.ReactNode {
  switch (block.type) {
    case 'paragraph': {
      const text = block.paragraph.rich_text;
      if (text.length === 0) return <div className="h-3" />;
      return <p className="leading-7">{renderRichText(text)}</p>;
    }
    case 'heading_1':
      return <h1 className="text-3xl font-bold tracking-tight mt-8 mb-3">{renderRichText(block.heading_1.rich_text)}</h1>;
    case 'heading_2':
      return <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-3">{renderRichText(block.heading_2.rich_text)}</h2>;
    case 'heading_3':
      return <h3 className="text-xl font-semibold tracking-tight mt-6 mb-2">{renderRichText(block.heading_3.rich_text)}</h3>;
    case 'quote':
      return (
        <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground">
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );
    case 'code':
      return (
        <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm">
          <code>{block.code.rich_text.map((t) => t.plain_text).join('')}</code>
        </pre>
      );
    case 'divider':
      return <hr className="my-8 border-border" />;
    case 'image': {
      const url = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      const caption = block.image.caption?.map((t) => t.plain_text).join('') || '';
      return (
        <figure className="my-6">
          <Image src={url} alt={caption || 'Notion image'} className="max-w-full rounded-lg" width={800} height={600} />
          {caption ? <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption> : null}
        </figure>
      );
    }
    case 'callout': {
      return (
        <div className="my-4 rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-foreground">{renderRichText(block.callout.rich_text)}</div>
          {block.children?.length ? <div className="mt-3 space-y-3">{renderBlocks(block.children)}</div> : null}
        </div>
      );
    }
    default:
      // Unsupported block types are safely ignored.
      return null;
  }
}

function renderBlocks(blocks: NotionBlock[]) {
  const nodes: React.ReactNode[] = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];

    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const isNumbered = block.type === 'numbered_list_item';
      const items: NotionBlock[] = [];

      while (
        i < blocks.length &&
        blocks[i] &&
        (blocks[i].type === (isNumbered ? 'numbered_list_item' : 'bulleted_list_item'))
      ) {
        items.push(blocks[i]);
        i += 1;
      }

      // Step back one since the for-loop will increment again
      i -= 1;

      const ListTag = isNumbered ? 'ol' : 'ul';

      nodes.push(
        <ListTag
          key={`list-${block.id}`}
          className={isNumbered ? 'list-decimal pl-6 space-y-2' : 'list-disc pl-6 space-y-2'}
        >
          {items.map((item) => {
            let text: RichTextItemResponse[] = [];
            if (item.type === 'bulleted_list_item') {
              text = item.bulleted_list_item.rich_text;
            } else if (item.type === 'numbered_list_item') {
              text = item.numbered_list_item.rich_text;
            }
            return (
              <li key={item.id}>
                <span>{renderRichText(text)}</span>
                {item.children?.length ? <div className="mt-2 space-y-2">{renderBlocks(item.children)}</div> : null}
              </li>
            );
          })}
        </ListTag>
      );

      continue;
    }

    const node = renderBlock(block);
    if (!node) {
      continue;
    }

    nodes.push(
      <div key={block.id} className="space-y-3">
        {node}
        {block.children?.length ? <div className="ml-4 space-y-3">{renderBlocks(block.children)}</div> : null}
      </div>
    );
  }

  return <div className="space-y-4">{nodes}</div>;
}

export default function NotionRenderer({ blocks }: NotionRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return <div className="w-full">{renderBlocks(blocks)}</div>;
}

'use client';

import dynamic from 'next/dynamic';
import { NotionRenderer as NotionRendererBase } from 'react-notion-x';
import type { ExtendedRecordMap } from 'notion-types';
import { useTheme } from './ThemeProvider';

// Import required CSS for react-notion-x
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

// Lazy load optional components for better performance
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
);

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
);

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
);

const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
);

const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
);

interface NotionRendererProps {
  recordMap: ExtendedRecordMap | null;
}

export default function NotionRenderer({ recordMap }: NotionRendererProps) {
  const { theme, mounted } = useTheme();
  
  if (!recordMap) {
    return null;
  }

  // Determine if we're in dark mode
  // Handle system theme by checking if dark class is applied to document
  const isDarkMode = mounted 
    ? theme === 'dark' || (theme === 'system' && document.documentElement.classList.contains('dark'))
    : false; // Default to light mode during SSR

  return (
    <div className="notion-renderer-clean">
      <NotionRendererBase
        recordMap={recordMap}
        fullPage={false}
        darkMode={isDarkMode}
        disableHeader={true}
        showTableOfContents={false}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf
        }}
      />
      <style jsx global>{`
        .notion-renderer-clean .notion-page-content-has-aside {
          max-width: none !important;
        }
        .notion-renderer-clean .notion-collection-row {
          display: none !important;
        }
        .notion-renderer-clean .notion-collection-row-property {
          display: none !important;
        }
        .notion-renderer-clean .notion-property {
          display: none !important;
        }
        .notion-renderer-clean .notion-page-content > .notion-collection-row:first-child {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

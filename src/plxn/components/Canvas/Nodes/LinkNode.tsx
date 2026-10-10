import React from 'react';
import { NodeItem } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { ExternalLink, Globe } from 'lucide-react';

interface LinkNodeProps {
  node: NodeItem;
}

export const LinkNode: React.FC<LinkNodeProps> = ({ node }) => {
  const { updateNode } = useProjectContext();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { url: e.target.value });
  };

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { linkDescription: e.target.value });
  };

  let domain = '';
  try {
    if (node.url) {
      const parsed = new URL(node.url.startsWith('http') ? node.url : `https://${node.url}`);
      domain = parsed.hostname.replace('www.', '');
    }
  } catch {
    domain = 'link';
  }

  const openLink = () => {
    if (!node.url) return;
    const targetUrl = node.url.startsWith('http') ? node.url : `https://${node.url}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-2.5">
      {/* Title */}
      <input
        type="text"
        value={node.title}
        onChange={handleTitleChange}
        placeholder="Link title..."
        className="w-full bg-transparent font-medium text-sm text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 -mx-1 transition-colors"
      />

      {/* URL Input with Open Button */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#1A1814]/[0.03] dark:bg-[#F2EEE2]/[0.04] rounded-none border-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10">
        <Globe className="w-3.5 h-3.5 text-[#6B6356] dark:text-[#A39B8B] shrink-0 ml-1" />
        <input
          type="text"
          value={node.url || ''}
          onChange={handleUrlChange}
          placeholder="https://example.com"
          className="flex-1 min-w-0 bg-transparent text-xs text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none font-mono truncate"
        />
        {node.url && (
          <button
            onClick={openLink}
            title={`Open ${domain}`}
            className="p-1 rounded-none text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] hover:bg-[var(--lime)]/20 dark:hover:text-[#1A1814] transition-colors shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Optional Description */}
      <textarea
        value={node.linkDescription || ''}
        onChange={handleDescChange}
        rows={2}
        placeholder="Add context or notes about this resource..."
        className="w-full resize-none bg-transparent text-xs text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/10 rounded-none p-1 plxn-scroll"
      />

      {domain && (
        <div className="text-[10px] font-mono tracking-tight text-[#6B6356] dark:text-[#A39B8B] truncate flex items-center gap-1 uppercase">
          <span>Source:</span>
          <span className="text-[#1A1814] dark:text-[#F2EEE2] underline underline-offset-2 normal-case">{domain}</span>
        </div>
      )}
    </div>
  );
};

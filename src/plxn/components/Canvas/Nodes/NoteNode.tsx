import React, { useState } from 'react';
import { NodeItem, ChecklistItem } from '@/plxn/types';
import { useProjectContext } from '@/plxn/context/ProjectContext';
import { Plus, Check, X } from 'lucide-react';

interface NoteNodeProps {
  node: NodeItem;
}

export const NoteNode: React.FC<NoteNodeProps> = ({ node }) => {
  const { updateNode } = useProjectContext();
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNode(node.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNode(node.id, { content: e.target.value });
  };

  const toggleChecklistItem = (itemId: string) => {
    const list = node.checklist || [];
    const updated = list.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    updateNode(node.id, { checklist: updated }, true);
  };

  const addChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: 'c-' + Date.now(),
      text: newChecklistText.trim(),
      done: false,
    };
    const list = node.checklist || [];
    updateNode(node.id, { checklist: [...list, newItem] }, true);
    setNewChecklistText('');
    setIsAddingItem(false);
  };

  const removeChecklistItem = (itemId: string) => {
    const list = node.checklist || [];
    updateNode(node.id, { checklist: list.filter((i) => i.id !== itemId) }, true);
  };

  const checklist = node.checklist || [];
  const completedCount = checklist.filter((i) => i.done).length;

  return (
    <div className="space-y-3">
      {/* Title */}
      <input
        type="text"
        value={node.title}
        onChange={handleTitleChange}
        placeholder="Note title..."
        className="w-full bg-transparent font-medium text-sm text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/15 rounded-sm px-1 -mx-1 transition-colors"
      />

      {/* Content / Body */}
      <textarea
        value={node.content || ''}
        onChange={handleContentChange}
        rows={3}
        placeholder="Write note or brief description..."
        className="w-full resize-none bg-[#1A1814]/[0.03] dark:bg-[#F2EEE2]/[0.04] hover:bg-[#1A1814]/[0.05] dark:hover:bg-[#F2EEE2]/[0.06] text-xs text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:bg-[var(--lime)]/10 rounded-none p-2 transition-colors border-2 border-[#1A1814]/10 dark:border-[#F2EEE2]/10 focus:border-[#1A1814]/30 dark:focus:border-[#F2EEE2]/30 leading-relaxed plxn-scroll"
      />

      {/* Interactive Checklist */}
      <div className="space-y-1.5 pt-1">
        {checklist.length > 0 && (
          <div className="flex items-center justify-between text-[11px] text-[#6B6356] dark:text-[#A39B8B] font-medium px-0.5 font-mono tracking-tight">
            <span>CHECKLIST</span>
            <span className="font-mono tabular-nums">{completedCount}/{checklist.length}</span>
          </div>
        )}

        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 plxn-scroll">
          {checklist.map((item) => (
            <div
              key={item.id}
              className="group/item flex items-center justify-between gap-2 p-1.5 rounded-none hover:bg-[#1A1814]/[0.03] dark:hover:bg-[#F2EEE2]/[0.04] text-xs text-[#1A1814] dark:text-[#F2EEE2] transition-colors"
            >
              <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-center justify-center w-4 h-4 shrink-0 border-2 transition-all ${
                    item.done
                      ? 'bg-[var(--lime)] border-[#1A1814] dark:border-[#F2EEE2]'
                      : 'bg-transparent border-[#1A1814] dark:border-[#F2EEE2] hover:bg-[var(--lime)]/15'
                  }`}
                >
                  {item.done && (
                    <Check className="w-3 h-3 text-[#1A1814] plxn-check" strokeWidth={3} />
                  )}
                </button>
                <span
                  className={`truncate text-xs ${
                    item.done
                      ? 'line-through text-[#6B6356] dark:text-[#A39B8B]'
                      : 'text-[#1A1814] dark:text-[#F2EEE2]'
                  }`}
                >
                  {item.text}
                </span>
              </label>
              <button
                onClick={() => removeChecklistItem(item.id)}
                className="opacity-0 group-hover/item:opacity-100 p-0.5 text-[#6B6356] dark:text-[#A39B8B] hover:text-[#D14530] dark:hover:text-[#E5573F] transition-opacity"
                title="Remove item"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add item control */}
        {isAddingItem ? (
          <div className="flex items-center gap-1.5 pt-1">
            <input
              type="text"
              autoFocus
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addChecklistItem();
                if (e.key === 'Escape') setIsAddingItem(false);
              }}
              placeholder="New checklist item..."
              className="flex-1 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] rounded-none px-2 py-1 text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#6B6356] dark:placeholder:text-[#A39B8B] focus:outline-none focus:ring-2 focus:ring-[var(--lime)]/70"
            />
            <button
              onClick={addChecklistItem}
              className="brut-xs rounded-none p-1 bg-[var(--lime)] text-[#1A1814] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
              title="Confirm add"
            >
              <Check className="w-3 h-3" strokeWidth={3} />
            </button>
            <button
              onClick={() => setIsAddingItem(false)}
              className="p-1 rounded-none hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720] text-[#6B6356] dark:text-[#A39B8B] transition-colors"
              title="Cancel"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-[#6B6356] dark:text-[#A39B8B] hover:text-[#1A1814] dark:hover:text-[#F2EEE2] transition-colors py-1 px-1 rounded-none hover:bg-[#ECE6D6] dark:hover:bg-[#2A2720]"
          >
            <Plus className="w-3 h-3" />
            <span>Add item</span>
          </button>
        )}
      </div>
    </div>
  );
};

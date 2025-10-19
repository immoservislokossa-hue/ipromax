import { useCallback, useRef } from 'react';
import { useEditor, Editor } from '@tiptap/react';
import { debounce } from 'lodash-es';
import { loadExtensions } from '../utils/editorExtensions';

interface UseTiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  onSEOUpdate?: (stats: { html: string; text: string }) => void;
}

// Debounce maison comme fallback
const createDebounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useTiptapEditor = ({ content, onChange, onSEOUpdate }: UseTiptapEditorProps) => {
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedOnChange = useCallback(
    debounce ? debounce((html: string) => {
      onChange?.(html);
    }, 300) : createDebounce((html: string) => {
      onChange?.(html);
    }, 300),
    [onChange]
  );

  const editor = useEditor({
    extensions: [],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        debouncedOnChange(html);
        onSEOUpdate?.({
          html,
          text: editor.getText()
        });
      }, 100);
    },
    immediatelyRender: false,
  });

  const initializeEditor = useCallback(async () => {
    if (!editor) return;
    
    const extensions = await loadExtensions();
    editor.setOptions({ extensions });
    
    if (content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return {
    editor,
    initializeEditor
  };
};
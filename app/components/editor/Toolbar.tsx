'use client';

import { memo, useMemo } from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold, Italic, Underline, Link2, ImageIcon, Video, Eye,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, Palette
} from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
  onShowModal: (modal: 'link' | 'image' | 'video') => void;
  onToggleSEO: () => void;
  showSEO: boolean;
}

// Types pour les boutons
interface BaseButton {
  icon: React.ComponentType<LucideProps>;
  label: string;
  isActive: (editor: Editor) => boolean;
}

interface ActionButton extends BaseButton {
  action: (editor: Editor) => void;
  shortcut?: string;
  modal?: never;
}

interface ModalButton extends BaseButton {
  action: null;
  modal: 'link' | 'image' | 'video';
  shortcut?: never;
}

type ToolbarButton = ActionButton | ModalButton;

const BUTTON_GROUPS: { name: string; buttons: ToolbarButton[] }[] = [
  {
    name: 'format',
    buttons: [
      { 
        icon: Bold, 
        action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
        isActive: (editor: Editor) => editor.isActive('bold'),
        label: 'Gras',
        shortcut: 'Ctrl+B'
      },
      { 
        icon: Italic, 
        action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
        isActive: (editor: Editor) => editor.isActive('italic'),
        label: 'Italique',
        shortcut: 'Ctrl+I'
      },
      { 
        icon: Underline, 
        action: (editor: Editor) => editor.chain().focus().toggleUnderline().run(),
        isActive: (editor: Editor) => editor.isActive('underline'),
        label: 'Souligné',
        shortcut: 'Ctrl+U'
      },
    ]
  },
  {
    name: 'headings',
    buttons: [
      { 
        icon: Heading1, 
        action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 1 }),
        label: 'Titre H1'
      },
      { 
        icon: Heading2, 
        action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 2 }),
        label: 'Titre H2'
      },
      { 
        icon: Heading3, 
        action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: (editor: Editor) => editor.isActive('heading', { level: 3 }),
        label: 'Titre H3'
      },
    ]
  },
  {
    name: 'media',
    buttons: [
      { 
        icon: Link2, 
        action: null,
        isActive: () => false,
        label: 'Insérer un lien',
        modal: 'link' as const
      },
      { 
        icon: ImageIcon, 
        action: null,
        isActive: () => false,
        label: 'Insérer une image',
        modal: 'image' as const
      },
      { 
        icon: Video, 
        action: null,
        isActive: () => false,
        label: 'Insérer une vidéo',
        modal: 'video' as const
      },
    ]
  }
];

const Toolbar = memo(({ editor, onShowModal, onToggleSEO, showSEO }: ToolbarProps) => {
  const colorPalette = useMemo(() => [
    '#000000', '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#a855f7'
  ], []);

  if (!editor) return null;

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const getButtonTitle = (button: ToolbarButton) => {
    return button.shortcut ? `${button.label} (${button.shortcut})` : button.label;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10">
      {BUTTON_GROUPS.map((group, groupIndex) => (
        <div key={group.name} className="flex items-center gap-1">
          {group.buttons.map((button, buttonIndex) => {
            const Icon = button.icon;
            const isActive = button.isActive(editor);
            const title = getButtonTitle(button);
            
            return (
              <button
                key={`${group.name}-${buttonIndex}`}
                onClick={() => {
                  if (button.modal) {
                    onShowModal(button.modal);
                  } else if (button.action) {
                    button.action(editor);
                  }
                }}
                title={title}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'text-gray-700 border-transparent hover:bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
                aria-label={button.label}
                data-active={isActive} // Remplace aria-pressed pour éviter l'erreur
              >
                <Icon size={16} />
              </button>
            );
          })}
          {groupIndex < BUTTON_GROUPS.length - 1 && (
            <div className="w-px h-6 bg-gray-300 mx-1" />
          )}
        </div>
      ))}

      {/* Palette de couleurs */}
      <div className="flex items-center gap-1 ml-2">
        {colorPalette.map((color) => (
          <button
            key={color}
            onClick={() => applyColor(color)}
            title={`Couleur ${color}`}
            className="color-button"
            style={{ backgroundColor: color }}
            aria-label={`Appliquer la couleur ${color}`}
          />
        ))}
      </div>

      {/* Bouton SEO */}
      <button 
        onClick={onToggleSEO}
        className={`p-2 rounded-lg border transition-all duration-200 ml-auto ${
          showSEO 
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
            : 'text-gray-700 border-transparent hover:bg-white hover:border-gray-300 hover:shadow-sm'
        }`}
        aria-label="Analyse SEO"
        data-active={showSEO}
      >
        <Eye size={16} />
      </button>
    </div>
  );
});

Toolbar.displayName = 'Toolbar';

// Styles CSS pour éviter les styles inline
const styles = `
  .color-button {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #d1d5db;
    transition: transform 0.2s;
  }
  .color-button:hover {
    transform: scale(1.1);
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default Toolbar;
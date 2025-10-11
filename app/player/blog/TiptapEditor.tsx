'use client';


import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import {
  Bold,
  Italic,
  Link2,
  ImageIcon,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Underline as UnderlineIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Configuration de la syntax highlighting
const lowlight = createLowlight();
lowlight.register('javascript', js);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('json', json);
lowlight.register('python', python);

interface TiptapCoreProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function TiptapCore({ content = '', onChange }: TiptapCoreProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: '✍️ Rédigez un contenu SEO optimisé...',
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
          class: 'text-blue-600 underline hover:text-blue-800 transition',
        },
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-xl my-4 shadow-md w-full object-cover',
          alt: 'image de l\'article',
        },
      }),
      Heading.configure({
        HTMLAttributes: { 
          class: 'font-bold text-gray-900 mt-5 mb-3 leading-tight',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
        HTMLAttributes: {
          class: 'bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-blue max-w-none focus:outline-none min-h-[400px] text-gray-900 dark:text-gray-50 transition-all duration-300 leading-relaxed p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // 🧰 Toolbar buttons configuration
  const buttons = [
    { 
      icon: Bold, 
      action: () => editor?.chain().focus().toggleBold().run(), 
      active: editor?.isActive('bold'), 
      label: 'Gras' 
    },
    { 
      icon: Italic, 
      action: () => editor?.chain().focus().toggleItalic().run(), 
      active: editor?.isActive('italic'), 
      label: 'Italique' 
    },
    { 
      icon: UnderlineIcon, 
      action: () => editor?.chain().focus().toggleUnderline().run(), 
      active: editor?.isActive('underline'), 
      label: 'Souligné' 
    },
    { 
      icon: Heading1, 
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(), 
      active: editor?.isActive('heading', { level: 1 }), 
      label: 'Titre H1' 
    },
    { 
      icon: Heading2, 
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), 
      active: editor?.isActive('heading', { level: 2 }), 
      label: 'Titre H2' 
    },
    { 
      icon: Heading3, 
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), 
      active: editor?.isActive('heading', { level: 3 }), 
      label: 'Titre H3' 
    },
    { 
      icon: List, 
      action: () => editor?.chain().focus().toggleBulletList().run(), 
      active: editor?.isActive('bulletList'), 
      label: 'Liste à puces' 
    },
    { 
      icon: ListOrdered, 
      action: () => editor?.chain().focus().toggleOrderedList().run(), 
      active: editor?.isActive('orderedList'), 
      label: 'Liste numérotée' 
    },
    { 
      icon: Quote, 
      action: () => editor?.chain().focus().toggleBlockquote().run(), 
      active: editor?.isActive('blockquote'), 
      label: 'Citation' 
    },
    { 
      icon: Code, 
      action: () => editor?.chain().focus().toggleCodeBlock().run(), 
      active: editor?.isActive('codeBlock'), 
      label: 'Bloc de code' 
    },
  ];

  const addLink = () => {
    const url = prompt('🔗 Entrez l\'URL :');
    if (url && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt('🖼️ URL de l\'image :');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse bg-gray-50 rounded-lg">
        ✨ Initialisation de l'éditeur SEO...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        {buttons.map(({ icon: Icon, action, active, label }, index) => (
          <button
            key={index}
            onClick={action}
            title={label}
            className={`p-2 rounded-lg transition-all duration-200 ${
              active 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
        
        <button 
          onClick={addLink} 
          title="Insérer un lien (nofollow)" 
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <Link2 size={18} />
        </button>
        
        <button 
          onClick={addImage} 
          title="Insérer une image" 
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ImageIcon size={18} />
        </button>
        
        <div className="ml-auto flex gap-2">
          <button 
            onClick={() => editor?.chain().focus().undo().run()} 
            title="Annuler" 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Undo size={18} />
          </button>
          <button 
            onClick={() => editor?.chain().focus().redo().run()} 
            title="Rétablir" 
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Redo size={18} />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
    </motion.div>
  );
}
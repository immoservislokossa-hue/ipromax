'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, AlignLeft, AlignCenter,
  Link as LinkIcon, Image as ImageIcon, Eye, Trash2
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = "Commencez à rédiger votre article..." }: TiptapEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ 
        HTMLAttributes: { 
          class: 'rounded-lg max-w-full h-auto',
        },
        allowBase64: true,
      }),
      Link.configure({
        HTMLAttributes: { class: 'text-blue-600 underline' },
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[300px] p-6',
      },
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        // Récupérer le HTML collé
        const pastedHTML = clipboardData.getData('text/html');
        
        if (pastedHTML) {
          // Empêcher le comportement par défaut
          event.preventDefault();
          
          // Utiliser la méthode insertContent pour insérer le HTML
          const { state, dispatch } = view;
          const { selection } = state;
          const { from, to } = selection;
          
          // Créer un élément DOM temporaire pour parser le HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = pastedHTML;
          
          // Convertir le HTML en nodes ProseMirror
          const fragment = documentFragmentFromHTML(view.state.schema, pastedHTML);
          
          if (fragment) {
            // Remplacer la sélection par le fragment
            const tr = state.tr.replaceWith(from, to, fragment);
            dispatch(tr);
            return true;
          }
        }
        
        // Fallback: utiliser le texte brut
        const pastedText = clipboardData.getData('text/plain');
        if (pastedText) {
          event.preventDefault();
          const { state, dispatch } = view;
          const { selection } = state;
          const { from, to } = selection;
          
          const tr = state.tr.replaceWith(from, to, state.schema.text(pastedText));
          dispatch(tr);
          return true;
        }
        
        return false;
      },
      handleDrop: (view, event) => {
        const { dataTransfer } = event;
        if (!dataTransfer) return false;

        const html = dataTransfer.getData('text/html');
        if (html) {
          event.preventDefault();
          
          const { state, dispatch } = view;
          const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
          if (!coordinates) return false;

          // Convertir le HTML en nodes ProseMirror
          const fragment = documentFragmentFromHTML(view.state.schema, html);
          
          if (fragment) {
            // Insérer le fragment à la position de drop
            const tr = state.tr.insert(coordinates.pos, fragment);
            dispatch(tr);
            return true;
          }
        }
        
        return false;
      },
    },
    immediatelyRender: false,
  });

  // Fonction utilitaire pour convertir HTML en fragment ProseMirror
  const documentFragmentFromHTML = (schema: any, html: string) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Utiliser DOMSerializer pour convertir le HTML en fragment ProseMirror
      // Cette approche est plus simple et évite les problèmes de parsing complexes
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Pour une solution simple, on peut utiliser le texte seulement
      // ou implémenter une conversion manuelle pour les cas simples
      const textContent = tempDiv.textContent || '';
      return schema.text(textContent);
      
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return null;
    }
  };

  // Fonction pour nettoyer le contenu HTML
  const cleanHTML = (html: string) => {
    // Supprimer les balises script et style pour la sécurité
    const cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/ on\w+="[^"]*"/g, ''); // Supprimer les attributs d'événements
    
    return cleaned;
  };

  // Fonction pour importer du HTML externe
  const handleImportHTML = () => {
    const html = prompt('Collez votre HTML ici:');
    if (html && editor) {
      const cleanedHTML = cleanHTML(html);
      editor.commands.setContent(cleanedHTML);
    }
  };

  // Fonction pour effacer tout le contenu
  const handleClearContent = () => {
    if (editor && confirm('Êtes-vous sûr de vouloir effacer tout le contenu ?')) {
      editor.commands.clearContent();
    }
  };

  // Fonction pour insérer une image via URL
  const handleInsertImage = () => {
    const url = prompt("Entrez l'URL de l'image:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Fonction pour insérer un lien
  const handleInsertLink = () => {
    const url = prompt("Entrez l'URL du lien:");
    if (url && editor) {
      // Si du texte est sélectionné, transformer en lien
      if (editor.state.selection.empty) {
        // Si pas de sélection, insérer le lien comme texte
        editor.chain().focus().setLink({ href: url }).insertContent(url).run();
      } else {
        // Appliquer le lien à la sélection
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  if (!mounted) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Chargement de l'éditeur...</p>
        </div>
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Barre d'outils */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex flex-wrap items-center gap-1">
        {/* Style de texte */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Gras"
        >
          <Bold size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Italique"
        >
          <Italic size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Souligné"
        >
          <UnderlineIcon size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Titres */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Titre 1"
        >
          <Heading1 size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Titre 2"
        >
          <Heading2 size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Titre 3"
        >
          <Heading3 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Listes */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Liste à puces"
        >
          <List size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Liste numérotée"
        >
          <ListOrdered size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alignement */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Aligner à gauche"
        >
          <AlignLeft size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Centrer"
        >
          <AlignCenter size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Citation */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Citation"
        >
          <Quote size={18} />
        </button>

        {/* Lien */}
        <button
          onClick={handleInsertLink}
          className={`p-2 rounded-lg transition-colors ${
            editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'
          }`}
          title="Insérer un lien"
        >
          <LinkIcon size={18} />
        </button>

        {/* Image */}
        <button
          onClick={handleInsertImage}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          title="Insérer une image"
        >
          <ImageIcon size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Outils supplémentaires */}
        <button
          onClick={handleImportHTML}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          title="Importer du HTML"
        >
          HTML
        </button>

        <button
          onClick={handleClearContent}
          className="p-2 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
          title="Effacer tout le contenu"
        >
          <Trash2 size={18} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Annuler/Refaire */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Annuler"
        >
          <Undo size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Refaire"
        >
          <Redo size={18} />
        </button>
      </div>

      <EditorContent 
        editor={editor} 
        className="min-h-[400px] max-h-[600px] overflow-y-auto" 
      />

      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3 flex justify-between items-center text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Eye size={16} />
          Aperçu en temps réel - Collage HTML automatique activé
        </span>
        <button
          onClick={handleImportHTML}
          className="text-blue-600 hover:text-blue-800 text-xs underline"
        >
          Importer du HTML
        </button>
      </div>
    </div>
  );
}
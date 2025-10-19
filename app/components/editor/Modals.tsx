'use client';

import { memo, useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Link2, ImageIcon, Video, X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  editor: Editor | null;
}

// Extension vidéo personnalisée (à ajouter dans vos extensions)
const insertVideo = (editor: Editor, src: string) => {
  // Méthode alternative pour insérer une vidéo
  const videoHTML = `
    <video 
      src="${src}" 
      controls 
      class="rounded-xl shadow-lg my-4 mx-auto max-w-full"
      preload="metadata"
    >
      Votre navigateur ne supporte pas les vidéos HTML5.
    </video>
  `;
  
  editor.chain().focus().insertContent(videoHTML).run();
};

const BaseModal = memo(({ 
  title, 
  icon, 
  children, 
  onClose, 
  onConfirm, 
  disabled,
  open 
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  disabled?: boolean;
  open: boolean;
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in fade-in-90 zoom-in-90"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            {icon}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Insérer
          </button>
        </div>
      </div>
    </div>
  );
});

BaseModal.displayName = 'BaseModal';

export const LinkModal = memo(({ open, onClose, editor }: ModalProps) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  const insertLink = () => {
    if (!editor || !url) return;

    if (text) {
      editor.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, rel: 'nofollow noopener noreferrer' })
        .insertContent(text)
        .run();
    } else {
      editor.chain()
        .focus()
        .setLink({ href: url, rel: 'nofollow noopener noreferrer' })
        .run();
    }

    setUrl('');
    setText('');
    onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Insérer un lien"
      icon={<Link2 size={20} />}
      onClose={onClose}
      onConfirm={insertLink}
      disabled={!url}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte du lien (optionnel)
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Texte affiché"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </BaseModal>
  );
});

LinkModal.displayName = 'LinkModal';

export const ImageModal = memo(({ open, onClose, editor }: ModalProps) => {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');

  const insertImage = () => {
    if (!editor || !src) return;

    editor.chain()
      .focus()
      .setImage({ 
        src, 
        alt: alt || 'Image descriptive pour le référencement' 
      })
      .run();

    setSrc('');
    setAlt('');
    onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Ajouter une image"
      icon={<ImageIcon size={20} />}
      onClose={onClose}
      onConfirm={insertImage}
      disabled={!src}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de l'image *
          </label>
          <input
            type="url"
            value={src}
            onChange={(e) => setSrc(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texte alternatif (SEO)
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Description de l'image pour le référencement"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </BaseModal>
  );
});

ImageModal.displayName = 'ImageModal';

export const VideoModal = memo(({ open, onClose, editor }: ModalProps) => {
  const [src, setSrc] = useState('');

  const insertVideoHandler = () => {
    if (!editor || !src) return;

    // Utilisation de la fonction personnalisée
    insertVideo(editor, src);
    setSrc('');
    onClose();
  };

  return (
    <BaseModal
      open={open}
      title="Insérer une vidéo"
      icon={<Video size={20} />}
      onClose={onClose}
      onConfirm={insertVideoHandler}
      disabled={!src}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de la vidéo *
        </label>
        <input
          type="url"
          value={src}
          onChange={(e) => setSrc(e.target.value)}
          placeholder="https://example.com/video.mp4"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
      </div>
    </BaseModal>
  );
});

VideoModal.displayName = 'VideoModal';
import { Extension } from '@tiptap/core';
import { Node } from '@tiptap/core';
import { Mark } from '@tiptap/core';

// Extension vidéo personnalisée avec typage correct
const VideoExtension = Node.create({
  name: 'video',
  
  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {
        class: 'rounded-xl shadow-lg my-4 mx-auto max-w-full',
        controls: 'true',
        preload: 'metadata',
      },
    };
  },
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') return {};
          return {
            src: node.getAttribute('src'),
            alt: node.getAttribute('alt'),
            title: node.getAttribute('title'),
          };
        },
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'video',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
      },
    ];
  },
  
  addCommands() {
    return {
      setVideo: (options: { src: string }) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    } as any;
  },
  
  addNodeView() {
    return ({ node, HTMLAttributes }: { node: any; HTMLAttributes: Record<string, any> }) => {
      const dom = document.createElement('div');
      dom.className = 'video-wrapper';
      
      const video = document.createElement('video');
      video.src = node.attrs.src;
      video.controls = true;
      video.preload = 'metadata';
      video.className = this.options.HTMLAttributes.class as string;
      
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value) {
          video.setAttribute(key, value as string);
        }
      });
      
      dom.appendChild(video);
      return {
        dom,
      };
    };
  },
});

export const loadExtensions = async (): Promise<Extension[]> => {
  const [
    { StarterKit },
    { Underline },
    { Link },
    { Image },
    { Placeholder },
    { TextAlign },
  ] = await Promise.all([
    import('@tiptap/starter-kit'),
    import('@tiptap/extension-underline'),
    import('@tiptap/extension-link'),
    import('@tiptap/extension-image'),
    import('@tiptap/extension-placeholder'),
    import('@tiptap/extension-text-align'),
  ]);

  // Import conditionnel pour Color et TextStyle
  let Color: any, TextStyle: any;
  try {
    const colorModule = await import('@tiptap/extension-color');
    const textStyleModule = await import('@tiptap/extension-text-style');
    Color = colorModule.Color;
    TextStyle = textStyleModule.TextStyle;
  } catch (error) {
    console.warn('Extensions Color/TextStyle non disponibles');
  }

  // Configuration de base avec typage explicite
  const starterKitExtension = StarterKit.configure({
    heading: { 
      levels: [1, 2, 3],
      HTMLAttributes: {
        class: 'font-bold text-gray-900 my-4',
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: 'my-2 leading-relaxed',
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc list-inside my-2',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal list-inside my-2',
      },
    },
    listItem: {
      HTMLAttributes: {
        class: 'my-1',
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-blue-500 pl-4 my-4 italic',
      },
    },
    codeBlock: false,
  }) as Extension;

  const underlineExtension = Underline.configure({
    HTMLAttributes: {
      class: 'underline',
    },
  }) as Extension;

  const textAlignExtension = TextAlign.configure({ 
    types: ['heading', 'paragraph'],
    defaultAlignment: 'left',
  }) as Extension;

  const placeholderExtension = Placeholder.configure({ 
    placeholder: '✍️ Rédigez votre contenu optimisé SEO...',
  }) as Extension;

  const linkExtension = Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: 'nofollow noopener noreferrer',
      class: 'text-blue-600 underline hover:text-blue-800 transition-colors',
      target: '_blank',
    },
  }) as Extension;

  const imageExtension = Image.configure({
    inline: false,
    HTMLAttributes: {
      class: 'rounded-xl shadow-md my-4 mx-auto max-w-full border',
      loading: 'lazy',
      decoding: 'async',
    },
  }) as Extension;

  const extensions: Extension[] = [
    starterKitExtension,
    underlineExtension,
    textAlignExtension,
    placeholderExtension,
    linkExtension,
    imageExtension,
    VideoExtension as Extension,
  ];

  // Ajouter les extensions optionnelles si disponibles
  if (TextStyle && Color) {
    const textStyleExtension = TextStyle.configure({}) as Extension;
    const colorExtension = Color.configure({}) as Extension;
    extensions.push(textStyleExtension, colorExtension);
  }

  return extensions;
};
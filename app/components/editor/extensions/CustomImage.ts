import { mergeAttributes, Node } from '@tiptap/core'

export const CustomImage = Node.create({
  name: 'customImage',

  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      title: { default: '' },
      caption: { default: '' }, // 🆕 légende
    }
  },

  parseHTML() {
    return [{ tag: 'figure' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      { class: 'my-4 text-center' },
      ['img', mergeAttributes({ class: 'rounded-lg max-w-full h-auto mx-auto' }, HTMLAttributes)],
      HTMLAttributes.caption
        ? ['figcaption', { class: 'text-sm text-gray-500 mt-2' }, HTMLAttributes.caption]
        : '',
    ]
  },

  addCommands() {
    return {
      setCustomImage:
        (options: Record<string, any>) =>
        ({ chain }: { chain: any }) => {
          return chain().insertContent({
            type: this.name,
            attrs: options,
          }).run()
        },
    } as any
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'example.com',
      'images.pexels.com', // ajoutez vos autres domaines ici
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Vos autres configurations...
}

module.exports = nextConfig
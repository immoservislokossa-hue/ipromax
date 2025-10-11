import fs from 'fs';
import path from 'path';

const mockFilePath = path.join(process.cwd(), 'app', 'mock', 'mockBlogs.ts');

export async function readMockBlogs() {
  try {
    // Lire le contenu actuel du fichier
    const fileContent = await fs.promises.readFile(mockFilePath, 'utf-8');
    
    // Extraire le tableau de blogs à partir du contenu du fichier
    const blogsMatch = fileContent.match(/const mockBlogs = (\[[\s\S]*?\]);/);
    if (!blogsMatch) {
      throw new Error('Format de fichier mock invalide');
    }
    
    // Évaluer le contenu du tableau (attention: utiliser avec des données de confiance uniquement)
    const blogs = eval(blogsMatch[1]);
    return blogs;
  } catch (error) {
    console.error('Erreur lors de la lecture des mocks:', error);
    return [];
  }
}

export async function writeMockBlogs(blogs: any[]) {
  try {
    // Formatter le contenu du fichier
    const fileContent = `const mockBlogs = ${JSON.stringify(blogs, null, 2)
      .replace(/"([^"]+)":/g, '$1:') // Convertir les clés en format non-string
      .replace(/"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)"/g, 'new Date("$1")') // Convertir les dates
    };

export default mockBlogs;
`;

    // Écrire dans le fichier
    await fs.promises.writeFile(mockFilePath, fileContent, 'utf-8');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'écriture des mocks:', error);
    return false;
  }
}

export async function updateMockBlog(slug: string, data: any) {
  const blogs = await readMockBlogs();
  const index = blogs.findIndex((blog: any) => blog.slug === slug);
  
  if (index === -1) {
    return null;
  }

  const updatedBlog = { ...blogs[index], ...data };
  blogs[index] = updatedBlog;
  
  const success = await writeMockBlogs(blogs);
  return success ? updatedBlog : null;
}

export async function createMockBlog(data: any) {
  const blogs = await readMockBlogs();
  const newBlog = {
    ...data,
    id: String(blogs.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  blogs.push(newBlog);
  const success = await writeMockBlogs(blogs);
  return success ? newBlog : null;
}

export async function deleteMockBlog(slug: string) {
  const blogs = await readMockBlogs();
  const filteredBlogs = blogs.filter((blog: any) => blog.slug !== slug);
  
  if (filteredBlogs.length === blogs.length) {
    return false;
  }
  
  return await writeMockBlogs(filteredBlogs);
}

export async function getMockBlogBySlug(slug: string) {
  const blogs = await readMockBlogs();
  return blogs.find((blog: any) => blog.slug === slug) || null;
}

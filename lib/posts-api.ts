import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMetadata {
  title: string;
  description: string;
  type: string;
  category?: string;
  publishDate: string;
  author?: string;
  readTime?: string;
  coverImage?: string;
  tags?: string[];
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...(data as PostMetadata),
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          ...(data as PostMetadata),
        };
      });

    return allPostsData.sort((a, b) => {
      if (a.publishDate < b.publishDate) {
        return 1;
      } else {
        return -1;
      }
    }) as Post[];
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

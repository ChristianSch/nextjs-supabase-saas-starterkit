import fs from 'fs';
import path from 'path';
import { join } from 'path';

const postsDirectory = path.join(process.cwd(), 'app/posts');

interface PostData {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith('.mdx'))
      .map(async (fileName): Promise<PostData> => {
        const slug = fileName.replace(/\.mdx$/, '');
        const { metadata } = await import(`../app/posts/${fileName}`);

        return {
          slug,
          ...(metadata as Omit<PostData, 'slug'>)
        };
      })
  );

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}

export async function getPostData(
  slug: string
): Promise<PostData & { content: React.ReactNode }> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error('Post not found');
  }

  const { metadata, default: content } = await import(
    `../app/posts/${slug}.mdx`
  );

  return {
    slug,
    content,
    ...(metadata as Omit<PostData, 'slug'>)
  };
}

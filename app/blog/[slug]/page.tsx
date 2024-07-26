import { notFound } from 'next/navigation';
import {
  getAllPostSlugs,
  getPostData,
  type PostData
} from '../../../lib/posts';
import { Metadata } from 'next';
import { ReactNode } from 'react';
import { MDXContent } from 'mdx/types';

export async function generateStaticParams() {
  const paths = await getAllPostSlugs();
  return paths.map((slug) => ({ slug }));
}

// Add this function to generate metadata
export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  let postData: PostData;

  try {
    postData = await getPostData(slug);
  } catch (error) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: postData.title,
    description: postData.description,
    openGraph: {
      title: postData.title,
      description: postData.description,
      type: 'article'
    }
  };
}

export default async function Post({
  params
}: {
  params: { slug: string };
}): Promise<ReactNode> {
  const { slug } = params;

  let postData: PostData & { content: MDXContent };
  try {
    postData = await getPostData(slug);
  } catch (error) {
    notFound();
  }

  const Mdx = postData.content;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 blog-post">
      <h1 className="text-4xl font-bold mb-8 text-center">{postData.title}</h1>
      <Mdx />
    </article>
  );
}

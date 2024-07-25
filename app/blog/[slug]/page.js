import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostData } from '../../../lib/posts';

export async function generateStaticParams() {
  const paths = await getAllPostSlugs();
  return paths.map((slug) => ({ slug }));
}

export default async function Post({ params }) {
  const { slug } = params;

  let postData;
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

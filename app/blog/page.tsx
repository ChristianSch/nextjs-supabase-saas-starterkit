import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default async function Blog() {
  const allPostsData = await getSortedPostsData();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allPostsData.map(
          ({ slug, date, title, author, description, tags }) => (
            <Link
              href={`/blog/${slug}`}
              key={slug}
              className="dark:bg-white/15  shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="dark:bg-white/10 bg-black/10	 text-foreground text-xs font-semibold px-2 py-1 rounded-full mr-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold mb-2 text-foreground">
                  {title}
                </h2>
                <p className="text-sm text-foreground/70 mb-4">
                  By {author} • {date}
                </p>
                <p className="text-foreground mb-4">{description}</p>
                <span className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                  Read more →
                </span>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

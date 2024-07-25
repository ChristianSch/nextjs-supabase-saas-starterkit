import LogoCloud from '@/components/ui/LogoCloud';
import { createClient } from '@/utils/supabase/server';

export default async function PricingPage() {
  const supabase = createClient();

  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">
        NextJS SaaS Template
      </h1>

      <p className="text-xl mb-12 text-center text-gray-600 dark:text-gray-300">
        This is a free SaaS template using Nextjs and Supabase. It provides a
        fully functional authentication implementation powered by Supabase. It
        also includes a blog feature using MDX for content management. The
        template is fully responsive and includes a dark mode toggle.
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-center">Features</h2>

      <LogoCloud />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Core Technologies</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Next.js</li>
            <li>Tailwind CSS 3</li>
            <li>shadcn/UI for reusable components</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Backend & Auth</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Database, Auth & Backend via Supabase</li>
            <li>PKCE flows (forgot password, email verification)</li>
            <li>supabase/ssr integration</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Payments</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Subscriptions via Stripe</li>
            <li>
              Webhook callbacks implemented for any price, product or customer
              subscription updates
            </li>
            <li>
              Full{' '}
              <a href="/blog/hello-world" className="text-blue-400">
                price table
              </a>{' '}
              table implemented
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Content Management</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Blog powered by MDX</li>
            <li>Use any component and Github-flavoured markdown</li>
            <li>
              <a href="/blog/hello-world" className="text-blue-400">
                Read more
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Theming</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Dark mode toggle support</li>
            <li>Powered by next-themes</li>
            <li>Customizable color schemes</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

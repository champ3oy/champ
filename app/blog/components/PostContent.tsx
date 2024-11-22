// src/components/PostContent.tsx
import { MDXRemote } from "next-mdx-remote";
import { format } from "date-fns";
import type { Post } from "@/lib/posts";

const components = {
  h1: (props: any) => <h1 className="mb-8 text-4xl font-bold" {...props} />,
  h2: (props: any) => (
    <h2 className="mt-12 mb-4 text-3xl font-bold" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-6 leading-relaxed text-gray-300" {...props} />
  ),
  ul: (props: any) => <ul className="mb-6 ml-6 list-disc" {...props} />,
  ol: (props: any) => <ol className="mb-6 ml-6 list-decimal" {...props} />,
  li: (props: any) => <li className="mb-2" {...props} />,
  code: (props: any) => (
    <code className="px-2 py-1 bg-gray-800 rounded" {...props} />
  ),
  pre: (props: any) => (
    <pre className="p-4 mb-6 overflow-x-auto bg-gray-800 rounded" {...props} />
  ),
};

export function PostContent({ post, content }: { post: Post; content: any }) {
  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-12">
        {!post.archived && (
          <>
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <time className="text-gray-400">
              {format(new Date(post.date), "MMMM dd, yyyy")}
            </time>
            <div className="flex gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </header>
      <div className="prose max-w-none">
        <MDXRemote {...content} components={components} />
      </div>
    </article>
  );
}

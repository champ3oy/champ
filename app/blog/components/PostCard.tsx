import Link from "next/link";
import { format } from "date-fns";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-2xl font-bold hover:text-cyan-600">{post.title}</h2>
      </Link>

      <div className="mb-4 flex gap-3 items-center">
        <span className="text-gray-400">{">"}</span>{" "}
        <time className="text-gray-400 text-xs">
          {format(new Date(post.date), "MMMM dd, yyyy")}
        </time>
        <div className="flex gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs text-lime-400">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-gray-300">{post.excerpt}</p>
    </article>
  );
}

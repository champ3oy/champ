// src/app/blog/page.tsx
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "./components/PostCard";
import Link from "next/link";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Courier_New'] text-sm px-5 md:px-40 2xl:px-[25%]">
      <div className="space-y-1 mb-8 mt-10">
        <div className="flex">
          <span className="text-lime-400">cirlorm@dev</span>
          <span className="text-white">
            :<span className="text-pink-500">~</span>
            <span className="text-cyan-500">$</span>{" "}
          </span>
          <span className="ml-1">cd desktop/blog</span>
        </div>
        <div className="flex">
          <span className="text-lime-400">cirlorm@dev</span>
          <span className="text-white">
            :<span className="text-pink-500">~</span>
            <span className="text-cyan-500">$</span>{" "}
          </span>
          <span className="ml-1">cat cirlorm.txt</span>
        </div>
      </div>

      <Link href="/" className=" cursor-pointer">
        [go back]
      </Link>

      <main className="mt-5">
        <h1 className="mb-5 text-4xl font-bold">Blog</h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}

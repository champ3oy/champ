import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: any) {
  const post = await getPostBySlug(params?.slug);

  if (!post) {
    notFound();
  }

  // Import the MDX file directly
  const PostContent = (await import(`@/posts/${params?.slug}.mdx`)).default;

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
      <Link href="/blog" className=" cursor-pointer">
        [go back]
      </Link>
      <main className="mt-5">
        <article className="">
          <header className="mb-12">
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <time className="text-gray-400">
              {format(new Date(post.date), "MMMM dd, yyyy")}
            </time>
            <div className="flex gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="text-lime-400 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </header>
          <div className="prose max-w-none">
            <PostContent />
          </div>
        </article>
      </main>
    </div>
  );
}

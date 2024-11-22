// mdx-components.tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mb-8 text-2xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 text-xl font-bold text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-4 text-lg font-bold text-white">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-6 leading-relaxed text-gray-300">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc text-gray-300">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-6 ml-6 list-decimal text-gray-300">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-2 text-gray-300">{children}</li>,
    code: ({ children }) => (
      <code className="px-2 py-1 bg-gray-800 rounded text-pink-400">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="p-4 mb-6 overflow-x-auto bg-gray-800 rounded text-gray-300">
        {children}
      </pre>
    ),
    a: ({ children, href }) => (
      <a href={href} className="text-cyan-500 hover:underline">
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pl-4 border-l-4 border-lime-400 text-gray-400">
        {children}
      </blockquote>
    ),
    ...components,
  };
}

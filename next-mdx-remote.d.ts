// next-mdx-remote.d.ts
declare module "next-mdx-remote" {
  import { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";
  export function MDXRemote(props: {
    source: MDXRemoteSerializeResult;
    components?: any;
  }): JSX.Element;
}

declare module "next-mdx-remote/serialize" {
  import { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";
  export function serialize(
    source: string,
    options?: any
  ): Promise<MDXRemoteSerializeResult>;
}

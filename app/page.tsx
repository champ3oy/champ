import FunTerminal from "@/components/terminal";
import { LinkedinIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const TerminalPortfolio = () => {
  const socialLinks = [
    {
      platform: "X",
      username: "@smoke_csa",
      url: "https://x.com/smoke_csa",
    },
    // {
    //   platform: "LinkedIn",
    //   username: "in/cirlormx",
    //   url: "https://www.linkedin.com/in/cirlormx",
    // },
    // {
    //   platform: "dev.to",
    //   username: "cirlormx",
    //   url: "https://dev.to/cirlormx",
    // },
  ];

  const tableWidth = 30;
  const platformWidth = 12;
  const dividerLine =
    "+" +
    "-".repeat(platformWidth) +
    "+" +
    "-".repeat(tableWidth - platformWidth - 2) +
    "+";

  return (
    <div className="min-h-screen bg-black text-white p-8 font-['Courier_New'] text-sm px-5 md:px-44 2xl:px-[25%]">
      <div className="space-y-1 mb-12 mt-10">
        <div className="flex">
          <span className="text-lime-400">nsowah@dev</span>
          <span className="text-white">
            :<span className="text-pink-500">~</span>
            <span className="text-cyan-500">$</span>{" "}
          </span>
          <span className="ml-1">cd desktop/portfolio</span>
        </div>
        <div className="flex">
          <span className="text-lime-400">nsowah@dev</span>
          <span className="text-white">
            :<span className="text-pink-500">~</span>
            <span className="text-cyan-500">$</span>{" "}
          </span>
          <span className="ml-1">cat nsowah.txt</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Nsowah Alexander</h1>
          <h2 className="text-sm">Software Engineer (Full Stack)</h2>
        </div>

        <div className="flex items-center space-x-1">
          <span className="text-gray-400">&gt;</span>
          <a
            href="https://github.com/recklessbud"
            className="text-cyan-400 hover:underline"
          >
            Github
          </a>
          <span className="text-gray-400">&gt;</span>
          <a href="/blog" className="text-cyan-400 hover:underline">
            Blogs
          </a>
          <span className="text-gray-400">&gt;</span>
          <a href="/resume.pdf" className="text-cyan-400 hover:underline">
            Resume
          </a>
        </div>

        <div className="space-y-8">
          <p>
            Building apps for web, mobile and server. I aim to build software
            that is functional and scalable.
            <br />I am a <span className="text-orange-500">Python</span>{" "}
            enthusiast and I have some experience in{" "}
            <span className="text-orange-500">Typescript</span> and have worked
            with <span className="text-orange-500">C#</span> in the past.
            <br />I am currently learning about Asynchronous Processing,
            Background Jobs and cloud infastructures (AWS).
          </p>
        </div>

        <div className="space-y-1">
          <p>
            Currently building with{" "}
            <span className="text-lime-400">Typescript</span> &{" "}
            <span className="text-lime-400">Python</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-2xl">
          <h2 className="font-bold mb-1">Experiences</h2>
          <span role="img" aria-label="experiences">
            👨‍💻
          </span>
        </div>

        <div className="">
          <div>
            <div className="flex">
              <span className="text-lime-400">nsowah@dev</span>
              <span className="text-white">
                :<span className="text-pink-500">~</span>
                <span className="text-cyan-500">$</span>{" "}
              </span>
              <span className="ml-1">cd desktop/experience</span>
            </div>
          </div>

          {/* Workspace Info Box */}
          <div className="border border-gray-600 rounded mt-4 p-4 px-8">
            <div className="bg- text-white px-0 py-0.5 inline-block">
              <span className="text-lime-400">{">"}</span> Software Engineer{" "}
              <span className="text-orange-500">@</span>{" "}
              <span className="text-lime-400">Black Star Group</span>
            </div>

            <div className="grid grid-cols-[80px_1fr] gap-y-1 pl-4 text-white/50">
              <span>Period</span>
              <span>Current</span>
            </div>
            {/* <div className="bg- text-white px-0 py-0.5 inline-block">
              Previously worked at{" "}
              <span className="text-orange-500">@PowerShop Inc</span> {", "}
              <span className="text-orange-500">@BB.Social Inc</span>
            </div> */}
          </div>

          <div className="mt-20 flex flex-col w-full">
            <pre
              className={`font-mono text-left whitespace-pre select-none scale-75 md:scale-100`}
              style={{ lineHeight: "1.2" }}
            >
              {blockStyle}
            </pre>
            <div className="flex flex-col md:flex-row justify-between w-full items-start">
              <div className="mt-5">
                <div className="text-zinc-500 ">made in Ghana ❣️🇬🇭</div>
                <div className="text-zinc-500 flex gap-4 mt-2">
                  <Link href="https://x.com/smoke_csa">
                    <TwitterIcon size={19} />
                  </Link>
                  <Link href="www.linkedin.com/in/cirlormx">
                    <LinkedinIcon size={19} />
                  </Link>
                </div>

                <div className="mt-4 text-xs text-gray-500 border-t border-gray-800 pt-4 flex justify-between items-center">
                  <span>[Runtime: fun.os v1.0.0]</span>
                  <span className="animate-pulse">
                    ⚡ System Status: Having Fun
                  </span>
                </div>
              </div>

              <div className="mt-5 mb-20">
                <FunTerminal />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPortfolio;

const blockStyle = `
`;

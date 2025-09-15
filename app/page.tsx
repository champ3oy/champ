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

        <div className='flex flex-col w-full md:max-w-md mx-auto pt-36 px-8 md:px-0 pt-36 '>
          <h1 className='text-5xl font-bold runde-bold text-black'>
            I design and build products that are useful and beautiful.
          </h1>
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

          <div className='space-y-12'>
            {experience.map((item, index) => (
              <ExperienceCard key={index} {...item} />
            ))}
          </div>
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

          <div className='space-y-12'>
            {featuredOpenSource.map((item, index) => (
              <OpenSourceCard key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='flex flex-col w-full md:max-w-md mx-auto pt-36 px-8 md:px-0 pt-36 pb-20'>
          <p className='text-xl runde-medium text-black/70'>Contact</p>
          <h2 className='text-5xl font-bold runde-bold text-black mb-4'>Get in touch</h2>

          <div className='flex flex-row gap-4 mt-1'>
            <Button>Resume</Button>
            <ContactButton />
          </div>

          <div className='flex flex-row gap-4 mt-10 items-center'>
            <p className='text-xl runde-medium text-black/70'>Socials</p>
            <div className='flex flex-row'>
              <SocialIcon href="https://linkedin.com/in/cirlormx">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-black/70">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://twitter.com/cirlormx">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-black/70">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://github.com/champ3oy">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-black/70">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          <div className='flex flex-row gap-4 mt-10'>
            {/* copyright */}
            <p className='text-sm runde-medium text-black/70'>© 2025 cirlorm.dev. All rights reserved.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TerminalPortfolio;

const blockStyle = `
`;

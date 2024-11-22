"use client";

import React, { useState, useEffect } from "react";

const FunTerminal = () => {
  const [text, setText] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const commands = [
    {
      cmd: "initiate --system matrix",
      response: `Wake up, Neo...
The Matrix has you...
Follow the white rabbit.
Knock, knock, Neo.`,
    },
    {
      cmd: "npm install coffee",
      response: `⚠️  Warning: Caffeine levels low
☕ Installing coffee...
🚀 Productivity increased by 150%
🎉 Success! Coffee installed globally`,
    },
    {
      cmd: "sudo get motivation",
      response: `Permission granted! 💪
Loading daily motivation...
======================
"You got this!"
"Keep coding awesome things!"
"Debug like a boss!"`,
    },
    {
      cmd: "generate random_excuse --dev",
      response: `🎲 Generating developer excuse...
→ "It works on my machine!"
→ "That's not a bug, it's a feature!"
→ "The code is self-documenting"`,
    },
    {
      cmd: "start happiness.exe",
      response: `Loading happiness module...
▓▓▓▓▓▓▓▓▓▓ 100%
🎵 Playing happy tunes
🌈 Releasing endorphins
🎨 Adding colors to life
✨ Happiness.exe is running successfully`,
    },
    {
      cmd: "compile universe.cpp",
      response: `🌌 Initializing universe compiler...
🌍 Earth.json loaded
⭐ Stars.config initialized
🚀 Space-time continuum verified
Error: Universe too complex to compile
Please try again in 14 billion years`,
    },
  ];

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    const currentCommand = commands[commandIndex];
    const fullText = currentCommand.cmd + "\n" + currentCommand.response;

    const typingInterval = setInterval(
      () => {
        if (!isDeleting) {
          if (charIndex < fullText.length) {
            setText((prev) => prev + fullText[charIndex]);
            setCharIndex((prev) => prev + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (charIndex > 0) {
            setText((prev) => prev.slice(0, -1));
            setCharIndex((prev) => prev - 1);
          } else {
            setIsDeleting(false);
            setCommandIndex((prev) => (prev + 1) % commands.length);
          }
        }
      },
      isDeleting ? 20 : 50
    );

    return () => clearInterval(typingInterval);
  }, [charIndex, isDeleting, commandIndex]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-black text-green-500 font-mono">
        {/* Terminal Content */}
        <div className="min-h-[300px] overflow-auto">
          <pre className="whitespace-pre-wrap break-words">
            visitor@terminal:~$ {text}
            {cursorVisible ? "▊" : " "}
          </pre>
        </div>

        {/* Terminal Footer */}
      </div>
    </div>
  );
};

export default FunTerminal;

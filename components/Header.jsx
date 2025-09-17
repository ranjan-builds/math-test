import { Github, Sigma } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <header className=" border-b text-white p-3 px-6 flex items-center fixed top-0 left-0 w-full justify-between">
      <div className="flex items-center">
        <Sigma />
        <h1 className="text-xl font-semibold">Math Trainer</h1>
      </div>
      <a
        href="https://github.com/ranjan-builds"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-400"
      >
        <Github size={24} />
      </a>
    </header>
  );
};

export default Header;

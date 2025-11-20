import { useEffect, useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";

interface ProjectCardProps {
  href: string;
  title: string;
  description: string;
  display: any;
  tags: string[];
}

export function ProjectCard({ href, title, description, display, tags }: ProjectCardProps) {
  const [darkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  return (
    <div className="max-w-sm  overflow-hidden border border-midnight dark:border-white">
      <div className="h-[30dvh] md:w-full mx-auto">
        {display}
      </div>
      <div className="px-6 py-4 border-t border-t-midnight dark:border-t-white">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="mb-2 text-base font-medium text-gray-700 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="px-6 pb-2">
        {tags.map((text, i) => (
          <span
            key={i}
            className="inline-block border border-midnight dark:border-white px-3 py-1 text-sm font-semibold text-midnight dark:text-white mr-2 mb-2"
          >
            {text}
          </span>
        ))}
      </div>
      <div className="px-6 pt-4 pb-5">
        <a className="my-1 " href={href} target="_blank">
          <div className="flex ">
            <div className="flex-initial border-b border-b-midnight dark:border-b-white">
              <span>Check it out</span>
            </div>
            <div className="flex-initial pt-0.75 border-b border-b-midnight dark:border-b-white">
              <MdOutlineArrowOutward />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

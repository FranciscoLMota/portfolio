import { useState } from "react";
import { NavLink } from "../features/NavLink";
import { HiMiniMoon, HiMiniSun  } from "react-icons/hi2";

interface navProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Navbar({ darkMode, setDarkMode} : navProps) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navlinks = [
    { href: "hero", text: "[H]ome" },
    { href: "about", text: "[A]bout" },
    { href: "experience", text: "[E]xperience" },
    { href: "projects", text: "[P]rojects" },
    { href: "contact", text: "[C]ontact" }
  ];


  

  return (
    <>
      <nav className="sticky top-0 bg-eggshell/30 z-55 dark:bg-midnight/30 backdrop-blur-sm border-b-1 border-midnight dark:border-eggshell transition-colors duration-500  ">
        <div className="flex flex-wrap place-items-center overflow-hidden ">
          <section className="relative ">
            <nav className="flex justify-between text-midnight dark:text-eggshell w-screen">
              <div className="px-5 xl:px-12 py-6 flex w-full items-center">
                <a
                  className="text-xl font-bold font-heading transition-colors duration-500 hover:bg-water hover:text-eggshell dark:hover:bg-bee dark:hover:text-midnight px-3"
                  href="#"
                >
                  Francisco L. Mota
                </a>
                <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12"></ul>

                <ul className="hidden xl:flex space-x-3 items-center text-sm">
                {navlinks.map(({ href, text }) => (
                  <li key={href}>
                    <NavLink 
                      href={href} 
                      linkText={text} 

                    />
                  </li>
                ))}
                  <li className="">
                    {darkMode ?  <HiMiniMoon  onClick={() => setDarkMode(!darkMode)} size={20} /> : <HiMiniSun  onClick={() => setDarkMode(!darkMode)} size={20}/> }
                  </li>
                </ul>
              </div>

              <a className="xl:hidden flex mr-6 items-center" href="#"></a>
              <a
                className="navbar-burger self-center mr-12 xl:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:bg-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </a>
            </nav>
          </section>
        </div>
      </nav>

      <div className={`xl:hidden fixed top-19 left-0 w-full h-screen z-50 bg-eggshell dark:bg-midnight transform ${isMenuOpen ? "translate-x-50" : "translate-x-full"} transition-transform duration-300 ease-in-out p-5 z-40 text-midnight dark:text-eggshell ` }>
        <ul className="space-y-5 text-sm mt-5 ">
        {navlinks.map(({ href, text }) => (
                  <li key={href}>
                    <NavLink 
                      href={href} 
                      linkText={text} 

                    />
                  </li>
                ))}
          <li>    {darkMode ?  <HiMiniMoon  onClick={() => setDarkMode(!darkMode)} size={20} /> : <HiMiniSun  onClick={() => setDarkMode(!darkMode)} size={20}/> }</li>
        </ul>
      </div>
    </>
  );
}

interface LinkProps {
  href: string;
  linkText: string;
}
import { useEffect, useState } from "react";
export function NavLink({ href, linkText }: LinkProps) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleScroll = (event, sectionId: string) => {
    event.preventDefault(); // Prevent the default jump

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "about", "projects", "contact"];

    const handleScroll = () => {
      let currentSection = "hero";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <a
        className={`hover:bg-bee hover:text-midnight px-2 transition-all duration-500 ${
          activeSection === href
            ? "bg-midnight text-eggshell dark:bg-eggshell dark:text-midnight "
            : ""
        }`}
        onClick={(e) => handleScroll(e, href)}
      >
        {linkText}
      </a>
    </>
  );
}

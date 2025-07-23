import { useEffect, useState } from "react";

interface LinkProps {
  href: string;
  linkText: string;
}

export function NavLink({ href, linkText }: LinkProps) {
  const [darkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [activeSection, setActiveSection] = useState("hero");

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

  // Smooth scroll handler
  const handleScroll = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // IntersectionObserver for active section
  useEffect(() => {
    const sectionElements = document.querySelectorAll("section[id]");
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id) {
            setActiveSection(id);
          }
        }
      });
    }, observerOptions);

    sectionElements.forEach((section) => observer.observe(section));

    return () => {
      sectionElements.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <a
      href={`#${href}`}
      onClick={(e) => handleScroll(e, href)}
      className={`hover:bg-bee hover:text-midnight px-2 transition-all duration-500 ${
        activeSection === href
          ? "bg-midnight text-eggshell dark:bg-eggshell dark:text-midnight"
          : ""
      }`}
    >
      {linkText}
    </a>
  );
}

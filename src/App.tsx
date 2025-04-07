import "./App.css";
import { useEffect, useState } from "react";
//Features
import { KeyboardNavigation } from "./components/features/KeyboardNavigation";

//Sections
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";

function App() {
  // const [count, setCount] = useState(0)
  const shortcuts = [
    { key: "h", section: "hero" },
    { key: "a", section: "about" },
    { key: "p", section: "projects" },
    { key: "c", section: "contact" },
  ];

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

  return (
    <>
      <KeyboardNavigation shortcuts={shortcuts} />
      <div className="bg-eggshell dark:bg-midnight transition-all duration-500 font-jet">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Hero />
        <About />
        <Projects />
        <Contact darkMode={darkMode} />
      </div>
    </>
  );
}

export default App;

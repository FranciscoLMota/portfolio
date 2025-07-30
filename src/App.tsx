import "./App.css";
import { useEffect, useState } from "react";
//Features
import { KeyboardNavigation } from "./components/features/KeyboardNavigation";
//Sections
import { FontLoader } from "./components/lib/three/loaders/FontLoader";
import { Font } from "three/examples/jsm/Addons.js";
import { Navbar } from "./components/sections/Navbar";
import { About } from "./components/sections/About";
import { Stack } from "./components/sections/Stack";
import { Contact } from "./components/sections/Contact";
import { FallingText } from "./components/threejs/FallingText";
import { Experience } from "./components/sections/Experience";

function App() {
  // const [count, setCount] = useState(0)
  const shortcuts = [
    { key: "h", section: "hero" },
    { key: "a", section: "about" },
    { key: "e", section: "experience" },
    { key: "s", section: "stack" },
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

  const [font, setFont] = useState<Font | null>(null);

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "/src/fonts/NippoVariable_Bold.json",
      (loadedFont) => {
        setFont(loadedFont);
      }
    );
  }, []);

  return (
    <>
      <KeyboardNavigation shortcuts={shortcuts} />
      <div className="bg-eggshell dark:bg-midnight transition-all duration-500 font-jet">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <FallingText darkMode={darkMode} font={font!} />
        <About darkMode={darkMode} font={font!} />
        <Experience darkMode={darkMode} />
        <Stack darkMode={darkMode} />
        <Contact darkMode={darkMode} />

      </div>
    </>
  );
}

export default App;

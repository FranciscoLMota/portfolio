import { useEffect } from "react";

export function KeyboardNavigation({ shortcuts }) {
    useEffect(() => {
        const handleKeyPress = (event) => {
          const shortcut = shortcuts.find(s => s.key.toLowerCase() === event.key.toLowerCase());
          if (shortcut) {
            const section = document.getElementById(shortcut.section);
            if (section) {
              section.scrollIntoView({ behavior: "smooth" });
            }
          }
        };
    
        document.addEventListener("keydown", handleKeyPress);
        
        return () => {
          document.removeEventListener("keydown", handleKeyPress);
        };
      }, [shortcuts]);

   return null;
}

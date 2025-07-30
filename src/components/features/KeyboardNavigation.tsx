import { useEffect } from "react";

type KeyboardNavigationProps = {
  shortcuts: any[]; // Replace `any` with a proper type if known
};

export function KeyboardNavigation({ shortcuts }: KeyboardNavigationProps) {
    useEffect(() => {
        const handleKeyPress = (event: any) => {
          const shortcut = shortcuts.find(s => s.key.toLowerCase() === event.key.toLowerCase());
          if (shortcut) {
            const section = document.getElementById(shortcut.section);
            if (section) {
              console.log(section.clientHeight)
              if(section.clientHeight < 1000) {
                console.log("smaller")
                section.scrollIntoView({ behavior: "smooth", block: "center" });
                
              } else {
                 console.log("bigger")
                section.scrollIntoView({ behavior: "smooth", block: "start" });
                
              }
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

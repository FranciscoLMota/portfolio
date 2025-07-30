import { useState } from "react";

import { Boxes } from "../threejs/boxes";

interface StackProps {
  darkMode: boolean;
}

export function Stack({ darkMode }: StackProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  const accordionData = [
    {
      category: "Frontend",
      stacks: [
        { name: "HTML" },
        { name: "CSS", frameworks: ["Tailwind", "Bootstrap"] },
        { name: "JavaScript", frameworks: ["React", "TypeScript"] },
      ]
    },
    {
      category: "Backend",
      stacks: [
        { name: "PHP", frameworks: ["Laravel", "Yii", "CodeIgniter", "Wordpress"] },
        { name: "Python", frameworks: ["Flask"] },
        { name: "SQL" },
        { name: "API Development" },
      ]
    },
    {
      category: "Design",
      stacks: [
        { name: "UI/UX Design " },
        { name: "Figma" },
        { name: "Adobe Photoshop" },
        { name: "Adobe Illustrator" },
      ]
    },
  ];

  return (
    <section
      id="stack"
      className="text-midnight dark:text-eggshell transition-colors duration-500 mt-10 py-5 md:py-15 px-5"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-[50dvh] md:w-1/3 order-2 sticky top-24">
          <Boxes darkMode={darkMode} />
        </div>
        <div className="w-full md:w-2/3 mx-auto px-4 sm:px-6 md:px-8 pt-5 order-1">
          <h1 className="flex-initial max-w-4xl text-5xl font-medium tracking-tight my-3 hover:bg-water hover:text-eggshell dark:hover:bg-bee dark:hover:text-midnight">
            Stacks
          </h1>
          <span className="text-md">
            In my career I got the opportunity to work with several technologies, stacks and frameworks, so I compiled a small list of the ones I worked the most in and content I was proud to have learned and have worked with
          </span>

          {accordionData.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className="border-b border-midnight dark:border-eggshell transition-all duration-500"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center py-5 "
                >
                  <span className="text-xl"><span >/</span> {item.category}</span>
                  <span className="text-md transition-transform duration-500">
                    {isOpen ? (
                      // Minus icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
                      </svg>
                    ) : (
                      // Plus icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
                      </svg>
                    )}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-100" : "max-h-0"
                    }`}
                >
                  <div className="pb-5 text-md text-gray-700 dark:text-gray-100">
                    {item.stacks.map(({ name, frameworks }) => (
                      <li className="list-none" key={name}>
                        |- {name}
                        {frameworks && frameworks.length > 0 && (
                          <ul className="pl-6 text-gray-500 dark:text-gray-400">
                            {frameworks.map((fw) => (
                              <li className="list-none" key={fw}>
                                |- {fw}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

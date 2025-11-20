import { ProjectCard } from "../features/ProjectCard";
import { Pomo } from "../threejs/Pomo";


export function Project() {

  const projects = [
    {
      title: "Pomo",
      description: "A React-based Pomodoro application for time management with a strong brand identity.",
      href: "https://pomo.franciscolmota.com/",
      display: <Pomo />,
      tags: ['react', 'typescript', 'productivity']
    },

  ]


  return (
    <>
      <section
        id="project"
        className="text-midnight dark:text-eggshell transition-colors duration-500 px-5"
      >
        <div className="flex flex-col md:flex-row ">
          <div className="md:w-3/3 md:h-[15dvh] mx-auto px-4 sm:px-6 md:px-8 pt-5 order-1 mb-15">
            <h1 className="flex-initial text-5xl font-medium tracking-tight my-3 hover:bg-water hover:text-eggshell dark:hover:bg-bee dark:hover:text-midnight">
              Projects
            </h1>
            <span className="text-md">
              Here are some projects I've been working on lately, mostly focused on react right now and exploring UX. I'm looking to update this section more often.
            </span>
          </div>

        </div>

        <div className="grid gap-5 px-4 sm:px-6 md:px-8 pt-5 order-1 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:h-auto">
          {projects.map(({ title, description, href, display, tags }) => (

            <ProjectCard
              title={title}
              description={description}
              href={href}
              display={display}
              tags={tags}
            />

          ))}
        </div>

      </section>
    </>
  );
}

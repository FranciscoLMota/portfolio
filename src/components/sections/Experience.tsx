
import { Sphere } from "../threejs/Sphere";
import { SlBadge, SlGraduation, SlScreenDesktop } from "react-icons/sl";

import { MdOutlineArrowOutward } from "react-icons/md";

interface experienceProps {
  darkMode: boolean;
}

export function Experience({ darkMode }: experienceProps) {
  const exp = [
    {
      date: "May 2025 - December 2026",
      title: "Computer Programming",
      type: "education",
      location: "Sault College",
      href: "https://www.saultcollege.ca/programs/information-technology-studies/computer-programming",
      summary: "Currently wrapping up the first semester of a Computer Programming program, where I've been building a solid foundation in programming, computing environments, networks, and computer math. The full program covers everything from web and mobile development to databases, cloud computing, and project management. Looking forward to applying what I learn in hands-on projects and growing my skills each semester."
    },
    {
      date: "April 2023",
      title: "UX Design Certification",
      type: "certification",
      location: "Tera Courses",
      href: "/public/pdfs/UX_Certificate.pdf",
      summary: "Completed a course on UI/UX design focused on design thinking, research and design in order to improve my design skills and learn more about prototyping tools such as Figma and brand roadmapping."
    },
    {
      date: "September 2021 - March 2025",
      title: "FullStack Developer",
      type: "job",
      location: "IbacBrasil - Educational Technology",
      href: "https://www.linkedin.com/company/22118772/",
      summary: "Worked with a cross-functional team building and maintaining web apps using PHP and Laravel, integrating APIs for smoother system communication, debugging issues to keep things running smoothly, and prototyping features for distance education tools. Followed Agile practices to develop new systems from the ground up while also maintaining and updating legacy applications."
    },
    {
      date: "October 2018 - September 2021",
      title: "Junior PHP Developer",
      type: "job",
      location: "SIVS",
      href: "https://www.linkedin.com/company/sivs-certweb/",
      summary: "Handled the full lifecycle of web app development—from planning and coding to testing, deployment, and upkeep—while working closely with clients to understand their needs. Used Agile methods to manage sprints, coordinate tasks, and keep projects on track, all while troubleshooting issues to keep everything running smoothly."
    },
    {
      date: "July 2017 - October 2018 ",
      title: "Intern Developer",
      type: "job",
      location: "SIVS",
      href: "https://www.linkedin.com/company/sivs-certweb/",
      summary: "Split my time between helping users through live chat and working on new features or updates to the system. I got to learn a lot by collaborating with more experienced developers, who guided me through best practices while I contributed to both fixing issues and building out systems improvements."
    },
    {
      date: "February 2015 - December 2018",
      title: "Programming Focused Vocational and Technical High School Education",
      type: "education",
      location: "TECPUC",
      href: "https://www.linkedin.com/company/tecpuc/",
      summary: "The vocational course integrated with my high school education gave me the foundational knowledge that helped me land my very first job and lead me into the direction of developing applications in PHP and sparked my love for visual design and web development."
    }
  ];

  function icons(type) {
    switch(type) {
      case 'job':
        return <SlScreenDesktop />
      case 'education':
        return <SlGraduation />
      case 'certification': 
        return <SlBadge />
    }
  }

  return (
    <section
      id="experience"
      className="text-midnight dark:text-eggshell transition-colors duration-500 mt-10 py-15"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-[50dvh] md:w-1/3 order-2 md:order-1 sticky top-24">
          <Sphere darkMode={darkMode} />
        </div>
        <div className="w-full md:w-2/3 mx-auto px-4 sm:px-6 md:px-8 pt-5 order-1 md:order-2">

          <h1 className="flex-initial max-w-4xl text-5xl font-medium tracking-tight my-3 hover:bg-water hover:text-eggshell dark:hover:bg-bee dark:hover:text-midnight">
            EXPERIENCE
          </h1>
          <span className="text-md">
            I've been lucky enough to work in some really cool companies and study at some pretty nice places! Maybe yours will be the next one!
          </span>
          <br />
          <br />
          <ol className="relative border-s border-midnight dark:border-eggshell">
            {exp.map(({ date, title, type, location, summary, href }) => (
              <li className="mb-10 ms-4" key={title}>
                <div className="absolute w-3 h-3 bg-midnight mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-eggshell"></div>
                <time className="mb-1 text-sm font-medium leading-none text-midnight dark:text-eggshell  ">{date} </time>
                <h3 className="text-lg font-semibold hover:bg-water hover:text-eggshell dark:hover:bg-bee dark:hover:text-midnight"><span className="inline-flex items-center">{title}&nbsp;{icons(type)}  </span></h3>
                <a href={href} target="_blank" className="my-1 text-sm font-medium leading-none text-midnight dark:text-eggshell  "><span className="inline-flex items-center">{location}&nbsp;<MdOutlineArrowOutward />  </span> </a>
                <p className="mb-4 text-base font-medium text-gray-700 dark:text-gray-400">{summary}</p>
              </li>
            ))}

          </ol>
        </div>
      </div>
    </section>
  );
}






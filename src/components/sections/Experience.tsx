
import { Sphere } from "../threejs/Sphere";
import { SlGraduation } from "react-icons/sl";
import { SlScreenDesktop } from "react-icons/sl";
import { MdOutlineArrowOutward } from "react-icons/md";

interface contactProps {
  darkMode: boolean;
}

export function Experience({ darkMode }: contactProps) {
  const exp = [
    { date: "May 2025 - December 2026", title: "Computer Programming", type: "education", location: "Sault College", summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore ad quo, reiciendis assumenda est, id delectus obcaecati ducimus optio tenetur voluptas iste quibusdam dignissimos dolorem ut libero quos. Eligendi, molestias." },
    { date: "September 2021 - March 2025", title: "FullStack Developer", type: "job", location: "IbacBrasil - Educational Technology", summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore ad quo, reiciendis assumenda est, id delectus obcaecati ducimus optio tenetur voluptas iste quibusdam dignissimos dolorem ut libero quos. Eligendi, molestias." },
    { date: "October 2018 - September 2021", title: "Junior PHP Developer", type: "job", location: "SIVS", summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore ad quo, reiciendis assumenda est, id delectus obcaecati ducimus optio tenetur voluptas iste quibusdam dignissimos dolorem ut libero quos. Eligendi, molestias." },
    { date: "July 2017 - October 2018 ", title: "Intern Developer", type: "job", location: "SIVS", summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore ad quo, reiciendis assumenda est, id delectus obcaecati ducimus optio tenetur voluptas iste quibusdam dignissimos dolorem ut libero quos. Eligendi, molestias." },
    { date: "February 2015 - December 2018", title: "Programming Focused Vocational and Technical High School Education", type: "education", location: "TECPUC", summary: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore ad quo, reiciendis assumenda est, id delectus obcaecati ducimus optio tenetur voluptas iste quibusdam dignissimos dolorem ut libero quos. Eligendi, molestias." }
  ];

  return (
    <>
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
              {exp.map(({ date, title, type, location, summary }) => (
                <li className="mb-10 ms-4">
                  <div className="absolute w-3 h-3 bg-midnight mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-eggshell"></div>
                  <time className="mb-1 text-sm font-medium leading-none text-midnight dark:text-eggshell  ">{date} </time>
                  <h3 className="text-lg font-semibold hover:bg-water hover:text-eggshell dark:hover:bg-bee dark:hover:text-midnight"><span className="inline-flex items-center">{title}&nbsp;{type == "job" ? <SlScreenDesktop /> : <SlGraduation />}  </span></h3>
                  <p className="my-1 text-sm font-medium leading-none text-midnight dark:text-eggshell  "><span className="inline-flex items-center">{location}&nbsp;<MdOutlineArrowOutward />  </span> </p>
                  <p className="mb-4 text-base font-medium text-gray-500 dark:text-gray-400">{summary}</p>
                </li>
              ))}

            </ol>
          </div>
        </div>
      </section>
    </>
  );
}






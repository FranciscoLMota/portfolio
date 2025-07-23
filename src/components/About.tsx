import { Initials } from "./Initials";


interface aboutProps {
  darkMode: boolean;
  font: Font;
}
export function About({ darkMode, font }: aboutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section
        id="about"
        className="text-midnight dark:text-eggshell transition-colors duration-500 px-5"
      >
        <div className="flex flex-col md:flex-row ">
          <div className="md:w-2/3 h-[50dvh] mx-auto px-4 sm:px-6 md:px-8 pt-5 order-1 ">
            <h1 className="flex-initial max-w-4xl text-5xl font-medium tracking-tight my-3 hover:bg-bee hover:text-midnight">
              ABOUT
            </h1>
            <span className="text-md">
              Hi! I'm Francisco Mota, a FullStack Developer from Brazil, currently located in Sault Ste. Marie, ON.
            </span>
            <br />
            <br />
            <span className="text-md">
              I've been working as a Full-Stack Developer since 2017 (It's already been {currentYear - 2017} years - Oof). I like to say that I'm a Frontend Developer by passion and a Backend Developer by necessity. My goal in life is to continue to create memorable digital experiences that improve the lives of the users, be it by making their time easier or just by impressing them with a fun graphic.
            </span>

          </div>
          <div className="h-[50dvh] md:w-1/3 order-2">
            <Initials darkMode={darkMode} font={font} />
          </div>
        </div>
      </section>
    </>
  );
}

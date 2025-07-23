import { Cube } from "../threejs/Cube";
import { MdOutlineArrowOutward } from "react-icons/md";

interface contactProps {
  darkMode: boolean;
}

export function Contact({ darkMode }: contactProps) {
  return (
    <>
      <section
        id="contact"
        className="text-midnight dark:text-eggshell transition-colors duration-500 mt-10 py-15"
      >
        <div className="flex flex-col md:flex-row ">
          <div className="h-[50dvh] md:w-1/3 order-2 md:order-1">
            <Cube darkMode={darkMode} />
          </div>
          <div className="w-full md:w-2/3 h-[50dvh] mx-auto px-4 sm:px-6 md:px-8 pt-5 order-1 md:order-2 ">
            <h1 className="flex-initial max-w-4xl text-5xl font-medium tracking-tight my-3 hover:bg-bee hover:text-midnight">
              CONTACT
            </h1>
            <span className="text-md">
              If you liked my work or you're curious to know more, feel free to
              send me a message and we can chat.
            </span>
            <div className="flex flex-col mt-4 mx-auto text-md tracking-tight">
              {[
                {
                  text: "Linkedin",
                  href: "https://www.linkedin.com/in/franciscolmota",
                },
                { text: "Telegram", href: "https://t.me/FranciscoLMota" },
                { text: "Github", href: "https://github.com/FranciscoLMota" },
                { text: "Mail", href: "mailto:franciscolmota@outlook.com" },
              ].map(({ href, text }) => (
                <a key={text} className="my-1" href={href} target="_blank">
                  <div className="flex">
                    <div className="flex-initial">
                      <span>{text}</span>
                    </div>
                    <div className="flex-initial ml-0.5 pt-0.75">
                      <MdOutlineArrowOutward />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <span className="mx-auto text-sm tracking-tight inline-block  ">
            - Made with <span className="px-2 bg-bee dark:bg-midnight dark:text-bee">mixed feelings</span>  and&nbsp;
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 bg-react dark:bg-midnight dark:text-react "
            >
              React
            </a> -
            <br></br>
            Francisco Mota &copy;  {new Date().getFullYear()}
          </span>
        </div>
      </section>
    </>
  );
}

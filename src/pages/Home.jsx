import { useTranslation } from 'react-i18next';
import SplitText from "../components/SplitText/SplitText.jsx";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <h1 
        // className="text-3xl text-center whitespace-pre-line z-10 "
      >
        <SplitText
          text={t('welcome_message')}
          delay={0.1}
          splitType="chars"
          triggerOnScroll={true}
          className="text-3xl text-center whitespace-pre-line z-10 select-none"
        />
      </h1>



      {/* big username at the very bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-visible z-[5] ">
        <div
          className="
            font-black leading-none whitespace-nowrap select-none text-center w-full

            /* —— phones & tablets —— */
            text-[clamp(3rem,18vw,9rem)]    /* never wider than viewport */

            /* —— laptops / desktops —— */
            sm:text-[clamp(6rem,15vw,16rem)]

            /* solid colour on the tiniest screens */
            text-neutral-700
            /* gradient on ≥ sm */
            sm:text-transparent sm:bg-clip-text
            sm:bg-gradient-to-b sm:from-neutral-500/25 sm:to-neutral-500/0

            /* pull down only when it’s big enough to look good */
            sm:mb-[-2.5rem]
          "
        >
          Demential
        </div>
      </div>
    </div>
  );
}

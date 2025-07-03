import { useTranslation } from 'react-i18next';
export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative">
      <h1 className="text-3xl text-center whitespace-pre-line z-10">
        {t('welcome_message')}
      </h1>

      {/* giant name at the real bottom of the viewport */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden sm:block text-transparent select-none bg-clip-text font-black leading-none
                     bg-gradient-to-b from-neutral-500/10 to-neutral-500/0
                     text-[10rem] lg:text-[16rem]"
          style={{ marginBottom: '-2.5rem' }}
        >
          Demential
        </div>
      </div>
    </div>
  );
}
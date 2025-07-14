import { motion as Motion} from 'framer-motion';

export default function PageWrapper({ children }) {
  return (
    <Motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
      {children}
    </Motion.div>
    // <div className="h-full flex flex-col">
    //  {children}
    // </div>
  );
}

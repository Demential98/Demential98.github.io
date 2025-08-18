// src/AppRoutes.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import PageWrapper from './components/PageWrapper';


import Experience from './pages/Experience';

export default function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/experience" element={<PageWrapper><Experience /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}


//   return (
//     <>
//       <section className="h-screen snap-start">
//         <Home />
//       </section>
//       <section className="h-screen snap-start">
//         <About />
//       </section>
//       {/* Add more full-page sections here */}
//     </>
//   );
// }
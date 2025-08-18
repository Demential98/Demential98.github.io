import { useEffect, useRef, useState } from 'react';
import './SplitText.css';

const SplitText = ({
  text,
  className = '',
  delay = 0.05,
  triggerOnScroll = true,
}) => {
  const containerRef = useRef(null);
  const [active, setActive] = useState(!triggerOnScroll);

  useEffect(() => {
    if (!triggerOnScroll || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [triggerOnScroll]);

  const renderLetters = () => {
    const chars = Array.from(text);
    return chars.map((char, i) => {
      const isSpace = char === ' ';
      const isLineBreak = char === '\n';

      if (isLineBreak) {
        return <br key={`br-${i}`} />;
      }

      return (
        <span
          key={i}
          className={`split-text-letter${isSpace ? ' space' : ''}`}
          style={{ animationDelay: `${i * delay}s` }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <p
      ref={containerRef}
      className={`split-text-container ${active ? 'active' : ''} ${className}`}
      style={{  whiteSpace: 'pre-wrap' }}
    >
      {renderLetters()}
    </p>
  );
};

export default SplitText;

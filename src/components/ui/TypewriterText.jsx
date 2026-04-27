import React, { useState, useEffect, useRef } from 'react';

/**
 * A professional letter-by-letter typewriter reveal component.
 * @param {string} text - The text to reveal.
 * @param {number} delay - Initial delay before starting (ms).
 * @param {number} speed - Typing speed (ms per character).
 * @param {string} className - Optional styling.
 * @param {boolean} once - Should it only play once (default: true).
 */
const TypewriterText = ({ text, delay = 0, speed = 30, className = "", once = true }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasStarted)) {
          setTimeout(() => setHasStarted(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, hasStarted, once]);

  useEffect(() => {
    if (!hasStarted || isComplete) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayedText, hasStarted, isComplete, text, speed]);

  return (
    <span ref={elementRef} className={className}>
      {displayedText}
      {!isComplete && hasStarted && (
        <span className="inline-block w-[2px] h-[1em] bg-current ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

export default TypewriterText;

import { useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * @param {import('react').MutableRefObject<HTMLElement | null>} ref
 * @param {number} targetValue
 * @param {{ duration?: number; appendPlus?: boolean }} [options]
 */
const useCounter = (ref, targetValue, options = {}) => {
  const duration = typeof options === 'number' ? options : options.duration ?? 1.5;
  const appendPlus = typeof options === 'number' ? false : options.appendPlus ?? false;

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const format = (n) => {
      const v = Math.floor(n);
      if (appendPlus && targetValue > 0) return `${v}+`;
      return String(v);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = format(targetValue);
      return;
    }

    const obj = { val: 0 };

    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: targetValue,
        duration,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        onUpdate: () => {
          el.textContent = format(obj.val);
        },
      });
    }, el);

    return () => ctx.revert();
  }, [ref, targetValue, duration, appendPlus]);
};

export default useCounter;

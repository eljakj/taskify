import { useLayoutEffect, useRef, useState } from "react";

export default function ExpandableText({ text, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element || isExpanded) return;

    // ResizeObserver runs once right away and again when the width changes.
    const observer = new ResizeObserver(() => {
      setIsClamped(element.scrollHeight > element.clientHeight + 1);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [text, isExpanded]);

  return (
    <div>
      <p
        ref={textRef}
        className={`${className} ${
          isExpanded ? "max-h-60 overflow-y-auto pr-1" : "line-clamp-3"
        }`}
      >
        {text}
      </p>

      {(isClamped || isExpanded) && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          className="mt-1 cursor-pointer text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function ChevronIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`h-5 w-5 text-zinc-400 transition-transform duration-200 dark:text-slate-500 ${
        isOpen ? "rotate-180" : ""
      }`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.704 5.29a.75.75 0 0 1 .006 1.06l-8 8.091a.75.75 0 0 1-1.07.01L3.29 10.05a.75.75 0 0 1 1.06-1.06l3.81 3.809 7.47-7.554a.75.75 0 0 1 1.074.045Z"
      />
    </svg>
  );
}

export default function CustomSelect({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideWrapper = wrapperRef.current?.contains(event.target);
      const clickedInsideMenu = menuRef.current?.contains(event.target);

      if (!clickedInsideWrapper && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      const gap = 8;

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + gap,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="grid min-h-11 w-full cursor-pointer grid-cols-[1fr_auto] items-center rounded-xl border border-zinc-200 bg-white/90 px-4 py-3 text-left text-sm font-medium text-zinc-700 shadow-sm outline-none hover:border-indigo-500 focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <span className="ml-3">
          <ChevronIcon isOpen={isOpen} />
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className="z-9999 overflow-hidden rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl/30  dark:border-slate-700 dark:bg-slate-900"
          >
            <ul className="max-h-60 overflow-auto" role="listbox">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="truncate font-medium">
                        {option.label}
                      </span>

                      <span
                        className={`ml-3 ${
                          isSelected ? "text-white" : "invisible"
                        }`}
                      >
                        <CheckIcon />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}

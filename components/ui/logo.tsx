import * as React from "react";

export type LogoProps = {
  size?: number | string;
  text?: string;
  className?: string;
  textClassName?: string;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

/**
 * Logo component: Tabler donut chart icon + "CodeFlex" label with dark/light mode support.
 */
export default function Logo({
  size = 24,
  text = "CodeFlex",
  className = "",
  textClassName = "",
  gap = 3,
}: LogoProps) {
  const dimension = typeof size === "number" ? `${size}px` : size;
  const gapClass = `gap-${gap}`;

  return (
    <div
      className={`inline-flex items-center ${gapClass} ${className}`.trim()}
      aria-label={`${text} logo`}
    >
      {/* Icon with color adapting to theme */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-gray-800 dark:text-gray-100 transition-colors duration-300"
        role="img"
        aria-hidden={false}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-3.8a4.1 4.1 0 1 1 -5 -5v-4a.9 .9 0 0 0 -1 -.8" />
        <path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a9 9 0 0 0 -1 -1v-4.5" />
      </svg>

      {/* Wordmark with theme-aware color */}
      <span
        className={`font-semibold tracking-tight text-gray-800 dark:text-gray-100 transition-colors duration-300 ${textClassName}`.trim()}
      >
        {text}
      </span>
    </div>
  );
}
import React from "react";

interface NagarikdesuLogoProps {
  className?: string;
  size?: string;
}

export default function NagarikdesuLogo({ className = "", size = "w-6 h-6" }: NagarikdesuLogoProps) {
  return (
    <svg
      id="nagarikdesu-logo"
      viewBox="0 0 100 100"
      className={`${size} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Overlapping sketch star path */}
      <path
        d="M 18,76 Q 43,44 68,12 Q 65,52 62,92 Q 34,53 6,15 Q 50,28 95,42 Q 56,59 18,76"
        stroke="#FF1A43"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Loop detail at the starting knot */}
      <path
        d="M 18,76 C 12,83 6,80 9,73 C 12,66 17,70 18,76 Z"
        stroke="#FF1A43"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handdrawn extension tag at the knot */}
      <path
        d="M 11,80 C 8,83 11,87 14,84"
        stroke="#FF1A43"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

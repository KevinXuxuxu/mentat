import React from "react";

export function SolarRoundArrowUpLineDuotone(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" opacity=".5"></circle>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16V8m0 0l3 3m-3-3l-3 3"
        ></path>
      </g>
    </svg>
  );
}
export default SolarRoundArrowUpLineDuotone;

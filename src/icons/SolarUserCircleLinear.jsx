import React from "react";

export function SolarUserCircleLinear(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="9" r="3"></circle>
        <circle cx="12" cy="12" r="10"></circle>
        <path
          strokeLinecap="round"
          d="M17.97 20c-.16-2.892-1.045-5-5.97-5s-5.81 2.108-5.97 5"
        ></path>
      </g>
    </svg>
  );
}
export default SolarUserCircleLinear;

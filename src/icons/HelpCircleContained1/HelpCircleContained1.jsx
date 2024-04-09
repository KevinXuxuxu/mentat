/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";

export const HelpCircleContained1 = ({ color = "white", className }) => {
  return (
    <svg
      className={`help-circle-contained-1 ${className}`}
      fill="none"
      height="24"
      viewBox="0 0 25 24"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M12.499 16.7999V16.8421M10.1 9.04523C10.1 7.69471 11.1745 6.5999 12.5 6.5999C13.8255 6.5999 14.9 7.69471 14.9 9.04523C14.9 10.3957 13.8255 11.4906 12.5 11.4906C12.5 11.4906 12.499 12.2204 12.499 13.1208M22.1 11.9999C22.1 17.3018 17.802 21.5999 12.5 21.5999C7.19809 21.5999 2.90002 17.3018 2.90002 11.9999C2.90002 6.69797 7.19809 2.3999 12.5 2.3999C17.802 2.3999 22.1 6.69797 22.1 11.9999Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

HelpCircleContained1.propTypes = {
  color: PropTypes.string,
};

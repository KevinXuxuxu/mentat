/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { VuesaxLinearSetting2 } from "../../icons/VuesaxLinearSetting2";
import "./style.css";

export const Navbar = ({ property1, className }) => {
  return (
    <div className={`navbar ${className}`}>
      <div className="frame-6">
        <div className="frame-parameters">
          <VuesaxLinearSetting2 className="vuesax-linear" />
        </div>
        <div className="frame-account">
          <div className="text-wrapper-4">Me</div>
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

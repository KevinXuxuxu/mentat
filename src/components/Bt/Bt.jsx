/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { HelpCircleContained1 } from "../../icons/HelpCircleContained1";
import "./style.css";

export const Bt = ({ state, className, text = "Help" }) => {
  return (
    <div className={`BT state-${state} ${className}`}>
      <div className="frame-2">
        <div className="help">{text}</div>
        <HelpCircleContained1 className="help-circle" color={state === "hover-pressed" ? "white" : "#767676"} />
      </div>
    </div>
  );
};

Bt.propTypes = {
  state: PropTypes.oneOf(["hover-pressed", "default"]),
  text: PropTypes.string,
};

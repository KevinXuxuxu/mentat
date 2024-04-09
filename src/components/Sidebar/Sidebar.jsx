/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { CheckYes } from "../../icons/CheckYes";
import { Bt } from "../Bt";
import { Checkbox } from "../Checkbox";
import { ModeCard } from "../ModeCard";
import "./style.css";

export const Sidebar = ({
  property1,
  className,
  modeCardIcon = <Checkbox check={false} checkNoClassName="checkbox-instance" />,
  override = <CheckYes className="check-yes-instance" />,
  modeCardIcon1 = <Checkbox check={false} checkNoClassName="checkbox-instance" />,
  modeCardIcon2 = <Checkbox check={false} checkNoClassName="checkbox-instance" />,
  modeCardIcon3 = <CheckYes className="check-yes-instance" />,
  modeCardIcon4 = <Checkbox check={false} checkNoClassName="checkbox-instance" />,
}) => {
  return (
    <div className={`sidebar ${className}`}>
      <div className="frame-wrapper">
        <div className="frame-3">
          <div className="text-wrapper">Conversations</div>
          <div className="frame-4">
            <div className="text-wrapper-2">Today</div>
            <ModeCard
              className="mode-card-instance"
              icon={modeCardIcon}
              state="default"
              text="Topic summary"
              text1="Shot summary of conversation session..."
            />
            <ModeCard
              className="mode-card-instance"
              icon={override}
              state="hover-pressed"
              text="Topic summary"
              text1="Shot summary of conversation session..."
            />
            <ModeCard
              className="mode-card-instance"
              icon={modeCardIcon1}
              state="default"
              text="Topic summary"
              text1="Shot summary of conversation session..."
            />
          </div>
          <div className="frame-4">
            <div className="text-wrapper-2">Yesterday</div>
            <ModeCard
              className="mode-card-instance"
              icon={modeCardIcon2}
              state="default"
              text="Topic summary"
              text1="Shot summary of conversation session..."
            />
            <ModeCard
              className="mode-card-instance"
              icon={modeCardIcon3}
              state="hover-pressed"
              text="Topic summary"
              text1="Shot summary of conversation session..."
            />
            <ModeCard
              className="mode-card-instance"
              icon={modeCardIcon4}
              state="default"
              text="Topic summary"
              text1="Shot summary of conversation session..."
            />
          </div>
        </div>
      </div>
      <div className="frame-5">
        <Bt className="BT-instance" state="default" text="Export" />
        <Bt className="BT-instance" state="hover-pressed" text="Import" />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  property1: PropTypes.oneOf(["default"]),
};

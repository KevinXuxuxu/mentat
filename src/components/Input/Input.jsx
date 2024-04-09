/*
We're constantly improving the code you see. 
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import PropTypes from "prop-types";
import React from "react";
import { Attatchment012 } from "../../icons/Attatchment012";
import { Microphone014 } from "../../icons/Microphone014";
import { Stop } from "../../icons/Stop";
import "./style.css";

export const Input = ({ dscr = true, actionDescr = true, description = true, state, className, visible = true }) => {
  return (
    <div className={`input state-${state} ${className}`}>
      <div className="input-case">
        <div className="content">
          {["active", "default", "disabled", "filled", "hover"].includes(state) && (
            <Attatchment012 className="instance-node" color={state === "disabled" ? "#C4C4C4" : "#919191"} />
          )}

          {state === "generate" && (
            <div className="ellipse-wrapper">
              <img className="img" alt="Ellipse" src="https://c.animaapp.com/ashz4gW2/img/ellipse-3.svg" />
            </div>
          )}

          <div className="send-a-message">
            {["active", "default", "hover"].includes(state) && <>Send a message</>}

            {["disabled", "filled"].includes(state) && (
              <p className="text-wrapper-6">Send me prompt and request ai chat GPT</p>
            )}

            {state === "generate" && <>Generate message..</>}
          </div>
          {["active", "default", "disabled", "filled", "generate"].includes(state) && (
            <>
              <>
                {visible && (
                  <>
                    <>
                      {["active", "default", "disabled", "filled"].includes(state) && (
                        <Microphone014 className="instance-node" color={state === "disabled" ? "#C4C4C4" : "#919191"} />
                      )}
                    </>
                  </>
                )}
              </>
            </>
          )}

          {state === "generate" && <Stop className="instance-node" />}

          {state === "hover" && <Microphone014 className="instance-node" color="#919191" />}

          {["active", "default", "disabled", "filled", "hover"].includes(state) && (
            <img
              className="instance-node"
              alt="Telegram fill"
              src={
                state === "disabled"
                  ? "https://c.animaapp.com/ashz4gW2/img/telegram-fill-2.svg"
                  : "https://c.animaapp.com/ashz4gW2/img/telegram-fill-5.svg"
              }
            />
          )}
        </div>
        {state === "hover" && (
          <img className="cursor" alt="Cursor" src="https://c.animaapp.com/ashz4gW2/img/cursor.svg" />
        )}
      </div>
      {dscr && (
        <div className="dscr">
          {description && <div className="text-wrapper-3">Description</div>}

          {actionDescr && <p className="p">ESC or Click to cancel</p>}
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  dscr: PropTypes.bool,
  actionDescr: PropTypes.bool,
  description: PropTypes.bool,
  state: PropTypes.oneOf(["active", "default", "filled", "generate", "hover", "disabled"]),
  visible: PropTypes.bool,
};

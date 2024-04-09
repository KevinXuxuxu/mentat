import React from "react";
import { Checkbox } from "../../components/Checkbox";
import { Input } from "../../components/Input";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { CheckYes } from "../../icons/CheckYes";
import "./style.css";

export const Slide = () => {
  return (
    <div className="slide">
      <div className="div-2">
        <Sidebar
          className="sidebar-instance"
          modeCardIcon={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          modeCardIcon1={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          modeCardIcon2={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          modeCardIcon3={<CheckYes className="checkbox-3-instance" />}
          modeCardIcon4={<Checkbox check={false} checkNoClassName="design-component-instance-node" />}
          override={<CheckYes className="checkbox-3-instance" />}
          property1="default"
        />
        <div className="main">
          <div className="chat-history">
            <div className="section">
              <div className="section-2">
                <div className="avatar">
                  <img
                    className="unnamed"
                    alt="Unnamed"
                    src="https://c.animaapp.com/ashz4gW2/img/unnamed-932w7rr4f-transformed-1@2x.png"
                  />
                </div>
                <div className="section-3">
                  <div className="text-wrapper-5">2.03 PM, 15 Nov</div>
                  <p className="design-development">
                    Design development, UX/UI, and product design are all related terms in the field of design, but they
                    refer to slightly different aspects of the design process.
                    <br />
                    <br />
                    Design development refers...
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="prompt">
            <Input className="input-instance" description={false} state="active" visible={false} />
          </div>
        </div>
        <Navbar className="navbar-instance" property1="default" />
      </div>
    </div>
  );
};

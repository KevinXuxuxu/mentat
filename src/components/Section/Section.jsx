// import PropTypes from "prop-types";
import React from "react";
import "./style.css";


export const Section = ({ role, message }) => {
    return (
        <div className="section">
            <div className="section-2">
                <div className="avatar">
                    {role === "AI" && (
                        <img
                            className="unnamed"
                            alt="Unnamed"
                            // src="https://c.animaapp.com/50nCvDJa/img/unnamed-932w7rr4f-transformed-1@2x.png"
                            src="https://www.svgrepo.com/show/306500/openai.svg"
                        />)
                    }
                    {role === "Human" && (
                        <img
                            className="unnamed"
                            alt="Unnamed"
                            // src="https://c.animaapp.com/50nCvDJa/img/unnamed-932w7rr4f-transformed-1@2x.png"
                            src="https://www.svgrepo.com/show/532362/user.svg"
                        />)
                    }
                </div>
                <div className="section-3">
                    <div className="text-wrapper-5">2.03 PM, 15 Nov</div>
                    <p className="design-development">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

import React from "react";
import Countdown from "react-countdown";

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({days, hours, minutes, seconds, completed}) => {
  if (completed) {
    // Render a complete state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <div className="countdown">
        <div className="countdown-container days">
          <span className="countdown-value">{days}</span>
          <span className="countdown-heading">D's</span>
        </div>
        <div className="countdown-container hours">
          <span className="countdown-value">{hours}</span>
          <span className="countdown-heading">H's</span>
        </div>
        <div className="countdown-container minutes">
          <span className="countdown-value">{minutes}</span>
          <span className="countdown-heading">Min's</span>
        </div>
        <div className="countdown-container seconds">
          <span className="countdown-value">{seconds}</span>
          <span className="countdown-heading">Sec</span>
        </div>
      </div>
    );
  }
};

function Countdownnew() {
  return <Countdown date={Date.now() + 1211115000} renderer={renderer} />;
}

export default Countdownnew;

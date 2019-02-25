import React from "react";

function Error(props) {
  return (
    <div className="content home">
      <div className="error-container">
        <h1>
          <span role="img" aria-label="person bowing deeply">
            🙇
          </span>
        </h1>
        <p>{props.errorMessage}</p>
        <p>❤ ❤ ❤</p>
      </div>
    </div>
  );
}

export default Error;

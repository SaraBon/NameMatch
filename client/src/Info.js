import React from "react";

function Info(props) {
  return (
    <div className="content info">
      <div className="">
        <h3>Info</h3>
        <p>
          The development of this site started off as a playground / learning
          project in the context of my self-studies of JavaScript / React. It is
          an ongoing project and will be continually improved. Some features to
          be added Q1 2019:
        </p>
        <ul>
          <li>Selecting the gender of names</li>
          <li>Selecting the first letter of names</li>
          <li>Improved management of names & matches</li>
          <li>Mobile (PWA) & touch interaction</li>
        </ul>
        <h3>Contact</h3>
        <p>sara.bongartz@gmail.com</p>
        <p>
          GitHub{" "}
          <a
            href="https://github.com/SaraBon"
            target="_blank"
            rel="noopener noreferrer"
          >
            @SaraBon
          </a>
        </p>
      </div>
    </div>
  );
}

export default Info;

import React from "react";

function About(props) {
  return (
    <div className="content home">
      <div className="demo-text">
        <h3>Random Baby Name Generator and Match Finder</h3>
        <p>
          Find your favorite baby name from our database of 70.000 international
          names
        </p>
        <p>Easily swipe the names in the "Board" section of this app</p>
        <p>Link your account to your partner and find name matches</p>
        <ul>
          <li>Register and go to the section "Account"</li>
          <li>
            You'll find you personal code which you can share with your partner
          </li>
          <li>Or enter your partner's code and link yours</li>
          <li>
            Keep swiping names (from time to time we'll present you names your
            partner already liked)
          </li>
          <li>Find your name matches in the section "Matches"</li>
        </ul>
        <h3>Contact</h3>
        <p>Questions? Feedback? Just mail us:</p>

        <p>sara.bongartz@gmail.com</p>
      </div>
    </div>
  );
}

export default About;

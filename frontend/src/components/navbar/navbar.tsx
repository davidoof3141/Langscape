import React from "react";
import "./navbar.css"; // Add this for custom styling if needed

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">LANGSCAPE</div>
      <div className="navbar-tabs">
        <a href="#langchat" className="navbar-tab">Langchat</a>
        <a href="#dictionary" className="navbar-tab">Dictionary</a>
      </div>
    </nav>
  );
};

export default Navbar;

import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand-link">
        <span className="brand-mark">SQL</span>
        <span>Query Generator</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/home" className="nav-link">
          Home
        </NavLink>

        <NavLink to="/prompt" className="nav-link">
          Prompt
        </NavLink>

        <NavLink to="/history" className="nav-link">
          History
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;

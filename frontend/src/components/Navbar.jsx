import { Link } from "react-router-dom";

function Navbar() {

  return (

    <nav
      style={{
        background: "#1e293b",
        padding: "15px"
      }}
    >

      <Link
        to="/"
        style={{
          color: "white",
          marginRight: "20px",
          textDecoration: "none"
        }}
      >
        Home
      </Link>

      <Link
        to="/history"
        style={{
          color: "white",
          textDecoration: "none"
        }}
      >
        History
      </Link>

    </nav>

  );
}

export default Navbar;
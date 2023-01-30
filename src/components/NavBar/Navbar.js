import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="Navbar">
      <Link to="/" className="Navbar__link">
        Online coding
      </Link>
    </div>
  );
}

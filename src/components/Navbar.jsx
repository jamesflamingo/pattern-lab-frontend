
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className="navbar-brand">
        Pattern Lab
      </NavLink>

      <div className="navbar-links">
        <NavLink to="/library">
          Library
        </NavLink>

        <NavLink to="/measurements">
          Atelier
        </NavLink>

        <NavLink to="/collection">
          My Collection
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar

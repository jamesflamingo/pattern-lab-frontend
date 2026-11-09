import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <NavLink to="/" end>
        Pattern Lab
      </NavLink>

      <NavLink to="/library">
        Library
      </NavLink>

      <NavLink to="/measurements">
        Measurements
      </NavLink>

      <NavLink to="/collection">
        My Collection
      </NavLink>
    </nav>
  )
}

export default Navbar

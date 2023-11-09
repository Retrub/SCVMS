import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar__menu">
        <li>
          <Link to="/main"> Pradžia</Link>
        </li>

        <li>
          <Link to="/new">Naujas klientas</Link>
        </li>

        <li>
          <Link to="/clients">Klientai</Link>
        </li>

        <li>
          <Link to="/entries">Lankytojų įrašai</Link>
        </li>

        <li>
          <Link to="/login">Atsijungti</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

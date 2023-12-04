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
          <Link to="/new">Lankytojo registracija</Link>
        </li>

        <li>
          <Link to="/clients">Lankytojai</Link>
        </li>

        <li>
          <Link to="/entries">Lankytojų lankomumas</Link>
        </li>

        <li>
          <Link to="/memberships">Narysčių kainos</Link>
        </li>

        <li>
          <Link to="/memberships-entries">Narysčių įrašai</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

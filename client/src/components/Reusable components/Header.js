import React from "react";
import "./Header.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const response = await axios.get("/api/auth/main", config);
        setClientName(response.data);
      } catch (error) {
        // Handle any errors that occur during the request
        console.error("Error fetching private data:", error);
      }
    };

    fetchPrivateData();
  }, []); // Specify an empty dependency array

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
  };

  return (
    <header>
      <div className="header">
        <div className="header__title">ClubVisa</div>
        <div className="header__admin-info">Sveikas, {clientName.username}</div>
        <a
          onClick={logoutHandler}
          href="/login"
          className="header__logout-button"
        >
          Atsijungti
        </a>
      </div>
    </header>
  );
};

export default Header;

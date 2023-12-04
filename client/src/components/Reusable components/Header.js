import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Header.css";

const encryption = require("../../server/config/encryption");

const Header = () => {
  const history = useHistory();
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const response = await axios.get("/api/auth/main", config);
        const encryptedData = response.data.userObject;
        const secretKey = response.data.EncryptedSecretKey;
        const decryptedData = encryption.decrypt(encryptedData, secretKey);
        setClientName(decryptedData);
      } catch (error) {
        localStorage.removeItem("authToken");
        console.error("Klaida nuskaitant vardą:", error);
        history.push("/login");
      }
    };

    fetchPrivateData();
  }, [history]);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
  };

  return (
    <header>
      <div className="header">
        <div className="header__title">ClubVisa</div>
        <div className="header__admin-info">Sveikas, {clientName.username}</div>
        <div className="header__linksAndButtons">
          <a href="" className="header__link">
            Profilis
          </a>
          <a
            onClick={logoutHandler}
            href="/login"
            className="header__logout-button"
          >
            Atsijungti
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Membership.css";

const encryption = require("../../server/config/encryption");

const Membership = () => {
  const [membershipsData, setMembershipsData] = useState([]);

  useEffect(() => {
    const fetchPrivateData = async () => {
      try {
        const response = await axios.get("/api/auth/memberships");
        const encryptedData = response.data.membershipsObjects;
        const secretKey = response.data.EncryptedSecretKey;
        const decryptedData = encryption.decrypt(encryptedData, secretKey);
        setMembershipsData(decryptedData);
      } catch (error) {
        localStorage.removeItem("authToken");
      }
    };
    fetchPrivateData();
  }, []);

  return (
    <div className="membership">
      <div className="membership__title">Narysčių sąrašas</div>
      <table>
        <thead>
          <tr>
            <th>Pavadinimas</th>
            <th>Kaina</th>
            <th>Trukmė (mėnesiai)</th>
          </tr>
        </thead>
        <tbody>
          {membershipsData.map((membership, index) => (
            <tr key={index}>
              <td>{membership.name} </td>
              <td>{membership.price}€</td>
              <td>{membership.duration_months}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Membership;
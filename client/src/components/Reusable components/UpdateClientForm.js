import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import "./UpdateClientForm.css";

const encryption = require("../../server/config/encryption");

const UpdateClientPage = () => {
  const history = useHistory();
  const { clientId } = useParams();
  const [clientData, setClientData] = useState({});
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPrivateData = async () => {
    try {
      const response = await axios.get(`/api/auth/clients-update/${clientId}`);
      const encryptedData = response.data.clientObject;
      const secretKey = response.data.EncryptedSecretKey;
      const decryptedData = encryption.decrypt(encryptedData, secretKey);
      setClientData(decryptedData);
    } catch (error) {
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      fetchPrivateData();
    }
  }, [history]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/auth/clients/${clientId}`, formData);
      setSuccess("Kliento informacija sėkmingai pakeista");
      setTimeout(() => {
        setSuccess("");
        history.push("/clients");
      }, 3000);
    } catch (error) {
      setError("Įvyko klaida atnaujinant kliento duomenis: " + error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="update-client-form">
      {error && <span className="error-message">{error}</span>}
      {success && <span className="success-message">{success}</span>}
      <div className="update-client-form__title">Redaguoti klientą</div>
      <form onSubmit={handleSubmit}>
        <div className="update-client-form__group">
          <label htmlFor="name">Vardas</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || clientData.name || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-client-form__group">
          <label htmlFor="surname">Pavardė</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname || clientData.surname || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-client-form__group">
          <label htmlFor="email">El. paštas</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email || clientData.email || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-client-form__group">
          <label htmlFor="city">Miestas</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city || clientData.city || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="update-client-form__group">
          <label htmlFor="birth">Gimimo data:</label>
          <input
            type="date"
            id="birth"
            name="birth"
            value={formData.birth || clientData.birth || ""}
            onChange={handleInputChange}
          />
        </div>

        <button className="update-client-form__button" type="submit">
          Išsaugoti
        </button>
      </form>
    </div>
  );
};

export default UpdateClientPage;

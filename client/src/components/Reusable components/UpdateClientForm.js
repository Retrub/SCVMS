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
  const [monthsToAdd, setMonthsToAdd] = useState(1);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      const fetchPrivateData = async () => {
        try {
          const response = await axios.get(`/api/auth/read/${clientId}`);
          const encryptedData = response.data.clientObject;
          const secretKey = response.data.EncryptedSecretKey;
          const decryptedData = encryption.decrypt(encryptedData, secretKey);
          setClientData(decryptedData);
        } catch (error) {
          localStorage.removeItem("authToken");
        }
      };
      fetchPrivateData();
    }
  }, [history, clientId]);

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
      await axios.put(`/api/auth/client/update/${clientId}`, formData);
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

  const handleAddMonth = async () => {
    let originalDate = new Date(clientData.valid_until);
    const localDate = new Date();

    if (localDate > originalDate) {
      originalDate = localDate;
    }

    const months = parseInt(monthsToAdd, 10);
    originalDate.setUTCMonth(originalDate.getUTCMonth() + months);
    const newValidUntil = originalDate.toISOString();

    const updatedFormData = {
      ...formData,
      valid_until: newValidUntil,
      duration: months,
    };

    try {
      await axios.put(`/api/auth/client/update/${clientId}`, updatedFormData);
      setSuccess("Klientui sėkmingai pratestą narystė");
      setTimeout(() => {
        setSuccess("");
        history.push("/clients");
      }, 3000);
    } catch (error) {
      setError("Įvyko klaida atnaujinant kliento narystę: " + error.message);
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

        <div className="update-client-form__group">
          <label htmlFor="access">Prieiga:</label>
          <select
            id="access"
            name="access"
            value={formData.access || clientData.access || ""}
            onChange={handleInputChange}
          >
            <option value="Patvirtinta">Patvirtinta</option>
            <option value="Uždrausta">Uždrausta</option>
          </select>
        </div>

        <button className="update-client-form__button" type="submit">
          Išsaugoti
        </button>

        <div className="update-client-form__group">
          <label htmlFor="months">Laikotarpis:</label>
          <select
            id="months"
            name="months"
            value={monthsToAdd}
            onChange={(e) => setMonthsToAdd(e.target.value)}
          >
            <option value="1">1 mėnuo</option>
            <option value="3">3 mėnesiai</option>
            <option value="6">6 mėnesiai</option>
            <option value="12">12 mėnesių</option>
            <option value="-1">1 mėnesį atimti</option>
          </select>
        </div>

        <button
          className="update-client-form__button"
          type="button"
          onClick={handleAddMonth}
        >
          + Pridėti
        </button>
      </form>
    </div>
  );
};

export default UpdateClientPage;

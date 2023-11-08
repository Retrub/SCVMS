import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ClientTable.css";

const encryption = require("../../server/config/encryption");

const ClientTable = () => {
  const history = useHistory();
  const [clientsData, setClientsData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      fetchPrivateData();
    }
  }, [history]);

  const fetchPrivateData = async () => {
    try {
      const response = await axios.get("/api/auth/clients");
      const encryptedData = response.data.clientObject;
      const secretKey = response.data.EncryptedSecretKey;
      const decryptedData = encryption.decrypt(encryptedData, secretKey);
      setClientsData(decryptedData);
    } catch (error) {
      console.error("Decryption error:", error);
    }
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(`/api/auth/clients/${clientId}`);
      fetchPrivateData();
      setSuccess("Klientas sėkmingai ištrintas");
      setTimeout(() => {
        setSuccess("");
        history.push("/clients");
      }, 3000);
    } catch (error) {
      setError("Ištrinti kliento nepavyko: " + error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <div className="client-table">
      <div className="client-table__title">Klientų sąrašas</div>
      {error && <span className="error-message">{error}</span>}
      {success && <span className="success-message">{success}</span>}
      <div className="client-table__container">
        <table>
          <thead>
            <tr>
              <th>Vardas</th>
              <th>Pavardė</th>
              <th>El. paštas</th>
              <th>Miestas</th>
              <th>Gimimo data</th>
              <th>Prisijungimo data</th>
              <th>Galioja iki</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {clientsData.map((client) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.surname}</td>
                <td>{client.email}</td>
                <td>{client.city}</td>
                <td>{client.birth}</td>
                <td>{client.join_date}</td>
                <td>{client.valid_until}</td>
                <td>
                  <button
                    className="client-table__button-delete"
                    onClick={() => handleDelete(client._id)}
                  >
                    Delete
                  </button>
                  <Link to={`/client-update/${client._id}`}>
                    <button className="client-table__button-update">
                      Update
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;

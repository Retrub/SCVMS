import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ClientTable.css";
import Pagination from "./Pagination";

const encryption = require("../../server/config/encryption");

const ClientTable = () => {
  const history = useHistory();
  const [clientsData, setClientsData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchWord, setsearchWord] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      fetchPrivateData();
    }
  }, [history]);

  useEffect(() => {
    const filterClients = () => {
      const filtered = clientsData.filter((client) => {
        return (
          client.name.toLowerCase().includes(searchWord.toLowerCase()) ||
          client.email.toLowerCase().includes(searchWord.toLowerCase()) ||
          client.surname.toLowerCase().includes(searchWord.toLowerCase())
        );
      });

      setFilteredClients(filtered);
    };

    filterClients();
  }, [clientsData, searchWord]);

  const fetchPrivateData = async () => {
    try {
      const response = await axios.get("/api/auth/clients");
      const encryptedData = response.data.clientObject;
      const secretKey = response.data.EncryptedSecretKey;
      const decryptedData = encryption.decrypt(encryptedData, secretKey);
      setClientsData(decryptedData);
    } catch (error) {
      console.error("Klaida nuskaitant privačią informaciją:", error);
    }
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(`/api/auth/client/delete/${clientId}`);
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

  const getStatusAndColor = (client) => {
    const validUntilDate = new Date(client.valid_until);
    const today = new Date();
    const remainingDays = Math.floor(
      (validUntilDate - today) / (1000 * 60 * 60 * 24)
    );

    let statusClass = "";
    let status = client.status;

    if (remainingDays < 0 || status === "Uždraustas") {
      statusClass = "client-table__denied-status";
      status = "Uždraustas";
    } else if (remainingDays <= 5) {
      statusClass = "client-table__warning-status";
      status = "Patvirtintas";
    } else if (remainingDays > 5) {
      statusClass = "client-table__confirmed-status";
    }
    return { status, statusClass };
  };

  const recordEntry = async (clientId) => {
    try {
      const response = await axios.post(`/api/auth/clients/entry/${clientId}`);
      setSuccess(response.data.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const recordExit = async (clientId) => {
    try {
      const response = await axios.post(`/api/auth/clients/exit/${clientId}`);
      setSuccess(response.data.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  //Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="client-table">
      <div className="client-table__title">Klientų sąrašas</div>

      <div className="client-table__search">
        <input
          type="text"
          placeholder="Ieškoti klientų pagal vardą || pavardę || el. paštą"
          value={searchWord}
          onChange={(e) => setsearchWord(e.target.value)}
        />
      </div>

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
              <th>Statusas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((client) => {
              const { status, statusClass } = getStatusAndColor(client);

              return (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.surname}</td>
                  <td>{client.email}</td>
                  <td>{client.city}</td>
                  <td>{client.birth}</td>
                  <td>{client.join_date}</td>
                  <td>{client.valid_until}</td>
                  <td className={statusClass}>{status}</td>
                  <td>
                    <button
                      className="client-table__button-delete"
                      onClick={() => handleDelete(client._id)}
                    >
                      Delete
                    </button>

                    <Link to={`/read/${client._id}`}>
                      <button className="client-table__button-update">
                        Update
                      </button>
                    </Link>

                    <button
                      className="client-table__button-entryAndExit"
                      onClick={() => recordEntry(client._id)}
                    >
                      Atėjo
                    </button>

                    <button
                      className="client-table__button-entryAndExit"
                      onClick={() => recordExit(client._id)}
                    >
                      Išėjo
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="client-table__legend">
        <div className="client-table__legend-item">
          <div className="client-table__color-box client-table__confirmed-status"></div>
          <div>Leidimas suteiktas</div>
        </div>

        <div className="client-table__legend-item">
          <div className="client-table__color-box client-table__denied-status"></div>
          <div>Pasibaigusi narystė ir priega uždrausta </div>
        </div>

        <div className="client-table__legend-item">
          <div className="client-table__color-box client-table__warning-status"></div>
          <div>Baigiasi narystė, bet leidimas suteiktas</div>
        </div>
      </div>

      <div className="client-table__pagination">
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredClients.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      </div>
    </div>
  );
};

export default ClientTable;

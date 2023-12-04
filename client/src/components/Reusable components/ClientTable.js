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
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

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
          client.surname.toLowerCase().includes(searchWord.toLowerCase()) ||
          client.valid_until.includes(searchWord)
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

  const getAccessAndColor = (client) => {
    const validUntilDate = new Date(client.valid_until);
    const today = new Date();
    const remainingDays = Math.floor(
      (validUntilDate - today) / (1000 * 60 * 60 * 24)
    );

    let accessClass = "";
    let access = client.access;

    if (access === "Uždrausta") {
      accessClass = "client-table__denied-access";
      access = "Uždrausta";
    } else if (remainingDays < 0) {
      accessClass = "client-table__denied-access";
      access = "Pasibaigusi narystė";
    } else if (remainingDays <= 5) {
      accessClass = "client-table__warning-access";
      access = "Patvirtinta";
    } else if (remainingDays > 5) {
      accessClass = "client-table__confirmed-access";
    }
    return { access, accessClass };
  };

  const recordEntry = async (clientId) => {
    try {
      const response = await axios.post(`/api/auth/clients/entry/${clientId}`);
      setSuccess(response.data.message);
      setTimeout(() => {
        setSuccess("");
      }, 3000);
      fetchPrivateData();
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
      fetchPrivateData();
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
  const currentEntries = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortOrder(newSortOrder);
    setSortField(field);

    const sortedClients = [...filteredClients].sort((a, b) => {
      const valueA = a[field].toLowerCase();
      const valueB = b[field].toLowerCase();

      if (newSortOrder === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });

    setFilteredClients(sortedClients);
  };

  return (
    <div className="client-table">
      <div className="client-table__title">Lankytojų sąrašas</div>

      <div className="client-table__search">
        <input
          type="text"
          placeholder="Ieškoti klientų pagal vardą || pavardę || el. paštą || galioja iki"
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
              <th
                className="client-table__sort-th"
                onClick={() => handleSort("name")}
              >
                Vardas{" "}
                {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th
                className="client-table__sort-th"
                onClick={() => handleSort("surname")}
              >
                Pavardė{" "}
                {sortField === "surname" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th
                className="client-table__sort-th"
                onClick={() => handleSort("email")}
              >
                El. paštas{" "}
                {sortField === "email" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th>Miestas</th>
              <th>Gimimo data</th>
              <th>Prisijungimo data</th>

              <th
                className="client-table__sort-th"
                onClick={() => handleSort("valid_until")}
              >
                Galioja iki{" "}
                {sortField === "valid_until" &&
                  (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th>Prieiga</th>

              <th
                className="client-table__sort-th"
                onClick={() => handleSort("status")}
              >
                Statusas{" "}
                {sortField === "status" && (sortOrder === "asc" ? "▲" : "▼")}
              </th>

              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((client) => {
              const { access, accessClass } = getAccessAndColor(client);

              return (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.surname}</td>
                  <td>{client.email}</td>
                  <td>{client.city}</td>
                  <td>{client.birth}</td>
                  <td>{client.join_date}</td>
                  <td>{client.valid_until}</td>
                  <td className={accessClass}>{access}</td>
                  <td>{client.status}</td>
                  <td>
                    <button
                      className="client-table__button-delete"
                      onClick={() => handleDelete(client._id)}
                    >
                      Ištrinti
                    </button>

                    <Link to={`/read/${client._id}`}>
                      <button className="client-table__button-update">
                        Redaguoti
                      </button>
                    </Link>

                    <button
                      className="client-table__button-entryAndExit"
                      onClick={() => recordEntry(client._id)}
                      disabled={client.access === "Uždrausta"}
                    >
                      Atėjo
                    </button>

                    <button
                      className="client-table__button-entryAndExit"
                      onClick={() => recordExit(client._id)}
                      disabled={client.access === "Uždrausta"}
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
          <div className="client-table__color-box client-table__confirmed-access"></div>
          <div>Leidimas suteiktas</div>
        </div>

        <div className="client-table__legend-item">
          <div className="client-table__color-box client-table__denied-access"></div>
          <div>Pasibaigusi narystė arba priega uždrausta </div>
        </div>

        <div className="client-table__legend-item">
          <div className="client-table__color-box client-table__warning-access"></div>
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

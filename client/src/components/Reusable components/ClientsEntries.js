import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import "./ClientsEntries.css";

const encryption = require("../../server/config/encryption");

const ClientsEntries = ({ history }) => {
  const [clientsEntriesData, setClientsEntriesData] = useState([]);
  const [searchWord, setsearchWord] = useState("");
  const [filteredClientsEntries, setFilteredClientsEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      const fetchPrivateData = async () => {
        try {
          const response = await axios.get("/api/auth/clients/entries");
          const encryptedData = response.data.clientEntriesObjects;
          const secretKey = response.data.EncryptedSecretKey;
          const decryptedData = encryption.decrypt(encryptedData, secretKey);
          setClientsEntriesData(decryptedData);
        } catch (error) {
          console.error("Decryption error:", error);
        }
      };
      fetchPrivateData();
    }
  }, [history]);

  useEffect(() => {
    const filterClientsEntries = () => {
      const filtered = clientsEntriesData.filter((entry) => {
        const hasAllFields =
          entry.clientInfo.name &&
          entry.clientInfo.surname &&
          entry.entryTime &&
          entry.exitTime;
        if (hasAllFields) {
          return (
            entry.clientInfo.name
              .toLowerCase()
              .includes(searchWord.toLowerCase()) ||
            entry.clientInfo.surname
              .toLowerCase()
              .includes(searchWord.toLowerCase())
          );
        }
      });
      setFilteredClientsEntries(filtered);
    };

    filterClientsEntries();
  }, [clientsEntriesData, searchWord]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredClientsEntries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortOrder(newSortOrder);
    setSortField(field);

    const sortedClients = [...filteredClientsEntries].sort((a, b) => {
      const valueA = a.clientInfo[field] || a[field];
      const valueB = b.clientInfo[field] || b[field];
      console.log(valueA);

      const isDateFormat = (value) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
        return dateRegex.test(value);
      };

      if (isDateFormat(valueA) && isDateFormat(valueB)) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);

        if (newSortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else {
        if (newSortOrder === "asc") {
          return valueA.toString().localeCompare(valueB.toString());
        } else {
          return valueB.toString().localeCompare(valueA.toString());
        }
      }
    });

    setFilteredClientsEntries(sortedClients);
  };

  return (
    <div className="clients-entries">
      <div className="clients-entries__title">Lankytojų įrašai</div>

      <div className="clients-entries__search">
        <input
          type="text"
          placeholder="Ieškoti klientų pagal vardą || pavardę"
          value={searchWord}
          onChange={(e) => setsearchWord(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th
              className="clients-entries__sort-th"
              onClick={() => handleSort("name")}
            >
              Vardas {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              className="clients-entries__sort-th"
              onClick={() => handleSort("surname")}
            >
              Pavardė{" "}
              {sortField === "surname" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              className="clients-entries__sort-th"
              onClick={() => handleSort("entryTime")}
            >
              Įėjimo laikas{" "}
              {sortField === "entryTime" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              className="clients-entries__sort-th"
              onClick={() => handleSort("exitTime")}
            >
              Išėjimo laikas{" "}
              {sortField === "exitTime" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              className="clients-entries__sort-th"
              onClick={() => handleSort("spentTime")}
            >
              Praleido (min){" "}
              {sortField === "spentTime" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.clientInfo.name}</td>
              <td>{entry.clientInfo.surname}</td>
              <td>{entry.entryTime}</td>
              <td>{entry.exitTime}</td>
              <td>{entry.spentTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="clients-entries__pagination">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={clientsEntriesData.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ClientsEntries;

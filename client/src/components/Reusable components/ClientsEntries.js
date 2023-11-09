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
        return (
          entry.clientInfo.name.toLowerCase().includes(searchWord.toLowerCase()) ||
          entry.clientInfo.surname.toLowerCase().includes(searchWord.toLowerCase())
        );
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
  const currentEntries = filteredClientsEntries.slice(indexOfFirstItem,indexOfLastItem);

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
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Įėjimo laikas</th>
            <th>Išėjimo laikas</th>
            <th>Praleido (min)</th>
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

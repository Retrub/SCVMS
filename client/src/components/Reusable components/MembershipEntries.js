import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import "./MembershipEntries.css";

const encryption = require("../../server/config/encryption");

const MembershipEntries = () => {
  const [membershipsEntriesData, setMembershipsEntriesData] = useState([]);
  const [filteredmembershipsEntries, setFilteredMembershipsEntries] = useState(
    []
  );
  const [searchWord, setsearchWord] = useState("");
  const [totalSum, setTotalSum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchPrivateData = async () => {
      try {
        const response = await axios.get("/api/auth/memberships/entries");
        const encryptedData = response.data.membershipEntriesObjects;
        const secretKey = response.data.EncryptedSecretKey;
        const decryptedData = encryption.decrypt(encryptedData, secretKey);
        const formattedMembershipsEntries = decryptedData;

        // Išfiltruojami šio menėsio įrašai
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentMonthEntries = formattedMembershipsEntries.filter(
          (entry) => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() + 1 === currentMonth;
          }
        );

        // Apskaičiuojame bendrą šio mėnesio narysčių sumą
        const sum = currentMonthEntries.reduce((acc, entry) => {
          return acc + entry.membershipInfo.price;
        }, 0);

        setTotalSum(sum);
        setMembershipsEntriesData(currentMonthEntries);
      } catch (error) {
        localStorage.removeItem("authToken");
      }
    };

    fetchPrivateData();
  }, []);

  useEffect(() => {
    const filterMembershipsEntries = () => {
      const filtered = membershipsEntriesData.filter((entry) => {
        return (
          entry.clientInfo.name
            .toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          entry.clientInfo.surname
            .toLowerCase()
            .includes(searchWord.toLowerCase()) ||
          entry.date.includes(searchWord)
        );
      });
      setFilteredMembershipsEntries(filtered);
    };

    filterMembershipsEntries();
  }, [membershipsEntriesData, searchWord]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = filteredmembershipsEntries.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
    setSortOrder(newSortOrder);
    setSortField(field);

    const sortedClients = [...filteredmembershipsEntries].sort((a, b) => {
      const valueA = a.clientInfo[field] || a[field];
      const valueB = b.clientInfo[field] || b[field];

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

    setFilteredMembershipsEntries(sortedClients);
  };

  return (
    <div className="membership-entries">
      <div className="membership-entries__title">
        Šio mėnesio narysčių įrašai
      </div>

      <div className="membership-entries__subtitle">
        Bendra šio mėnesio suma:{" "}
        <span className="membership-entries__subtitle-sum">{totalSum}€</span>
      </div>

      <div className="membership-entries__search">
        <input
          type="text"
          placeholder="Ieškoti klientų pagal vardą || pavardę || datą"
          value={searchWord}
          onChange={(e) => setsearchWord(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th
              className="membership-entries__sort-th"
              onClick={() => handleSort("name")}
            >
              Vardas {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              className="membership-entries__sort-th"
              onClick={() => handleSort("surname")}
            >
              Pavardė{" "}
              {sortField === "surname" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th>Trukmė (mėnesiais)</th>

            <th
              className="membership-entries__sort-th"
              onClick={() => handleSort("membership_type")}
            >
              Narystės tipas{" "}
              {sortField === "membership_type" &&
                (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th
              className="membership-entries__sort-th"
              onClick={() => handleSort("date")}
            >
              Įrašo data{" "}
              {sortField === "date" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>

            <th>Narystės kaina</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entries, index) => (
            <tr key={index}>
              <td>{entries.clientInfo.name}</td>
              <td>{entries.clientInfo.surname}</td>
              <td>{entries.membershipInfo.duration_months}</td>
              <td>{entries.membership_type}</td>
              <td>{entries.date}</td>
              <td>{entries.membershipInfo.price}€</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="clients-entries__pagination">
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={membershipsEntriesData.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MembershipEntries;

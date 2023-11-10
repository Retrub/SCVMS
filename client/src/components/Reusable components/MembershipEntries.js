import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import "./MembershipEntries.css";

const encryption = require("../../server/config/encryption");

const MembershipEntries = () => {
  const [membershipsEntriesData, setMembershipsEntriesData] = useState([]);
  const [totalSum, setTotalSum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntries = membershipsEntriesData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="membership-entries">
      <div className="membership-entries__title">
        Šio mėnesio narysčių įrašai
      </div>

      <div className="membership-entries__subtitle">
        Bendra šio mėnesio suma:{" "}
        <span className="membership-entries__subtitle-sum">{totalSum}€</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Vardas</th>
            <th>Pavardė</th>
            <th>Trukmė (mėnesiais)</th>
            <th>Narystės tipas</th>
            <th>Įrašo data</th>
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
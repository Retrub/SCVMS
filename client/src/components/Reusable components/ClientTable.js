import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./ClientTable.css";

const ClientTable = () => {
  const history = useHistory();
  const [clientData, setClientData] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }

    const fetchPrivateData = async () => {
      try {
        const response = await axios.get("/api/auth/clients");
        setClientData(response.data);
      } catch (error) {
        localStorage.removeItem("authToken");
      }
    };

    fetchPrivateData();
  });

  return (
    <div className="client-table">
      <div className="client-table__title">Klientų sąrašas</div>
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
          <th>Laikotarpis</th>
        </tr>
        </thead>
        <tbody>
        {clientData &&
          clientData.map((client, index) => (
            <tr key={index}>
              <td>{client.name}</td>
              <td>{client.surname}</td>
              <td>{client.email}</td>
              <td>{client.city}</td>
              <td>{client.birth}</td>
              <td>{client.join_date}</td>
              <td>{client.sport_plan}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;

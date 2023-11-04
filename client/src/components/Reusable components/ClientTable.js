import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./ClientTable.css";

const ClientTable = () => {
  const history = useHistory();
  const [clientData, setClientData] = useState([]);

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
      setClientData(response.data);
    } catch (error) {
      localStorage.removeItem("authToken");
    }
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(`/api/auth/clients/${clientId}`);
      fetchPrivateData();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

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
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {clientData.map((client, index) => (
              <tr key={client._id}>
                <td>{client.name}</td>
                <td>{client.surname}</td>
                <td>{client.email}</td>
                <td>{client.city}</td>
                <td>{client.birth}</td>
                <td>{client.join_date}</td>
                <td>{client.sport_plan}</td>
                <td>
                  <button className="client-table__button-delete" onClick={() => handleDelete(client._id)}>Delete</button>
                  <Link to={`/clients-update/${client._id}`}>
                    <button className="client-table__button-update" >Update</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>

      </div>
      </div>
    </div>
  );
};

export default ClientTable;

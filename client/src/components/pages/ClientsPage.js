import "./ClientsPage.css";
import { useState, useEffect } from "react";
import axios from "axios";

//Components
import Sidebar from "../Reusable components/Sidebar";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";
import ClientTable from "../Reusable components/ClientTable";

const ClientsPage = ({ history }) => {
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
        setError("Jūs esate neprisijungę, prašome prisjungti.");
        setTimeout(() => {
          history.push("/login");
        }, 4000);
      }
    };

    fetchPrivateData();
  }, [history]);

  return (
    <div className="all-pages-settings">
      <Header />
      <div className="container">
        <Sidebar />
        <div className="main">
          <ClientTable />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientsPage;

import { useState, useEffect } from "react";
import axios from "axios";
import "./MainPage.css";

//Components
import Sidebar from "../Reusable components/Sidebar";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";
import Dashboard from "../Reusable components/Dashboard";

const MainPage = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      const checkAuth = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        };

        try {
          const { data } = await axios.get("/api/auth/main", config);
          setPrivateData(data.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("authToken");
            history.push("/login");
            setError("Jūsų prisijungimo sesija baigėsi. Prašome prisijungti.");
            setTimeout(() => {
              setError("");
            }, 5000);
          } else {
            localStorage.removeItem("authToken");
            setError("Įvyko klaida. Prašome bandyti dar kartą vėliau.");
            setTimeout(() => {
              setError("");
            }, 5000);
            history.push("/login");
          }
        }
      };

      checkAuth();
    }
  }, [history]);

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div className="all-pages-settings">
        <Header />
        <div className="container">
          <Sidebar />
          <div className="main">
            <Dashboard />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainPage;

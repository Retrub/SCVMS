import { useState, useEffect } from "react";
import axios from "axios";
import "./PrivatePage.css";

//Components
import Sidebar from "../Reusable components/Sidebar";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";

const PrivatePage = ({ history }) => {
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
            setTimeout(() => {}, 4000);
          } else {
            localStorage.removeItem("authToken");
            setError("Įvyko klaida. Prašome bandyti dar kartą vėliau.");
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
          <div className="main">{privateData}</div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PrivatePage;

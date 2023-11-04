import { useEffect } from "react";
import "./PrivatePage.css";

//Components
import Sidebar from "../Reusable components/Sidebar";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";

const PrivatePage = ({ history }) => {
  // const [error, setError] = useState("");
  let error = "";
  // const [privateData, setPrivateData] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }

    // const fetchPrivateData = async () => {
    //   const config = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    //     },
    //   };

    //   try {
    //     const { data } = await axios.get("/api/auth/main", config);
    //     setPrivateData(data.data);
    //   } catch (error) {
    //     localStorage.removeItem("authToken");
    //     setError("Jūs esate neprisijungę, prašome prisjungti.");
    //     setTimeout(() => {
    //       history.push("/login");
    //     }, 4000);
    //   }
    // };

    // fetchPrivateData();
  }, [history]);

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
      <div className="all-pages-settings">
        <Header />
        <div className="container">
          <Sidebar />
          <div className="main">Dashboard</div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PrivatePage;

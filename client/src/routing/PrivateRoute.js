import { Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import UserPage from "../components/pages/UserPage";

const encryption = require("../server/config/encryption");

const PrivateRoute = ({ history, component: Component, role, ...rest }) => {
  const [userRole, setUserRole] = useState("");
  const isAuthenticated = localStorage.getItem("authToken");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    }
    const fetchPrivateData = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const response = await axios.get("/api/auth/main", config);
        const encryptedData = response.data.userObject;
        const secretKey = response.data.EncryptedSecretKey;
        const decryptedData = encryption.decrypt(encryptedData, secretKey);

        setUserRole(decryptedData);
      } catch (error) {
        localStorage.removeItem("authToken");
      }
    };

    fetchPrivateData();
  }, [history]);

  if (isAuthenticated) {
    if (userRole.role === "admin") {
      return <Route {...rest} render={(props) => <Component {...props} />} />;
    } else {
      return <Route {...rest} component={UserPage} />;
    }
  }
};

export default PrivateRoute;

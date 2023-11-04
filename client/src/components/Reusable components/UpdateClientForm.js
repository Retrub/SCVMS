import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";

function UpdateClientPage() {
const history = useHistory();
  const { clientId } = useParams();
  const [clientData, setClientData] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      fetchPrivateData();
    }
  },[history]);

  const fetchPrivateData = async () => {
    try {
      const response = await axios.get(`/api/auth/clients-update/${clientId}`);
      setClientData(response.data);
    } catch (error) {
      localStorage.removeItem("authToken");
    }
  };
  


  // Define a function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



    // Define a function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Submit the updated data using formData to the API endpoint for updating
        axios.put(`/api/auth/clients/${clientId}`, formData)
          .then((response) => {
            // Handle success, e.g., redirect to the client list page
            // history.push("/client-list");
          })
          .catch((error) => {
            console.error("Error updating client data:", error);
          });
      };

  return (
    <div>
      <h1>Redaguoti klientą</h1>
      <form onSubmit={handleSubmit}>
        {/* Input fields for updating client data */}

        <div className="">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || clientData.name || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Add more input fields for other client data */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateClientPage;

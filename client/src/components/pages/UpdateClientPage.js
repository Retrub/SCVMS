import React from "react";
import Sidebar from "../Reusable components/Sidebar";
import UpdateClientForm from "../Reusable components/UpdateClientForm";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";

import "./UpdateClientPage.css";

const UpdateClientPage = () => {
  return (
    <div className="all-pages-settings">
      <Header />
      <div className="container">
        <Sidebar />
        <div className="main">
          <UpdateClientForm/>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UpdateClientPage;

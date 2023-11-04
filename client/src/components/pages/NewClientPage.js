import React from "react";
import Sidebar from "../Reusable components/Sidebar";
import NewClientForm from "../Reusable components/NewClientForm";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";

import "./NewClientPage.css";

const NewClientPage = () => {
  return (
    <div className="all-pages-settings">
      <Header />
      <div className="container">
        <Sidebar />
        <div className="main">
          <NewClientForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewClientPage;

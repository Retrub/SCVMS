import React from "react";
import Sidebar from "../Reusable components/Sidebar";
import MembershipEntries from "../Reusable components/MembershipEntries";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";

import "./MembershipsEntriesPage.css";

const MembershipsEntriesPage = () => {
  return (
    <div className="all-pages-settings">
      <Header />
      <div className="container">
        <Sidebar />
        <div className="main">
          <MembershipEntries />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MembershipsEntriesPage;

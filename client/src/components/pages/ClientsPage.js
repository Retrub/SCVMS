import "./ClientsPage.css";

import Sidebar from "../Reusable components/Sidebar";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";
import ClientTable from "../Reusable components/ClientTable";

const ClientsPage = () => {
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

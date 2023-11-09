import "./ClientsEntriesPage.css";

//Components
import Sidebar from "../Reusable components/Sidebar";
import Footer from "../Reusable components/Footer";
import Header from "../Reusable components/Header";
import ClientsEntries from "../Reusable components/ClientsEntries";

const ClientsEntriesPage = () => {

  return (
    <div className="all-pages-settings">
      <Header />
      <div className="container">
        <Sidebar />
        <div className="main">
            <ClientsEntries/>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientsEntriesPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ history }) => {
  const [dashboardInfo, setDashboardInfo] = useState([]);
  const [videoId, setVideoId] = useState("yqrnhrkA7ik");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      history.push("/login");
    } else {
      const fetchPrivateData = async () => {
        try {
          const response = await axios.get("/api/auth/main/dashboard");
          setDashboardInfo(response.data.dashboardStats);
        } catch (error) {
          console.error("Decryption error:", error);
        }
      };
      fetchPrivateData();
    }
  }, [history]);

  return (
    <div className="dashboard">
      <div className="dashboard__title">Sporto klubo apžvalga</div>
      <div className="dashboard__circles-container">
        <div class="dashboard__circle">
          <div className="dashboard__circle-title">
            {dashboardInfo.visitorsToday}
          </div>
          <div className="dashboard__circle-subtitle">Šiandien apsilankė</div>
        </div>

        <div class="dashboard__circle">
          <div className="dashboard__circle-title">
            {dashboardInfo.visitorsMonth}
          </div>
          <div className="dashboard__circle-subtitle">Šį mėnesį apsilankė</div>
        </div>

        <div class="dashboard__circle">
          <div className="dashboard__circle-title">
            {dashboardInfo.clientsAmount}
          </div>
          <div className="dashboard__circle-subtitle">Klientų skaičius</div>
        </div>

        <div class="dashboard__circle">
          <div className="dashboard__circle-title">
            {dashboardInfo.clientsAmountMonth}
          </div>
          <div className="dashboard__circle-subtitle">
            Nauji klientai šis mėnuo
          </div>
        </div>

        <div class="dashboard__circle">
          <div className="dashboard__circle-title">
            {dashboardInfo.visitorsNow}
          </div>
          <div className="dashboard__circle-subtitle">Dabar sportuojančių</div>
        </div>
      </div>

      <div className="dashboard__video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          title="Embedded YouTube Video"
        ></iframe>
      </div>
    </div>
  );
};

export default Dashboard;

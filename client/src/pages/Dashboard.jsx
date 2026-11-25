// Dashboard page: main civic-complaint dashboard view
import React, { useState } from "react";
import MapSection from "../components/MapSection/MapSection";
import StatsCards from "../components/StatsCards/StatsCards";
import MyComplaintsTable from "./MyComplaintsTable";
import Header from "../components/common/Header";

const Dashboard = () => {
  const [showComplaints, setShowComplaints] = useState(false);

  return (
    <div>
      <Header setShowComplaints={setShowComplaints} />
      <StatsCards />
      <main className="pt-[70px] p-4">
        {showComplaints ? (
          <MyComplaintsTable setMap={setShowComplaints} />
        ) : (
          <MapSection />
        )}
      </main>
      {/* Add more dashboard widgets here */}
    </div>
  );
};

export default Dashboard;

// Layout component: wraps Sidebar, Header, and main content
import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./common/Header";
import Dashboard from "../pages/Dashboard";
import MyComplaintsTable from "../pages/MyComplaintsTable";

const sidebarItems = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Complaints", icon: "📋" },
  { label: "Analytics", icon: "📊" },
  { label: "Settings", icon: "⚙️" }
];

const Layout = () => {
  // Active sidebar item state
  const [activeIdx, setActiveIdx] = useState(0);
    const [map, setMap] = useState(true)
  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        activeIdx={activeIdx}
        setActiveIdx={setActiveIdx}
      />
      <div className="flex-1 flex flex-col">
        <Header setMap={setMap} sidebarWidth={activeIdx === -1 ? 70 : 250}  setActiveIdx = {setActiveIdx} />
        <main className="main-content flex-1 bg-gray-50 px-4 pt-[90px] lg:ml-[250px] md:ml-16 transition-all duration-300">
          {activeIdx === 0 && <Dashboard  />}
          {activeIdx === 1 && <MyComplaintsTable />}
          {/* Add more sidebar item views as needed */}
        </main>
      </div>
    </div>
  );
};

export default Layout;

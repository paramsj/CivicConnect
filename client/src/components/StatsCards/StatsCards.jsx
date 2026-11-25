// StatsCards: grid of stat cards for dashboard metrics
import React from "react";
import styles from "./StatsCards.module.css";
import clsx from "classnames";

const stats = [
  {
    label: "Total Complaints",
    value: "180K",
    icon: "📋",
    chip: "bg-blue-100 text-blue-600",
    number: "text-blue-600"
  },
  {
    label: "Resolved",
    value: "12K",
    icon: "✅",
    chip: "bg-green-100 text-green-600",
    number: "text-green-600"
  },
  {
    label: "Pending",
    value: "150K",
    icon: "⏳",
    chip: "bg-red-100 text-red-600",
    number: "text-red-600"
  },
  {
    label: "Escalated",
    value: "20K",
    icon: "⚠️",
    chip: "bg-yellow-100 text-yellow-600",
    number: "text-yellow-600"
  }
];

const StatCard = ({ label, value, icon, chip, number }) => (
  <div
    className={clsx(
      styles.card,
      "bg-white rounded-xl shadow flex flex-col items-center p-6 transition-transform duration-150 hover:-translate-y-1 w-full"
    )}
  >
    <div
      className={clsx(
        "w-12 h-12 flex items-center justify-center rounded-full text-2xl mb-2",
        chip
      )}
    >
      {icon}
    </div>
    <div className={clsx("text-2xl font-bold", number)}>{value}</div>
    <div className="text-gray-500 mt-1 text-sm text-center font-medium">{label}</div>
  </div>
);

const StatsCards = () => (
  <div
    className={clsx(
      styles.statsContainer,
      "grid w-full gap-6 mb-8 lg:grid-cols-4 md:grid-cols-2 grid-cols-1"
    )}
  >
    {stats.map((stat) => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>
);

export default StatsCards;

import React from "react";
import DashGraph from "@/components/admin-components/DashGraph";
import StatCard from "@/components/admin-components/StatCard";
import totalUsersIcon from "@/public/images/Icon.svg";
import doctorIcon from "@/public/images/doctor.svg";
import crossIcon from "@/public/images/cross.svg";
import newusersIcon from "@/public/images/newusers.svg";

import { useGetAllUsersQuery } from "@/redux/api/totalUserApi";

const AdminDashboard = () => {
  const { data: allUsersData, isLoading, isError } = useGetAllUsersQuery();

  const totalUsers = allUsersData ? allUsersData.totalDoctors + allUsersData.totalPatients : 0;

  const totalNewUsers = allUsersData ? allUsersData.totalNewDoctors + allUsersData.totalNewPatients : 0;

  const stats = [
    {
      title: "Total Users",
      value: isLoading ? "Loading..." : isError ? "Error" : totalUsers || "N/A",
      change: "8.5%",
      icon: totalUsersIcon
    },
    {
      title: "Doctors",
      value: isLoading ? "Loading..." : isError ? "Error" : allUsersData?.totalDoctors ?? "N/A",
      change: "1.3%",
      icon: doctorIcon
    },
    {
      title: "Patients",
      value: isLoading ? "Loading..." : isError ? "Error" : allUsersData?.totalPatients ?? "N/A",
      change: "0.1%",
      icon: crossIcon
    },
    {
      title: "New Users",
      value: isLoading ? "Loading..." : isError ? "Error" : (totalNewUsers) ?? "N/A",
      change: "⏳",
      icon: newusersIcon
    },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Admin</h1>

      <div className="flex flex-wrap justify-around gap-4 mx-auto w-full sm:w-[90%]">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <DashGraph />
    </div>
  );
};

export default AdminDashboard;
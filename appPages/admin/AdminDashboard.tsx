'use client';

import DashGraph from "@/components/admin-components/DashGraph";
import StatCard from "@/components/admin-components/StatCard";
import totalUsers from "@/public/images/Icon.svg";
import doctor from "@/public/images/doctor.svg";
import cross from "@/public/images/cross.svg";
import newusers from "@/public/images/newusers.svg";
import {useGetUsersStatQuery} from "@/redux/api/adminApi";


const AdminDashboard = () => {
  const { data: userStats, isLoading } = useGetUsersStatQuery();
  const totalusers = userStats?.totalDoctors + userStats?.totalPatients;
  const totalPatients = userStats?.totalPatients;
  const totalDoctors = userStats?.totalDoctors;
  const totalNewPatients = userStats?.totalNewPatients;

  console.log("User Stats:", userStats);


  const stats = [
    { title: "Total Users", value: totalusers?.toString() || "0", change: "8.5%", icon: totalUsers },
    { title: "Doctors", value: totalDoctors?.toString() || "0", change: "1.3%", icon: cross },
    { title: "Patients", value: totalPatients?.toString() || "0", change: "0.1%", icon: doctor },
    { title: "New Users", value: totalNewPatients?.toString() || "0", change: "⏳", icon: newusers },
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
)};

export default AdminDashboard;
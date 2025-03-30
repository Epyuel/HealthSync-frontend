import DashGraph from "@/components/admin-components/DashGraph";
import StatCard from "@/components/admin-components/StatCard";
import totalUsers from "@/public/images/Icon.svg";
import doctor from "@/public/images/doctor.svg";
import cross from "@/public/images/cross.svg";
import newusers from "@/public/images/newusers.svg";

const stats = [
    { title: "Total Users", value: "40,689", change: "8.5%", icon: totalUsers },
    { title: "Doctors", value: "10,293", change: "1.3%", icon: cross },
    { title: "Patients", value: "450", change: "0.1%", icon: doctor },
    { title: "New Users", value: "30", change: "⏳", icon: newusers },
];

const AdminDashboard = () => (
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

export default AdminDashboard;
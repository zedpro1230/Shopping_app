import React from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import KpiCard from "../components/KpiCard";
function AdminHome() {
  return (
    <div className="flex  mt-[85px] gap-2 font-roboto max-xl:flex-col">
      <NavBar />
      <SideBar />
      <section className="w-full flex-1 p-2">
        <KpiCard />
      </section>
    </div>
  );
}

export default AdminHome;

import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import BannerHeader from "../components/BannerHeader";
import BannerBody from "../components/BannerBody";
function AdminBanner() {
  return (
    <div className="flex   mt-[85px] justify-start font-roboto ">
      <NavBar />
      <SideBar />
      <section className=" w-full flex-1 p-2">
        <BannerHeader />
        <BannerBody />
      </section>
    </div>
  );
}

export default AdminBanner;

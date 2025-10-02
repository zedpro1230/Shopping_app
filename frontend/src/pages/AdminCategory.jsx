import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import CategoryContent from "../components/CategoryContent";
function AdminCategory() {
  return (
    <div className="flex   mt-[85px] justify-start font-roboto ">
      <NavBar />
      <SideBar />
      <section className=" w-full flex-1 p-2">
        <CategoryContent />
      </section>
    </div>
  );
}

export default AdminCategory;

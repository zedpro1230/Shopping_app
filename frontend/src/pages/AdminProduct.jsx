import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ProductContent from "../components/ProductContent";
function AdminProduct() {
  return (
    <div>
      <NavBar />
      <div className="mt-[85px] gap-2 flex">
        <SideBar />
        <section className="w-full flex-1 p-2">
          <ProductContent />
        </section>
      </div>
    </div>
  );
}

export default AdminProduct;

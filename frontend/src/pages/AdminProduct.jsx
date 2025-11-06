import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import ProductContent from "../components/ProductContent";
function AdminProduct() {
  return (
    <div>
      <NavBar />
      <div className="mt-[85px] gap-2 flex max-xl:flex-col">
        <SideBar />
        <section className="w-[85%] flex-1 p-2 max-xl:w-full">
          <ProductContent />
        </section>
      </div>
    </div>
  );
}

export default AdminProduct;

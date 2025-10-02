import { useContext, useState, createContext } from "react";
export const ItemsContext = createContext();
export const ItemsProvider = ({ children }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [miniSideBar, setMiniSideBar] = useState(false);
  const [categories, setCategories] = useState([]);
  return (
    <ItemsContext.Provider
      value={{
        activeItem,
        setActiveItem,
        miniSideBar,
        setMiniSideBar,
        categories,
        setCategories,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

// Custom hook to use the context
export const useItemsContext = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItemsContext must be used within an ItemsProvider");
  }
  return context;
};

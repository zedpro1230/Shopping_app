import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import backEndHost from "../config/backendHost";
const BannerContext = createContext();

export const useBanners = () => {
  const context = useContext(BannerContext);
  if (!context) {
    throw new Error("useBanners must be used within BannerProvider");
  }
  return context;
};

export const BannerProvider = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${backEndHost}/banners/`);
      console.log(response.data.data);
      setBanners(response.data.data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBanners = useCallback(() => {
    fetchBanners();
  }, [fetchBanners]);

  const deleteBanner = useCallback(async (id) => {
    try {
      await axios.delete(`${backEndHost}/banners/${id}`);
      // Update local state by filtering out the deleted banner
      setBanners((prevBanners) =>
        prevBanners.filter((banner) => banner._id !== id)
      );
    } catch (error) {
      console.error("Error deleting banner:", error);
      setError(error.message);
      throw error; // Re-throw so component can handle it
    }
  }, []);

  const addBanner = useCallback(
    async (formData) => {
      try {
        const response = await axios.post(`${backEndHost}/banners/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Refresh banners after adding new one
        await fetchBanners();
        return response.data;
      } catch (error) {
        console.error("Error adding banner:", error);
        setError(error.message);
        throw error; // Re-throw so component can handle it
      }
    },
    [fetchBanners]
  );
  const updateBanner = useCallback(
    async (id, formData) => {
      try {
        const response = await axios.put(
          `${backEndHost}/banners/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        await fetchBanners();
        return response.data;
      } catch {
        console.error("Error updating banner:", error);
        setError(error.message);
        throw error; // Re-throw so component can handle it
      }
    },
    [fetchBanners]
  );
  return (
    <BannerContext.Provider
      value={{
        banners,
        loading,
        error,
        fetchBanners,
        refreshBanners,
        deleteBanner,
        addBanner,
        updateBanner,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
};

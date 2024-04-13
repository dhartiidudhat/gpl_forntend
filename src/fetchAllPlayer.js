import axios from "axios";
import { backendURL } from "./config";
import { toast } from "react-toastify";

export const fetchAllPlayer = async () => {
  try {
    const response = await axios.get(`${backendURL}/api/getAllPlayersDetail`);
    return response?.data?.data;
  } catch (error) {
    toast.error("Something went wrong", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      pauseOnHover: false,
      theme: "dark",
    });
    console.log("An error occur", error);
  }
};

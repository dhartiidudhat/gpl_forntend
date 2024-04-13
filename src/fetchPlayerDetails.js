import axios from "axios";
import { backendURL } from "./config";
import { toast } from "react-toastify";

export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.post(`${backendURL}/api/getPlayerById`, {
      playerId: userId,
    });
    return response?.data?.data?.player;
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

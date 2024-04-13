import axios from "axios";
import { backendURL } from "./config";
import { toast } from "react-toastify";

export const fetchOwnerDetails = async (ownerId) => {
  try {
    const response = await axios.get(`${backendURL}/api/getteaminfo/${ownerId}`);
    return {
        teamDetails : response?.data?.players,
        ownerDetails : response?.data?.owner
    }
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
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import { GplButton } from "../../component/Button/GplButton";
import { BlackButton } from "../../component/Button/BlackButton";
import image1 from "../../images/cricket.svg";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../SocketConnection";
import Timer from "../Timer/Timer";
import { backendURL, commonMessage, incrementFromOwner, playerBaseAmount } from "../../config";
import { fetchOwnerDetails } from "../../fetchOwnerDetails";
import { toast } from "react-toastify";


export const Owner = ({ bidPlayer, setClearPlayerDataInAppComponent }) => {

 

  const navigate = useNavigate();
  const fetchCurrentBidPlayer = JSON.parse(
    localStorage?.getItem("current_bid_player")
  );
  //Live bidding price otherwise player base amount
  const [price, setPrice] = useState(
    fetchCurrentBidPlayer?.bidAmount ?? bidPlayer?.bidAmount
  );
  const [playerBidDetail, setPlayerBidDetail] = useState(fetchCurrentBidPlayer);
  const storageValue = JSON.parse(localStorage.getItem("userDetails")) || null;
  
  const [ownerDetails, setOwnerDetails] = useState([]);
const [ownerBidPrice, setownerBidPrice] = useState(null);


  const socket = useSocket();

  useEffect(() => {
    if (fetchCurrentBidPlayer) {
      //live bidding update
      setPrice(fetchCurrentBidPlayer?.bidAmount);
    }
  }, [fetchCurrentBidPlayer]);

  useEffect(() => {
    socket.on("bid_from_owner", (data) => {
      if (data) {
        const storageValue = JSON.parse(localStorage?.getItem("current_bid_player"));
        const updatedBidAmount = {
          ...storageValue,
          bidAmount: data?.bidAmount,
        };
        localStorage.setItem(
          "current_bid_player",
          JSON.stringify(updatedBidAmount)
        );
        setPrice(data?.bidAmount);
      }
    });
    return () => {
      socket.off("bid_from_owner");
    };
  }, [socket?.id]);

  useEffect(() => {
    fetchOwnerDetails(storageValue?.ownerid)
      .then((result) => {
        // setTeamDetails(result?.teamDetails);
        setOwnerDetails(result?.ownerDetails);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (bidPlayer) {
      setPlayerBidDetail(bidPlayer);
    }
  }, [bidPlayer]);

  const handleBid = async () => {
    const localStorageValue =
      JSON.parse(localStorage.getItem("userDetails")) || null;
    const { ownerDetails } = await fetchOwnerDetails(
      localStorageValue?.ownerid
    );

    if (ownerDetails?.balance <= price) {
      toast.error("Your balace is lower then bid price", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: false,
        theme: "dark",
      });
      return;
    } else {
      const storageValue =
        JSON.parse(localStorage.getItem("userDetails")) || null;

       

        setownerBidPrice(price + incrementFromOwner)
      const payload = {
        ownerId: storageValue?.ownerid,
        ownerName: storageValue?.ownername,
        playerId: playerBidDetail?.playerId,
        playerName: playerBidDetail?.playerName,
        bidAmount: price + incrementFromOwner,
        id: `${socket?.id}${Math.random()}`,
        socketID: socket?.id,
      };
      socket.emit("bid_from_owner", payload);
      setPrice(price + incrementFromOwner);
    }
  };

  const updateOwnerBalace = async() => {
    const localStorageValue =
      JSON.parse(localStorage.getItem("userDetails")) || null;

    const { ownerDetails } = await fetchOwnerDetails(
      localStorageValue?.ownerid
    );
    if(ownerDetails){
      setOwnerDetails(ownerDetails)
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    setClearPlayerDataInAppComponent(null);
    navigate("/");
  };

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Grid
        container
        rowGap={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "rgba(255,255,255,0.9)",
          p: 2,
          borderRadius: "10px",
        }}
      >
        <Grid item xs={6}>
          <Typography
            variant="h4"
            gutterBottom
            className="primary-text-color"
            sx={{ mb: 0, fontWeight:"bold" }}
          >
            Gateway Premier League
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <GplButton text="Logout" onClick={() => handleLogout()} />
        </Grid>
        <Grid item xs={12}>
          <Divider></Divider>
        </Grid>
        <Grid item xs={6}>
          <BlackButton text="Team" onClick={() => navigate("/team")} />
        </Grid>
        <Grid item xs={6} sx={{ textAlign: "right" }}>
          <Typography variant="h5" mb={1}>
            {" "}
            {storageValue?.ownername}{" "}
          </Typography>
          <Typography variant="h5" sx={{ color: "#666" }}>
            {" "}
            Available balance:{" "}
            <span style={{ fontWeight: 700, color: "#ff7a00" }}>
              {ownerDetails?.balance}{" "}
            </span>
          </Typography>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" mt={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {playerBidDetail ? (
                <Paper
                  elevation={0}
                  sx={{
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      p: "2em",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={
                        `${backendURL}/api/static/profileimages/${playerBidDetail?.image}` ||
                        image1
                      }
                      alt="Your Image"
                      style={{
                        justifyContent: "center",
                        width: "300px",
                        margin: "2em 0em",
                        borderRadius: "10px",
                        objectFit: "cover",
                        aspectRatio: "1/1.25",
                      }}
                    />
                    <Box
                      ml={5}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "375px",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h3"
                          textAlign="center"
                          fontWeight={700}
                        >
                          {playerBidDetail?.playerName || ""}
                        </Typography>

                        <Typography variant="h4" mt={3}>
                          Base amount:{" "}
                          <span style={{ fontWeight: 600, color: "#ff7a00" }}>
                            {playerBaseAmount}
                          </span>
                        </Typography>

                        <Typography variant="h4" mt={3}>
                          Counter bid:{" "}
                          <span style={{ fontWeight: 600, color: "#ff7a00" }}>
                            {price || 0}
                          </span>
                        </Typography>

                        {/* <Typography variant="h4" mt={3}>
                          My balance:{" "}
                          <span style={{ fontWeight: 600, color: "#ff7a00" }}>
                            {ownerDetails?.balance - price || 0}
                          </span>
                        </Typography> */}

                      </Box>
                      <form>
                        <br />
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={handleBid}
                          sx={{
                            backgroundColor: "#ff7a00",
                            fontWeight: 700,
                            fontSize: "20px",
                            "&:hover": {
                              backgroundColor: "#FF7A00",
                            },
                            "&:active": {
                              backgroundColor: "#FF7A00",
                            },
                          }}
                        >
                          +1000 Bid
                        </Button>
                      </form>
                    </Box>
                  </Box>
                  <Paper
                    sx={{
                      display: "flex",
                      mr: 5,
                      width: "300px",
                      height: "300px",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "150px",
                    }}
                  >
                    <Timer
                      details={playerBidDetail}
                      handleClearTime={() => {
                        setPlayerBidDetail(null);
                        setClearPlayerDataInAppComponent(null);
                        localStorage.removeItem("current_bid_player");
                        updateOwnerBalace()
                      }}
                      player={playerBidDetail}
                    />
                  </Paper>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "70vh",
                  }}
                >
                  <Paper
                    sx={{
                      p: 5,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      borderRadius: "10px",
                    }}
                  >
                    <h1 style={{ fontWeight: 300 }}>
                     <b>{commonMessage}</b>
                    </h1>
                  </Paper>
                </Box>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

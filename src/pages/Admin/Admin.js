import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  Avatar,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { useSocket } from "../../SocketConnection";
import {
  backendURL,
  commonMessage,
  fetchUniqueAndHiggestBid,
  getUpdatedPlayerDetails,
  playerBaseAmount,
  removeSuccessMessageTime,
} from "../../config";
import { toast } from "react-toastify";
import Timer from "../Timer/Timer";
import { fetchUserDetails } from "../../fetchPlayerDetails";
import { fetchAllPlayer } from "../../fetchAllPlayer";
import { v4 as uuidv4 } from "uuid";

export const Admin = () => {
  const navigate = useNavigate();
  const fetchCurrentBidPlayer = JSON.parse(
    localStorage?.getItem("current_bid_player")
  );

  const [allPlayerData, setAllPlayerData] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState({ label: "", id: "" });
  const [playerDetails, setPlayerDetails] = useState(null);
  const [playerBiddingHistory, setPlayerBiddingHistory] = useState(
    JSON.parse(localStorage.getItem("gpl_player_bid_history")) || []
  );
  const [bidStarted, setBidStarted] = useState(false);

  const [wonPlayerMessage, setWonPlayerMessage] = useState(null);
  
  const socket = useSocket();

  useEffect(() => {
    //This will be used for setting up the timer for success message
    if (wonPlayerMessage) {
      const timeout = setTimeout(() => {
        setWonPlayerMessage(""); 
      }, removeSuccessMessageTime);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [wonPlayerMessage]);

  useEffect(() => {
    if (fetchCurrentBidPlayer) {
      fetchUserDetails(fetchCurrentBidPlayer?.playerId).then((result) =>
        setPlayerDetails(result)
      );
    }
  }, []);

  useEffect(() => {
    socket.on("bid_from_owner", (data) => {
      if (data) {
        const currentTime = new Date().toLocaleString();
        setPlayerBiddingHistory((prevState) => {
          const currentBiddingHistory = [...prevState];
          const newObj = {
            ownerName: data?.ownerName,
            playerName: data?.playerName,
            bidAmount: data?.bidAmount,
            time: currentTime,
          };
          currentBiddingHistory.push(newObj);
          localStorage.setItem(
            "gpl_player_bid_history",
            JSON.stringify(currentBiddingHistory)
          );
          return currentBiddingHistory;
        });
      }
    });
    return () => {
      socket.off("bid_from_owner");
    };
  }, [socket?.id]);

  useEffect(() => {
    axios
      .get(`${backendURL}/api/getAllPlayersDetail`)
      .then((result) => {
        setAllPlayerData(result?.data?.data);
        setPlayerNames(getUpdatedPlayerDetails(result?.data?.data));
      })
      .catch((error) => {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: false,
          theme: "dark",
          style: {
            width: 700,
          },
        });
        console.log(error);
      });
  }, []);

  const fetchHiggestBidOfPlayer = async (playerId) => {
    try {
      const result = await axios.post(`${backendURL}/api/assignPlayer`, {
        playerId: playerId,
      });
      const playerData = result?.data?.data;
      const allPlayersData = await fetchAllPlayer();
      if (result?.data?.statusCode === 200) {
        if (Object.keys(playerData).length !== 0) {
          const updatedList = playerNames?.filter(
            (item) => item?.id !== playerData?.playerId
          );
          setPlayerNames(updatedList);
          setWonPlayerMessage(`${playerData?.ownerName} won player ${playerData?.playerName} with bid : ${playerData?.bidPrice}`);
        }
        setBidStarted(false);
        resetSelectedPlayerAndAmount();
      }
      setAllPlayerData(allPlayersData);
      setPlayerNames(getUpdatedPlayerDetails(allPlayersData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBid = async () => {
    setBidStarted(true);
    try {
      const payload = {
        playerId: selectedPlayer.id,
        baseAmount: playerBaseAmount,
      };
      const result = await axios.put(
        `${backendURL}/api/updatePlayerBasePrice`,
        payload
      );
      if (result?.data?.statusCode === 200) {
        const filteredPlayer = allPlayerData?.filter(
          (item) => item?.playerId === selectedPlayer?.id
        )?.[0];
        socket.emit("bidStarted", {
          playerName: selectedPlayer?.label,
          playerId: selectedPlayer?.id,
          image: filteredPlayer?.playerImage,
          bidAmount: playerBaseAmount,
          id: `${socket.id}${Math.random()}`,
          socketID: socket.id,
        });

        const result = await fetchUserDetails(selectedPlayer?.id);
        localStorage.setItem("player_bid_from_admin", JSON.stringify(result));
        setPlayerDetails(result);
      }
    } catch (error) {
      setBidStarted(false);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: false,
        theme: "dark",
        style: {
          width: 700,
        },
      });
      console.log("An error occur", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const resetSelectedPlayerAndAmount = () => {
    setSelectedPlayer({ label: "", id: "" });
  };

  const handleDropdownChange = (event, newValue) => {
    setSelectedPlayer(newValue);
  };

  const latestBid = playerBiddingHistory.sort(
    (a, b) => b?.bidAmount - a?.bidAmount
  )?.[0];

  const AdminHeader = () => {
    return (
      <div style={{ margin: "1em" }}>
        <Grid
          container
          sx={{
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.9)",
            p: 2,
            borderRadius: "10px",
          }}
        >
          <Grid item xs={3}>
            <Box display="flex" justifyContent="center">
              <Typography variant="h5" className="primary-text-color" sx={{fontWeight:"bold"}}>
              Gateway Premier League
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="center">
              <Autocomplete
                // isOptionEqualToValue
                sx={{ width: "25em" }}
                size="small"
                id="dropdown"
                options={playerNames || []}
                value={selectedPlayer}
                disabled={bidStarted}
                onChange={handleDropdownChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Player"
                    variant="outlined"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                disabled={selectedPlayer?.label === "" || !selectedPlayer || bidStarted}   
                onClick={handleBid}
                sx={{
                  backgroundColor: "#ff7a00",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#FF7A00",
                  },
                  "&:active": {
                    backgroundColor: "#FF7A00",
                  },
                }}
              >
                BID
              </Button>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={() => handleLogout()}
                sx={{
                  backgroundColor: "#ff7a00",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "#FF7A00",
                  },
                  "&:active": {
                    backgroundColor: "#FF7A00",
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  };

  const LeftSideComponent = () => {
    return (
      <Grid item xs={4}>
        <Paper
          style={{
            height: "100%",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "10px",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Avatar
              alt="User Avatar"
              src={
                `${backendURL}/api/static/profileimages/${playerDetails?.image}` ||
                "/path-to-image.jpg"
              }
              // src="/path-to-image.jpg"
              style={{
                width: "200px",
                height: "250px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box sx={{ justifyContent: "center", alignContent: "center", mt: 3 }}>
            <Typography
              nowrap
              variant="h2"
              style={{
                color: "#333",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "2.5em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textWrap: "nowrap",
              }}
            >
              {playerDetails?.fullName}
            </Typography>

            <Typography
              mt={5}
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Age</span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.age}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Highest Score </span>
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.highestRunScoreInLast3Months || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Highest Wicket </span>
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.HighestWicketTakeninLast3Months || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Rating as Bowler </span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.rateYourselfAsABowler || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Rating as Batsmen </span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.rateYourselfAsABetter || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Role </span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.role || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Bowling Style </span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.bowlingStyle || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Batting Style </span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.battingStyle || "-"}
              </span>
            </Typography>
            <Typography
              variant="h5"
              style={{
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Work Location </span>{" "}
              <span style={{ color: "#333", fontWeight: 500 }}>
                {playerDetails?.workLocation || "-"}
              </span>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    );
  };

  const MiddleComponent = () => {
    return (
      <Grid item xs={4}>
        <Paper
          style={{
            height: "100%",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "10px",
            justifyContent: "center",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
            <Paper
              elevation={2}
              sx={{
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h1" component="div">
                <Timer
                  details={playerDetails}
                  handleClearTime={() => {
                    setPlayerDetails(null);
                    setPlayerBiddingHistory([]);
                    localStorage.removeItem("player_bid_from_admin");
                  }}
                  player={selectedPlayer}
                  fetchHiggestBidOfPlayer={(id) => fetchHiggestBidOfPlayer(id)}
                />
              </Typography>
            </Paper>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography variant="h4" sx={{ py: 5 }}>
              <h4>Latest Bid : {latestBid?.bidAmount || "N/A"}</h4>
            </Typography>
          </Box>
        </Paper>
      </Grid>
    );
  };

  const RightComponent = () => {
    return (
      <Grid item xs={4}>
        <Paper
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            height: "88vh",
            borderRadius: "10px",
            justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <div style={{ flex: 1, maxHeight: "100%" }}>
            <TableContainer sx={{ height: "100%" }}>
              <Table sx={{ overflowY: "auto" }}>
                <TableHead sx={{ position: "sticky", top: 0 }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "#ccc",
                        fontSize: "16px",
                      }}
                    >
                      Owner name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        backgroundColor: "#ccc",
                        fontSize: "16px",
                      }}
                    >
                      Bid price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {playerBiddingHistory.slice(0, 20).map((item) => (
                    <TableRow key={uuidv4()}>
                      <TableCell sx={{ fontSize: "16px" }}>
                        {item?.ownerName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "16px", fontWeight: 600 }}>
                        {item?.bidAmount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Paper>
      </Grid>
    );
  };

  return (
    <>
      <AdminHeader />
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 16px",
        }}
      >
        {playerDetails ? (
          <Grid container spacing={3} style={{}}>
            <LeftSideComponent />
            <MiddleComponent />
            <RightComponent />
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            style={{ alignItems: "center", color: "#fff" }}
          >
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
                <b>{wonPlayerMessage  ||  commonMessage}</b>
                </h1>
              </Paper>
            </Box>
          </Grid>
        )}
      </div>
    </>
  );
};

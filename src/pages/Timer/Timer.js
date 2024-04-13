import React, { useEffect, useState } from "react";
import { Typography, Box, Paper } from "@mui/material";
import { timerSeconds } from "../../config";

const getDifference = (storedTime, currentTime) => {
  const storedTimeParts = storedTime.split(":");
  const currentTimeParts = currentTime.split(":");
  // Convert the minutes and seconds to numbers
  const storedMinutes = parseInt(storedTimeParts[0]);
  const storedSeconds = parseInt(storedTimeParts[1]);

  const currentMinutes = parseInt(currentTimeParts[0]);
  const currentSeconds = parseInt(currentTimeParts[1]);

  // Calculate the time difference in seconds
  const storedTotalSeconds = storedMinutes * 60 + storedSeconds;
  const currentTotalSeconds = currentMinutes * 60 + currentSeconds;

  const timeDifferenceInSeconds = currentTotalSeconds - storedTotalSeconds;

  // Now you have the time difference in seconds
  return timeDifferenceInSeconds;
};

const getTimeForBid = () => {
  const storedTime = localStorage.getItem("current_bid_player_time");
  if (storedTime) {
    const currentDate = new Date();
    const currentTime =
      currentDate?.getMinutes() + ":" + currentDate?.getSeconds();

    const differenceInSeconds = getDifference(storedTime, currentTime);
    return differenceInSeconds;
  }
};

const Timer = (props) => {
  const [timer, setTimer] = useState(timerSeconds);
  const [userDetails, setUserDetails] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);

  useEffect(() => {
    if (getTimeForBid() < timerSeconds) {
      setTimer(timer - getTimeForBid());
    }
  }, []);

  useEffect(() => {
    if (props?.details) {
      setUserDetails(props?.details);
    }
  }, [props?.details]);

  useEffect(() => {
    if (props?.player) {
      setPlayerDetails(props?.player);
    }
  }, [props?.player]);

  const removeTimerRelatedStuff = () => {
    localStorage.removeItem("current_bid_player");
    localStorage.removeItem("current_bid_player_time");
    localStorage.removeItem("gpl_player_bid_history");
    const { isAdmin } = JSON.parse(localStorage.getItem("userDetails")) || null;
    setUserDetails(null);
    if (isAdmin === 1) {
      const playerId = playerDetails?.id;
      props?.fetchHiggestBidOfPlayer(playerId);
    }
    props?.handleClearTime();
    setTimer(timerSeconds);
  };

  useEffect(() => {
    let interval = null;
    if (userDetails) {
      interval = setInterval(() => {
        const result = getTimeForBid();
        if (result >= timerSeconds) {
          removeTimerRelatedStuff();
        }
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [userDetails]);

  useEffect(() => {
    if (timer === 0) {
      removeTimerRelatedStuff();
    }
  }, [timer]);

  return (
    <>
      <Box sx={{ }}>
        <Typography variant="h2" fontWeight="bold" textAlign="center" sx={{color:"#ff7a00"}}>
          {timer}
        </Typography>
      </Box>
    </>
  );
};

export default Timer;

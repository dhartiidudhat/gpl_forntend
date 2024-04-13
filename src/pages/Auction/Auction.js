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
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Auction = () => {
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  // const [timer, setTimer] = useState(30);
  
  const handleBid = () => {
    const payload = {
      price: price,
    };

    // axios.post(``, payload).then((response) => {
    //   console.log(response);
    // });
  };

  
// timeout
// useEffect(() => {
//   if (timer > 0) {
//     const interval = setInterval(() => {
//       setTimer((prevTimer) => prevTimer - 1);
//     }, 1000);

//     return () => clearInterval(interval);
//   } else {
//     // Reset the timer to 30 seconds when it reaches 0
//     setTimer(30);
//   }
// }, [timer]); // Add timer as a dependency to the useEffect

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom className="primary-text-color">
          Gateway Premier League
        </Typography>
        <GplButton text="Logout" onClick={() => navigate("/")} />
      </Grid>

      <Grid marginTop="2em" container spacing={2}>
        <Grid item>
          <BlackButton text="Team" onClick={() => navigate("owner/:team")} />
        </Grid>
        <Grid item>
          <BlackButton text="Auction" onClick={() => navigate("/auction")} />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "right", mb: "1em" }}>
        <Typography variant="h5">Owner1</Typography>
      </Box>

      <Divider />

      <Grid container justifyContent="space-between" mt={2}>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Paper
                elevation={0}
                sx={{
                  width: "60em",
                  background: "#E6E6E6",
                  borderRadius: "2em",
                }}
              >
                <Box
                  sx={{
                    p: "2em",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h3" textAlign="center">
                    Virat Kholi
                  </Typography>
                  <img
                    src={image1}
                    alt="Your Image"
                    style={{
                      justifyContent: "center",
                      width: "15em",
                      margin: "2em 0em",
                    }}
                  />

                  <form>
                    <TextField
                      label="Enter Price"
                      fullWidth
                      type="number"
                      margin="normal"
                      variant="outlined"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={price === ""}
                      onClick={handleBid}
                    >
                      Bid
                    </Button>
                  </form>
                </Box>
              </Paper>
            </Grid>

            <Grid item sx={{ ml: 8 }}>
              <Paper
                elevation={0}
                sx={{
                  width: "20em",
                  background: "#E6E6E6",
                  borderRadius: "2em",

                  mt: "1em 2em",
                  p: "1em 0.5em",
                  mb: "5em",
                }}
              >
                <Box sx={{ m: "4em" }}>
                  <Typography variant="h6" fontWeight="bold" textAlign="center">
                    Remaining Time
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" textAlign="center">
                    {timer} Sec
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  width: "20em",
                  background: "#E6E6E6",
                  borderRadius: "2em",
                  mt: "1em 2em",
                  p: "1em 0.5em",
                }}
              >
                <Box sx={{ m: "4em" }}>
                  <Typography variant="h6" fontWeight="bold" textAlign="center">
                    Available Balance
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" textAlign="center">
                    18000
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};



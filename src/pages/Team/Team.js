import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Divider,
  Paper,
  Stack,
} from "@mui/material";
import { GplButton } from "../../component/Button/GplButton";
import { BlackButton } from "../../component/Button/BlackButton";
import image1 from "../../images/cricket.svg";
import { useNavigate } from "react-router-dom";
import { backendURL, ownerTotalBalance} from '../../config';
import { fetchOwnerDetails } from "../../fetchOwnerDetails";
import { v4 as uuidv4 } from "uuid";

export const Team = () => {
  const navigate = useNavigate();
  const storageValue = JSON.parse(localStorage.getItem("userDetails")) || null;
  const [teamDetails, setTeamDetails] = useState([]);
  const [ownerDetails, setOwnerDetails] = useState([]);

  useEffect(() => {
    fetchOwnerDetails(storageValue?.ownerid)
      .then((result) => {
        setTeamDetails(result?.teamDetails);
        setOwnerDetails(result?.ownerDetails);
      })
      .catch((err) => { console.error(err)});
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

 
  return (
    <Container maxWidth="xl" sx={{ marginY: 3 }}>
      <Grid container rowGap={2} justifyContent="space-between" alignItems="center" sx={{backgroundColor:"rgba(255,255,255,0.9)", p:2, borderRadius:"10px"}}>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom className="primary-text-color" sx={{mb:0, fontWeight:"bold"}}>
          Gateway Premier League
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{textAlign:"right"}}>
          <GplButton text="Logout" onClick={() => handleLogout()} />
        </Grid>
        <Grid item xs={12}>
          <Divider></Divider>
        </Grid>
        <Grid item xs={6}>
        <BlackButton
          text="Auction"
          onClick={() => navigate(`/owner/${storageValue?.ownerid}`)}
        />
        </Grid>        
      </Grid>    
    <Grid container sx={{ marginTop: 3 }} spacing={2} >
      
      <Grid item justifyContent="space-between" lg={8} sx={{height:"75vh", overflow:"auto", pr:1}} >
        { teamDetails &&  teamDetails?.map((teamItem, i) => (
          <Grid item key={uuidv4()} lg={12} marginBottom={2}>
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                background: "rgba(255,255,255,0.9)",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    `${backendURL}/api/static/profileimages/${teamItem?.image}` ||
                    image1
                  }
                  alt="Your Image"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "10px 0 0 10px",
                    objectFit:"cover",
                    objectPosition:"top center",
                    aspectRatio:"1/1"
                  }}
                />
                <Box p={2} sx={{display:"flex", justifyContent:"space-between", width:"100%", ml:2}}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold">
                      {teamItem?.fullName}
                    </Typography>                  
                    <Typography
                      variant="body1"
                      sx={{ color: "#333", fontWeight: "bold", mt:3 }}
                    >
                      {teamItem?.battingStyle} / {teamItem?.bowlingStyle}
                    </Typography>
                  </Box>
                  <Box >
                    <Typography variant="h5" fontWeight="bold" sx={{color:"#FF7A00"}}>
                      {teamItem?.isCaption ? 'Captain' :  teamItem?.sellPrice}
                    </Typography>
                  </Box>
                </Box>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid item sx={{ maxWidth: "300px" }} lg={4}>
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            background: "rgba(255,255,255,0.9)",
            borderRadius: "10px",
            marginTop: "0.5em 2em",
            padding: "1em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Summary
          </Typography>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6">Team Name</Typography>
            <Typography variant="h6">{ownerDetails?.teamname}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6">Team Member</Typography>
            <Typography variant="h6">{ownerDetails?.teammember}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6">Team OwnerName</Typography>
            <Typography variant="h6">{ownerDetails?.ownername}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6">Team Co-OwnerName</Typography>
            <Typography variant="h6">{ownerDetails?.coownername}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{ownerTotalBalance}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6">Bidding</Typography>
            <Typography variant="h6">
              {ownerDetails?.bid_amount}
            </Typography>
          </Stack>
          <Divider sx={{mt:1}}></Divider>
          <Stack direction="row" spacing={2} sx={{ marginTop: "0.5em", display:"flex", justifyContent:"space-between" }}>
            <Typography variant="h6" fontWeight="bold">
              Remaining
            </Typography>
            <Typography variant="h6" fontWeight="bold">{ownerDetails?.balance}</Typography>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  </Container>
  );
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendURL } from "../../config";
import "../../style/style.css";

const centerStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "60%",
};

export const Login = () => {
  const [name, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    const payload = {
      ownername: name,
      password,
    };

    axios
      .post(`${backendURL}/api/auth/login`, payload)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          localStorage.setItem(
            "userDetails",
            JSON.stringify(response?.data?.data)
          );
          if (response?.data?.data?.isAdmin === 1) {
            navigate("/admin");
          } else if (response?.data?.data?.isAdmin === 0) {
            navigate(`/owner/${response?.data?.data?.ownerid}`);
          } else {
            navigate("/");
          }
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          pauseOnHover: false,
          theme: "dark",
        });
        console.log("An error occur", error);
      });
  };

  useEffect(() => {
    const storageValue =
      JSON.parse(localStorage.getItem("userDetails")) || null;

    if (storageValue) {
      const { isAdmin, ownerid } = storageValue;

      if (isAdmin === 1) {
        navigate("/admin");
      } else if (isAdmin === 0) {
        navigate(`/owner/${ownerid}`);
      } else {
        navigate("/");
      }
    }
  }, []);

  const handlePasswordKeyPress = (event) => {
    if (event.key === "Enter" && name && password) {
      handleLogin();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          width: "50%",
          backgroundColor: "rgba(0,0,0,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="logo"></div>
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={centerStyle}>
          <Container
            maxWidth="sm"
            sx={{
              background: "rgba(255,255,255,0.9)",
              py: 3,
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Gateway Premier League
            </Typography>
            <form>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                variant="outlined"
                name="name"
                value={name}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
              <TextField
                type="password"
                label="Password"
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyDown={handlePasswordKeyPress}
              />
              <Button
                variant="contained"
                color="primary"
                style={{ padding: "10px" }}
                fullWidth
                disabled={name === "" || password === ""}
                onClick={handleLogin}
                sx={{
                  backgroundColor: "#FF7A00",
                  fontWeight: 700,
                  fontSize: "18px",
                  mt: 2,
                  "&:hover": {
                    backgroundColor: "#FF7A00",
                  },
                  "&:active": {
                    backgroundColor: "#FF7A00",
                  },
                }}
              >
                Login
              </Button>
            </form>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 5,
              }}
            >
              <Typography sx={{ mr: 2 }}>Powered by</Typography>
              <div className="logos"></div>
            </Box>
          </Container>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

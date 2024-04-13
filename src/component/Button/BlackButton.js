import Button from "@mui/material/Button";
import React from "react";

export const BlackButton = ({ text, onClick }) => {
  return (
    <>
      <Button
        size="medium"
        variant="outlined"
        sx={{          
          fontWeight:"bold",
          fontSize:'1.3em',
          borderColor:"#ff7a00",
          color:"#ff7a00",
          backgroundColor:"#fff",
          "&:hover": {
            backgroundColor: "#FF7A00",
            color: "#fff",
            borderColor:"#FF7A00",
          },
          "&:active": {
            backgroundColor: "#FF7A00",
          },
        }}
        onClick={onClick}
      >
        {text}
      </Button>
    </>
  );
};

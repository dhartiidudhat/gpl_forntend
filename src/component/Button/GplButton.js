import Button from "@mui/material/Button";
import React from "react";

export const GplButton = ({ text , onClick }) => {
  return (
    <>
      <Button
        variant="contained"
        size="medium"
        sx={{
          backgroundColor: "#FF7A00",
          color: "white",
          fontWeight: "bold",
          fontSize: "1em",
          "&:hover": {
            backgroundColor: "#FF7A00",
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

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = (props) => {
  const { Component, bidPlayer, setClearPlayerDataInAppComponent } = props;
  const navigate = useNavigate();
  const storageValue = JSON.parse(localStorage.getItem("userDetails")) || null;

  useEffect(() => {
    if (storageValue) {
      const { isAdmin, ownerid } = storageValue;
      if (isAdmin === 1) {
        navigate("/admin");
      } else if (isAdmin === 0) {
        navigate(`/owner/${ownerid}`);
      }
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Component
        bidPlayer={bidPlayer}
        setClearPlayerDataInAppComponent={setClearPlayerDataInAppComponent}
      />
    </>
  );
};

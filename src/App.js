import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Team } from "./pages/Team/Team";
import "././style/style.css";
import { Admin } from "./pages/Admin/Admin";
import { Owner } from "./pages/Owner/Owner";
import { ProtectedRoute } from "./pages/Route/ProtectedRoute";
import { useEffect, useState } from "react";
import { useSocket } from "./SocketConnection";

function App() {
  const [playerBidDetail, setPlayerBidDetail] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    socket.on("currentPlayerForBid", (data) => {
      const currentDate = new Date();
      const currentTime =
        currentDate?.getMinutes() + ":" + currentDate?.getSeconds();
      setPlayerBidDetail(data);
      localStorage.setItem("current_bid_player", JSON.stringify(data));
      localStorage.setItem("current_bid_player_time", currentTime);
    });

    return () => {
      socket.off("currentPlayerForBid");
    };
  }, [socket]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin" element={<ProtectedRoute Component={Admin} />} />
          <Route
            path="/owner/:ownerid"
            element={
              <ProtectedRoute
                Component={Owner}
                bidPlayer={playerBidDetail}
                setClearPlayerDataInAppComponent={() =>
                  setPlayerBidDetail(null)
                }
              />
            }
          />
          <Route path="/team" element={<Team />} />
          <Route path="/*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

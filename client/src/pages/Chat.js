import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { api } from "../api/api";
import { AuthContext } from "../context/authContext";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/SideDrawer";

const Chat = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;

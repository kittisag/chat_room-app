import React, { useState } from "react";
import styled from "styled-components";

import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import { GET_ROOMS, GET_USERS, SEND_MESSAGE } from "../constants/graphQL";
import TextArea from "antd/es/input/TextArea";

const StyledWrapper = styled.div`
  font-family: "Prompt", sans-serif !important;
  h1 {
    margin-top: -8px;
    margin-bottom: -20px;
  }

  .chat-container {
    background: #f8f8f8;
    padding: 20px;
  }

  .chat-section {
    width: auto;
  }

  .message-box {
    display: inline-block;
    background: #e8e8e8;
    padding: 12px;
    border-radius: 16px;
  }

  .chat-input {
    .ant-input {
      font-family: "Prompt", sans-serif !important;
    }
  }

  .returnHome {
    text-align: center;
    margin-top: 8px;
    font-size: 18px;
    font-family: "Prompt", sans-serif;
    border: none;
    background: none;
    color: #4e4e4e;
  }

  .title-user {
    font-size: 14px;
  }
`;

const ChatRoom = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const { data } = useQuery(GET_ROOMS, {
    pollInterval: 2000,
  });
  const { data: usersData } = useQuery(GET_USERS);
  const currentRoom = data?.chatRooms.find((room) => room.name === state.room);

  const [SendMessage] = useMutation(SEND_MESSAGE);

  const matchUserID =
    usersData && usersData?.users.find((user) => user.name === state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkUserMatch = matchUserID ? matchUserID?.id : "1";

    const { data } = await SendMessage({
      variables: {
        roomId: currentRoom?.id,
        userId: checkUserMatch,
        message: message,
      },
    });

    window.location.reload(false);
  };

  return (
    <StyledWrapper>
      <h1> ห้อง {currentRoom?.name} </h1>
      <br />
      <div className="chat-container">
        {currentRoom?.messages.map((data) => (
          <div key={data.id}>
            <div
              className="chat-section"
              style={
                data.user.id === matchUserID?.id
                  ? { textAlign: "right" }
                  : { textAlign: "left" }
              }
            >
              <span className="title-user">
                คุณ {data.user.name} <br />
              </span>
              <div
                className="message-box"
                style={
                  data.user.id === matchUserID?.id
                    ? { background: "#b31315", color: "white" }
                    : { background: "#e8e8e8" }
                }
              >
                {data.text}
              </div>
            </div>
          </div>
        ))}
        <label>
          Enter Message:
          <TextArea
            className="chat-input"
            placeholder="Enter เพื่อส่ง"
            showCount
            maxLength={100}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onPressEnter={handleSubmit}
          />
        </label>
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="returnHome" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </StyledWrapper>
  );
};

export default ChatRoom;

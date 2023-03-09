import React from "react";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { CREATE_CHAT_ROOM, CREATE_USER, GET_ROOMS } from "../constants/graphQL";

const StyledWrapper = styled.div`
  text-align: center;

  .create-name-section {
  }

  .input-title {
    font-size: 37px;
    color: #383838;
  }

  .input-field {
    text-align: center;
    width: 450px;
    height: 60px;
    color: #4e4e4e;
    border: 3px solid lightgray;
    border-radius: 10px;
    font-size: 34px;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  .create-button-name {
    font-family: "Prompt", sans-serif;
    width: auto;
    color: #ffffff;
    background-image: radial-gradient(
      ellipse farthest-corner at top left,
      #c41417 0%,
      #b31315 100%
    );
    margin-top: 24px;
    border: none;
    font-size: 27px;
    padding: 8px 20px 8px 20px;
    border-radius: 12px;
  }

  .create-button-room {
    display: ${(props) => (props?.hideTitle ? "none" : "")};
    font-family: "Prompt", sans-serif;
    width: auto;
    color: #ffffff;
    background-image: radial-gradient(
      ellipse farthest-corner at top left,
      #c41417 0%,
      #b31315 100%
    );
    margin-top: 24px;
    border: none;
    font-size: 27px;
    padding: 16px 48px 16px 48px;
    border-radius: 8px;
  }

  .join-chat-button {
    margin-top: 8px;
    font-size: 27px;
    font-family: "Prompt", sans-serif;
    border: none;
    background: none;
    color: #4e4e4e;
  }

  .greeting-title {
    font-size: 32px;
    font-weight: 500;
  }

  .fadeIn {
    animation: fadeIn 1s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

function CreateChatRoom() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [type, setType] = useState("");
  const [createdName, setCreatedName] = useState(null);

  const [isCreatRoomStep, setCreatRoomStep] = useState(false);
  const [isCreatingName, setIsCreatingName] = useState(false);

  const [createChatRoom] = useMutation(CREATE_CHAT_ROOM);
  const [createUser] = useMutation(CREATE_USER);

  const { data: roomsData, loading } = useQuery(GET_ROOMS);

  const title = type === "create" ? "สร้างห้อง" : "เข้าร่วมห้อง";

  if (loading) return <p>Loading...</p>;

  const handleCreateUser = async (e) => {
    const { data } = await createUser({
      variables: { name: name },
    });
    setCreatedName({ data });
    setIsCreatingName(true);
  };

  const handleCreateOrJoin = (value) => {
    setType(value);
    setCreatRoomStep(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const { data } = await createChatRoom({
      variables: { roomName: roomName, user: name },
    });

    const roomId = data.createChatRoom.id;
    navigate(`/chat-room/${roomId}`, {
      state: { user: name, room: roomName },
    });
    window.location.reload(false);
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    let getRoomId = [];
    if (roomsData?.chatRooms.find((room) => room.name === roomName)) {
      getRoomId = roomsData?.chatRooms.find((room) => room.name === roomName);
      navigate(`/chat-room/${getRoomId.id}`, {
        state: { user: name, room: roomName },
      });
    } else {
      alert("Room Not Found");
    }
  };

  return (
    <StyledWrapper hideTitle={isCreatRoomStep}>
      {!isCreatingName && (
        <div className="create-name-section">
          <div className={!isCreatingName ? "fadeIn" : "fadeOut"}>
            <label>
              <span className="input-title">ชื่อของคุณ</span>
              <br />
              <input
                className="input-field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          {name && (
            <div className={name ? "fadeIn" : "fadeOut"}>
              <button
                className="create-button-name"
                onClick={(e) => handleCreateUser()}
              >
                ยืนยัน
              </button>
            </div>
          )}
        </div>
      )}
      {isCreatingName && (
        <div className={isCreatingName ? "fadeIn" : "fadeOut"}>
          <div className="greeting-title">
            {!isCreatRoomStep && `คุณ ${name}`}
            {isCreatRoomStep && title}
          </div>
          <button
            className="create-button-room"
            onClick={() => handleCreateOrJoin("create")}
          >
            สร้างห้องใหม่
          </button>
          <br />
          {!isCreatRoomStep && (
            <button
              className="join-chat-button"
              type="submit"
              onClick={() => handleCreateOrJoin("join")}
            >
              เข้าร่วมแชท
            </button>
          )}
          <br />
          {isCreatRoomStep && (
            <>
              <label>
                <input
                  className="input-field"
                  type="text"
                  value={roomName}
                  placeholder="ชื่อห้อง"
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </label>
              <br />
              {roomName && (
                <div className={roomName ? "fadeIn" : "fadeOut"}>
                  <button
                    className="join-chat-button"
                    onClick={(e) => setCreatRoomStep(false)}
                  >
                    กลับ
                  </button>
                  <button
                    className="create-button-name"
                    type="submit"
                    onClick={
                      type === "create"
                        ? (e) => handleCreateRoom(e)
                        : (e) => handleJoinRoom(e)
                    }
                  >
                    ยืนยัน
                  </button>
                </div>
              )}
            </>
          )}
          <br />
        </div>
      )}
    </StyledWrapper>
  );
}

export default CreateChatRoom;

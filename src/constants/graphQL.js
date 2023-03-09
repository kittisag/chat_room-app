import { gql } from "@apollo/client";

export const CREATE_CHAT_ROOM = gql`
  mutation CreateChatRoom($roomName: String!, $user: String!) {
    createChatRoom(roomName: $roomName, user: $user) {
      id
      name
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($roomId: ID!, $userId: ID!, $message: String!) {
    sendMessage(roomId: $roomId, userId: $userId, message: $message) {
      id
      text
      user {
        id
        name
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!) {
    createUser(name: $name) {
      id
      name
    }
  }
`;

export const GET_ROOMS = gql`
  query {
    chatRooms {
      id
      name
      users {
        id
        name
      }
      messages {
        id
        text
        user {
          id
          name
        }
      }
    }
  }
`;

export const GET_USERS = gql`
  query {
    users {
      id
      name
    }
  }
`;

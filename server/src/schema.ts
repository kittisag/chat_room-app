import { makeExecutableSchema } from "@graphql-tools/schema";

const typeDefinitions = /* GraphQL */ `
  type Query {
    # Get a list of all available chat rooms
    chatRooms: [ChatRoom!]!

    users: [User!]!
  }

  type Mutation {
    # Create a new chat room
    createChatRoom(roomName: String!, user: String!): CreateChatRoom!

    # Send a message to a chat room

    sendMessage(roomId: ID!, userId: ID!, message: String!): Message!

    createUser(name: String!): [User!]!
  }

  type Subscription {
    # Listen for new messages in the current chat room
    newMessage: Message!
  }

  type ChatRoom {
    id: ID!
    name: String!
    users: User!
    messages: [Message!]!
  }

  type CreateChatRoom {
    id: ID!
    name: String!
    users: User!
    messages: [Message!]!
  }

  type User {
    id: ID!
    name: String!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

const chatRooms: any[] = [
  {
    id: "room1",
    name: "General",
    users: {
      id: "user1",
      name: "John",
    },
    messages: [],
  },
];

const users: any[] = [
  {
    id: "1",
    name: "Unnamed User",
  },
  {
    id: "2",
    name: "Ben",
  },
];

const resolvers = {
  Query: {
    chatRooms: () => chatRooms,
    users: () => users,
  },
  Mutation: {
    createChatRoom: (
      parent: unknown,
      args: { roomName: string; user: string }
    ) => {
      let idCount = chatRooms.length;

      const users = { id: "1", name: args.user };

      const chatRoom = {
        id: String(idCount),
        name: args.roomName,
        users: users,
        messages: [],
      };

      chatRooms.push(chatRoom);
      return chatRoom;
    },
    createUser: (parent: unknown, args: { name: string }) => {
      const user = {
        id: String(users.length + 1),
        name: args.name,
      };

      users.push(user);
      return users;
    },
    sendMessage: (
      parent: unknown,
      args: { roomId: string; userId: string; message: string }
    ) => {
      const chatRoom = chatRooms.find(
        (chatRoom) => chatRoom.id === args.roomId
      );

      const matchUser = users.find((user) => user.id === args.userId);

      const message = {
        id: String(chatRoom.messages.length + 1),
        text: args.message,
        user: {
          id: matchUser.id,
          name: matchUser.name,
        },
      };

      chatRoom.messages.push(message);
      return message;
    },
  },
};

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions],
});

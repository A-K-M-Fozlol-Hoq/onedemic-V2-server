let users = [];

const addUser = ({ id, userId, room }) => {
  const existingUser = users.find(
    (user) => user.userId === userId && user.room === room
  );

  if (existingUser) {
    return { error: "User already exists!" };
  }

  const user = {
    id,
    userId,
    room,
  };

  users.push(user);

  return user;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUserById = (id) => {
  const user = users.find((user) => user.id === id);
  return user;
};

const getRoomUsers = (room) => {
  const roomUsers = users?.filter(
    (user) => user?.room?.trim()?.toLowerCase() === room?.trim()?.toLowerCase()
  );
  console.log({ roomUsers, room, users });
  return roomUsers;
};

module.exports = {
  addUser,
  removeUser,
  getUserById,
  getRoomUsers,
};

import socketio from "socket.io";
import * as uuid from "uuid";

const io = socketio(1234);

io.on("connection", socket => {
  const id = uuid.v4();
  socket.on("mouse", event => {
    const { x, y } = event;
    socket.broadcast.volatile.emit("mouse", { x, y, id });
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("remove", { id });
  });
});

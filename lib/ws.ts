let socket: WebSocket | null = null;
let myId: number | null = null;

export function connectWS() {
  if (socket) return socket;

  socket = new WebSocket("ws://localhost:3001");

  socket.onopen = () => console.log("WS connected to backend");

  socket.onclose = () => {
    console.log("WS closed");
    socket = null;
  };

  return socket;
}

export function onWSMessage(handler: (data: any) => void) {
  if (!socket) return;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // store myId when received
    if (data.yourId) {
      myId = data.yourId;
    }

    handler({ ...data, myId });
  };
}

export function createRoom() {
  socket?.send(JSON.stringify({ type: "create_room" }));
}

export function joinRoom(code: string) {
  socket?.send(JSON.stringify({ type: "join_room", code }));
}

export function sendToRoom(code: string, payload: any) {
  socket?.send(
    JSON.stringify({
      type: "room_message",
      code,
      payload,
    })
  );
}

// lib/ws.ts
let socket: WebSocket | null = null;
let myId: number | null = null;
let messageHandlers: ((data: any) => void)[] = []; // Array to store multiple handlers

// Helper function to wait until the socket is open
function waitForConnection(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      resolve();
      return;
    }
    if (socket && socket.readyState === WebSocket.CONNECTING) {
      // Wait for the onopen event
      socket.onopen = () => {
        console.log("WS connected to backend");
        resolve();
      };
      // Add error handling
      socket.onerror = (error) => reject(error);
      return;
    }
    // If socket is null or closed, you should probably throw or reconnect here
    reject(new Error("WebSocket is not initialized or is closed."));
  });
}

export function connectWS(): WebSocket {
  if (socket) {
    console.log("Already Socket");
    return socket;
  }
  

  socket = new WebSocket("ws://localhost:3001");

  socket.onclose = () => {
    console.log("WS closed");
    socket = null;
  };

  // The onopen is now handled inside waitForConnection
  // We keep the onmessage handler here to receive all incoming messages
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // Store myId when received (Global state)
    if (data.yourId) {
      myId = data.yourId;
    }

    // Pass data to all registered handlers
    messageHandlers.forEach(handler => handler({ ...data, myId }));
  };

  return socket;
}

// Update onWSMessage to handle multiple component listeners (better practice in React)
export function onWSMessage(handler: (data: any) => void) {
    messageHandlers.push(handler);
    
    // Return a function to remove the handler when the component unmounts
    return () => {
        messageHandlers = messageHandlers.filter(h => h !== handler);
    };
}


// Wrap all send functions to ensure connection is open
async function sendData(data: object) {
  if (!socket) {
    console.error("Attempted to send data but socket is null.");
    return;
  }
  
  // Wait until the connection is open
  await waitForConnection();
  
  socket.send(JSON.stringify(data));
}

export function createRoom() {
  sendData({ type: "create_room" });
}

export function joinRoom(code: string) {
  sendData({ type: "join_room", code });
}

export function sendToRoom(code: string, payload: any) {
  sendData({
    type: "room_message",
    code,
    payload,
  });
}
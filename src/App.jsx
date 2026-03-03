import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://secret-signal-server.onrender.com");

const PASSCODE = "4321";

const cards = [
  "Deployment Error",
  "Pull Request",
  "Merge Conflict",
  "Code Review",
  "Hotfix",
  "Production Bug",
  "Version Update",
  "404 Not Found",
  "Commit Changes",
  "Push to Main",
];

export default function App() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(false);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    socket.on("show_popup", (index) => {
      setPopup(cards[index]);

      setTimeout(() => {
        setPopup(null);
      }, 5000);
    });

    return () => socket.off("show_popup");
  }, []);

  const login = () => {
    if (code === PASSCODE) {
      setAuth(true);
    } else {
      alert("Wrong passcode");
    }
  };

  const sendSignal = (index) => {
    socket.emit("card_click", index);
  };

  if (!auth) {
    return (
      <div style={{ textAlign: "center", marginTop: "200px" }}>
        <h2>Enter Access Key</h2>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <br /><br />
        <button onClick={login}>Enter</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Priya Pradhan</h1>
      <h3>10 Repositories</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 20
      }}>
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => sendSignal(i)}
            style={{
              padding: 20,
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            {card}
          </div>
        ))}
      </div>

      {popup && (
        <div style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "black",
          color: "white",
          padding: 30
        }}>
          🚀 {popup}
        </div>
      )}
    </div>
  );
}
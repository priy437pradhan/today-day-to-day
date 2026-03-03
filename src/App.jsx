import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const PASSCODE = "4321";

const tabs = [
  "Code",
  "Issues",
  "Pull requests",
  "Actions",
  "Projects",
  "Wiki",
  "Security",
  "Insights",
  "Settings",
];

export default function App() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(
    localStorage.getItem("secret_auth") === "true"
  );
  const [activeTab, setActiveTab] = useState("Code");
  const [toast, setToast] = useState(null);
  const [secretReveal, setSecretReveal] = useState(false);
  const [customMsg, setCustomMsg] = useState("");

  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  const socketRef = useRef(null);

  /* ================= SOCKET + NOTIFICATION ================= */
  useEffect(() => {
    if (socketRef.current) return;

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const socket = io("https://todo-day-to-day.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("show_popup", (data) => {
      const message = data.message || data;

      setToast(message);

      // MOBILE + DESKTOP SAFE NOTIFICATION
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg) {
            reg.showNotification("GitHub Notification", {
              
              icon:
                "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            });
          }
        });
      }

      setTimeout(() => {
        setToast(null);
      }, 3000);
    });

    return () => {
      socket.off("show_popup");
      socket.disconnect();
    };
  }, []);

  /* ================= FUNCTIONS ================= */

  const login = () => {
    if (code === PASSCODE) {
      setAuth(true);
      localStorage.setItem("secret_auth", "true");
    } else {
      alert("Wrong passcode");
    }
  };

  const logout = () => {
    localStorage.removeItem("secret_auth");
    setAuth(false);
  };

  const sendSignal = (message) => {
    socketRef.current.emit("card_click", { message });
  };

  const handleTripleTap = () => {
    tapCount.current += 1;

    if (tapCount.current === 3) {
      setSecretReveal(true);
      setTimeout(() => {
        setSecretReveal(false);
        tapCount.current = 0;
      }, 2000);
    }

    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 600);
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa]">
        <div className="bg-white p-8 border rounded-md shadow-md w-full max-w-sm">
          <h2 className="text-center font-semibold mb-6">GitHub Sign In</h2>
          <input
            type="password"
            placeholder="Password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={login}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-md"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#24292f]">
      {/* Header */}
      <div className="bg-[#24292f] text-white px-4 py-3 flex justify-between">
        <div>GitHub</div>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Fake Repo Header */}
        <h1 className="text-2xl font-semibold">
          OTVSUPERAPP / todo-day-to-day
        </h1>

        <div className="text-sm text-gray-500 mt-2">
          Latest commit: <span className="text-blue-600">
            fix: updated deployment script
          </span> · 2 minutes ago
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-6 mt-6 text-sm">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Fake Code */}
        {activeTab === "Code" && (
          <div className="bg-gray-900 text-green-400 p-4 mt-6 text-sm rounded">
{`import React from "react";

function App() {
  return <h1>Todo App</h1>;
}

export default App;`}
          </div>
        )}

        {/* Custom Commit Button */}
        <div className="mt-6 bg-white p-4 border rounded">
          <input
            type="text"
            placeholder="Enter secret message"
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="border px-3 py-2 w-full mb-2"
          />
          <button
            onClick={() => {
              if (customMsg.trim()) {
                sendSignal(customMsg);
                setCustomMsg("");
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Commit Custom Message
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-0 top-4 flex justify-center">
          <div
            onClick={handleTripleTap}
            className="bg-[#24292f] text-white px-5 py-4 rounded-lg cursor-pointer"
          >
            {secretReveal ? toast : "🔔 New Notification"}
          </div>
        </div>
      )}
    </div>
  );
}
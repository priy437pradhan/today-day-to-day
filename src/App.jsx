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

const tabSecretMap = {
  Code: "I miss you ❤️",
  Issues: "Call me",
  "Pull requests": "I’m upset",
  Actions: "Are you free?",
  Projects: "Emergency",
  Wiki: "Come online",
  Security: "I’m happy",
  Insights: "Where are you?",
  Settings: "Love you",
};

const fileSecretMap = {
  "Deployment Error": "I miss you ❤️",
  "Pull Request": "Call me",
  "Merge Conflict": "I’m upset",
  "Code Review": "Are you free?",
  "Hotfix": "Emergency",
  "Production Bug": "Come online",
  "Version Update": "I’m happy",
  "404 Not Found": "Where are you?",
  "Commit Changes": "Good night",
  "Push to Main": "Love you",
};

export default function App() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(
    localStorage.getItem("secret_auth") === "true"
  );
  const [activeTab, setActiveTab] = useState("Code");
  const [toast, setToast] = useState(null);
  const [secretReveal, setSecretReveal] = useState(false);

  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  const socketRef = useRef(null);

  /* ================= SOCKET + NOTIFICATION SETUP ================= */
  useEffect(() => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  socketRef.current = io("https://todo-day-to-day.onrender.com", {
    transports: ["websocket", "polling"],
  });

  const socket = socketRef.current;

  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
  });

  socket.on("show_popup", (data) => {
    const message = data.message || data;

    console.log("🔥 EVENT RECEIVED:", message);

    setToast(message);

    if (Notification.permission === "granted") {
      new Notification("GitHub Notification", {
        
        icon:
          "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      });
    }

    setTimeout(() => {
      setToast(null);
    }, 3000);
  });

  return () => {
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

  /* ================= LOGIN SCREEN ================= */

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fa] px-4">
        <div className="bg-white p-8 border rounded-md shadow-md w-full max-w-sm">
          <h2 className="text-center font-semibold mb-6">
            GitHub Sign In
          </h2>
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

  /* ================= MAIN UI ================= */

  const renderTabContent = () => {
    if (activeTab === "Code") {
      return (
        <div className="bg-white border rounded-md">
          {Object.keys(fileSecretMap).map((file, i) => (
            <div
              key={i}
              onClick={() =>
                sendSignal(fileSecretMap[file])
              }
              className="px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
            >
              {file}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white border rounded-md p-6 text-gray-500 text-center">
        GitHub content placeholder
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#24292f]">

      {/* Top Bar */}
      <div className="bg-[#24292f] text-white px-4 py-3 flex justify-between text-sm">
        <div className="font-semibold">GitHub</div>
        <div className="flex gap-4 items-center">
          <span>OTV</span>
          <button
            onClick={logout}
            className="text-xs opacity-70 hover:opacity-100"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">

        {/* Repo Header */}
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold">
            OTVSUPERAPP / todo-day-to-day
          </h1>
          <span className="text-sm text-gray-500">Public</span>
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-6 text-sm overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                sendSignal(tabSecretMap[tab]);
              }}
              className={`pb-3 whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 font-semibold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed inset-x-0 top-4 flex justify-center md:justify-end md:right-6 z-50 px-4">
          <div
            onClick={handleTripleTap}
            className="w-full max-w-sm md:w-auto bg-[#24292f] text-white px-5 py-4 rounded-lg shadow-xl border border-gray-700 cursor-pointer"
          >
            <div className="text-sm font-semibold mb-1">
              GitHub Notification
            </div>
            <div className="text-sm break-words">
              {secretReveal ? toast : "🔔 New Notification"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("https://todo-day-to-day.onrender.com", {
  transports: ["websocket"],
});

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

const secretMap = {
  Code: "Deployment Error",
  Issues: "Pull Request",
  "Pull requests": "Merge Conflict",
  Actions: "Code Review",
  Projects: "Hotfix",
  Wiki: "Production Bug",
  Security: "Version Update",
  Insights: "404 Not Found",
  Settings: "Push to Main",
};

export default function App() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("Code");
  const [toast, setToast] = useState(null);
  const [secretReveal, setSecretReveal] = useState(false);
  const [showCommitInput, setShowCommitInput] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");

  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  useEffect(() => {
    socket.on("show_popup", (data) => {
      const message =
        typeof data === "object" ? data.message : data;

      setToast(message);

      setTimeout(() => setToast(null), 3000);
    });

    return () => socket.off("show_popup");
  }, []);

  const login = () => {
    if (code === PASSCODE) setAuth(true);
    else alert("Wrong passcode");
  };

  const sendSignal = (msg) => {
    socket.emit("card_click", { message: msg });
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
        <div className="bg-white p-8 border rounded-md shadow-md w-80">
          <h2 className="text-center font-semibold mb-6">
            Code SAP Sign In
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

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#24292f]">

      {/* Top Bar */}
      <div className="bg-[#24292f] text-white px-6 py-3 flex justify-between">
        <div className="font-bold">CODE SAPP</div>
        <div>OTV</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">

        {/* Repo Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">
            priya437pradhan / todo-day-to-day
          </h1>
          <span className="text-sm text-gray-500">Public</span>
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-6 text-sm">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                sendSignal(secretMap[tab]);
              }}
              className={`pb-3 cursor-pointer ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 font-semibold"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Code Tab Content */}
        {activeTab === "Code" && (
          <div className="mt-6">

            {/* Fake Commit Row */}
            <div
              onClick={() => setShowCommitInput(true)}
              className="border bg-white rounded-md p-4 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-medium">
                Priya Pradhan
              </div>
              <div className="text-sm text-gray-500">
                initial backend · 1 hour ago
              </div>
            </div>

            {/* Commit Input */}
            {showCommitInput && (
              <div className="mt-4 bg-white border p-4 rounded-md">
                <textarea
                  placeholder="Commit message..."
                  value={commitMessage}
                  onChange={(e) =>
                    setCommitMessage(e.target.value)
                  }
                  className="w-full border p-2 rounded-md"
                />
                <button
                  onClick={() => {
                    sendSignal(
                      commitMessage || "Commit Changes"
                    );
                    setCommitMessage("");
                    setShowCommitInput(false);
                  }}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Commit changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          onClick={handleTripleTap}
          className="fixed top-6 right-6 bg-white border shadow-md px-6 py-3 rounded-md cursor-pointer"
        >
          {secretReveal ? (
            <span className="text-red-500 font-semibold">
              💌 I Miss You
            </span>
          ) : (
            <>🚀 {toast}</>
          )}
        </div>
      )}
    </div>
  );
}
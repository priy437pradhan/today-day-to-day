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

  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  useEffect(() => {
    socket.on("show_popup", (data) => {
      const message =
        typeof data === "object" ? data.message : data;

      setToast(message);
      setTimeout(() => setToast(null), 10000);
    });

    return () => socket.off("show_popup");
  }, []);
  useEffect(() => {
  if ("Notification" in window) {
    Notification.requestPermission();
  }

  socket.on("show_popup", (data) => {
    const message =
      typeof data === "object" ? data.message : data;

    if (Notification.permission === "granted") {
      new Notification("GitHub Alert", {
        body: message,
      });
    }

    setToast(message);
    setTimeout(() => setToast(null), 10000);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "Code":
        return (
          <div className="bg-white border rounded-md">
            {[".gitignore", "package.json", "server.js"].map(
              (file, i) => (
                <div
                  key={i}
                  className="px-4 py-3 border-b hover:bg-gray-100 cursor-pointer"
                >
                  {file}
                </div>
              )
            )}
          </div>
        );

      case "Issues":
        return (
          <div className="bg-white border rounded-md p-4">
            <div className="border-b pb-2 mb-2 font-medium">
              #12 Fix authentication bug
            </div>
            <div className="text-sm text-gray-500">
              Opened 2 days ago
            </div>
          </div>
        );

      case "Pull requests":
        return (
          <div className="bg-white border rounded-md p-4">
            <div className="font-medium">
              #45 Improve UI responsiveness
            </div>
            <div className="text-sm text-gray-500">
              3 commits
            </div>
          </div>
        );

      case "Actions":
        return (
          <div className="bg-white border rounded-md p-6 text-center text-gray-500">
            Workflow runs will appear here.
          </div>
        );

      case "Projects":
        return (
          <div className="bg-white border rounded-md p-6 text-center">
            Project board coming soon.
          </div>
        );

      case "Wiki":
        return (
          <div className="bg-white border rounded-md p-6">
            <div className="font-medium">
              Getting Started Guide
            </div>
          </div>
        );

      case "Security":
        return (
          <div className="bg-white border rounded-md p-6 text-red-500">
            No vulnerabilities found.
          </div>
        );

      case "Insights":
        return (
          <div className="bg-white border rounded-md p-6 text-center">
            📊 Traffic graph placeholder
          </div>
        );

      case "Settings":
        return (
          <div className="bg-white border rounded-md p-6">
            <label className="block text-sm mb-2">
              Repository name
            </label>
            <input
              className="border p-2 w-full rounded-md"
              defaultValue="todo-day-to-day"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#24292f]">

      {/* Top Bar */}
      <div className="bg-[#24292f] text-white px-4 py-3 flex justify-between text-sm">
        <div className="font-semibold">GitHub</div>
        <div>Priya Pradhan</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">

        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold">
            priya437pradhan / todo-day-to-day
          </h1>
          <span className="text-sm text-gray-500">Public</span>
        </div>

        {/* Scrollable Tabs for Mobile */}
        <div className="border-b flex gap-6 text-sm overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                sendSignal(secretMap[tab]);
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
              {secretReveal ? "💌 I Miss You" : toast}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
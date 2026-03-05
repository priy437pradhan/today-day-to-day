import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Github,
  Star,
  GitFork,
  Eye,
  Globe,
  FileText,
  AlertCircle,
  GitPullRequest,
  Shield,
  BookOpen,
  BarChart3,
  Settings,
  Rocket,
  File,
} from "lucide-react";

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
  "README.md": "Love you",
  "package.json": "Call me",
  "vite.config.js": "Are you free?",
  "index.html": "Come online",
  "App.jsx": "I’m happy",
  "Navbar.jsx": "Emergency",
  "Footer.jsx": "Where are you?",
  "apiService.js": "Good night",
  "authService.js": "Love you",
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


useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(async (registration) => {

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      // check existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            "BDXvOEj-7oFPnFaim9w7_sIESpsuZMhrf02nXqwyd-_hODLZvreLlEfMMLWt1-0h4wa9JCEpNNYoANVXltvOS3o"
        });

        await fetch("https://todo-day-to-day.onrender.com/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "Content-Type": "application/json"
          }
        });

        console.log("Push subscription saved");
      }

    });
  }
}, []);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (socketRef.current) return;

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const socket = io("https://todo-day-to-day.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("show_popup", (data) => {
      const message = data.message || data;

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

  /* ================= LOGIN ================= */

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

  /* ================= TAB CONTENT ================= */

  const renderTabContent = () => {
    if (activeTab === "Code") {
      return (
        <div className="bg-white border rounded-md">
          <div className="px-4 py-3 border-b bg-gray-50 text-sm flex justify-between">
            <span>🌿 main</span>
            <span className="text-gray-500">48 commits</span>
          </div>

          {Object.keys(fileSecretMap).map((file, i) => (
            <div
              key={i}
              onClick={() => sendSignal(fileSecretMap[file])}
              className="px-4 py-3 border-b hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            >
              <span className="flex items-center gap-2">
                <File size={16} />
                {file}
              </span>
              <span className="text-xs text-gray-400">
                Updated 2 days ago
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white border rounded-md p-6">
        <h3 className="font-semibold mb-4">{activeTab}</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>• Total Open Items: 12</div>
          <div>• Closed Items: 34</div>
          <div>• Last Updated: 3 hours ago</div>
          <div>• Contributors: 8</div>
          <div>• Activity Level: High</div>
        </div>
      </div>
    );
  };

  /* ================= MAIN UI ================= */

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#24292f]">

      {/* Top Bar */}
      <div className="bg-[#24292f] text-white px-4 py-3 flex justify-between text-sm">
        <div className="font-semibold flex items-center gap-2">
          <Github size={20} />
          GitHub
        </div>

        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1">
            <Globe size={14} />
            OTV
          </span>
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

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Globe size={14} /> Public
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} /> 128
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={14} /> 42
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> 19
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b flex gap-6 text-sm overflow-x-auto">
          {tabs.map((tab) => {
            const tabIcons = {
              Code: <FileText size={16} />,
              Issues: <AlertCircle size={16} />,
              "Pull requests": <GitPullRequest size={16} />,
              Actions: <Rocket size={16} />,
              Projects: <BarChart3 size={16} />,
              Wiki: <BookOpen size={16} />,
              Security: <Shield size={16} />,
              Insights: <BarChart3 size={16} />,
              Settings: <Settings size={16} />,
            };

            return (
              <div
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  sendSignal(tabSecretMap[tab]);
                }}
                className={`pb-3 whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === tab
                    ? "border-b-2 border-orange-500 font-semibold"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                {tabIcons[tab]}
                {tab}
              </div>
            );
          })}
        </div>

        <div className="mt-6">{renderTabContent()}</div>
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
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

interface NotificationLog {
  id: string;
  userId: string;
  channel: "EMAIL" | "SMS" | "PUSH" | "SLACK";
  title: string;
  body: string;
  status: "SENT" | "PENDING" | "FAILED";
  timestamp: string;
  responseTimeMs: number;
}

interface UserPreferences {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  slackEnabled: boolean;
  quietHours: boolean;
}

// In-Memory Database for the microservice
const logsDb: NotificationLog[] = [
  {
    id: "notif-101",
    userId: "rvarshney-926",
    channel: "EMAIL",
    title: "AffordMed Exam Key Generation",
    body: "Your assessment ticket key was compiled. Secure status code achieved.",
    status: "SENT",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    responseTimeMs: 145
  },
  {
    id: "notif-102",
    userId: "rvarshney-926",
    channel: "SMS",
    title: "DND Bypass Status",
    body: "Live sync channels active. Verify OTP: 492062",
    status: "SENT",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    responseTimeMs: 210
  }
];

const preferencesDb: Record<string, UserPreferences> = {
  "rvarshney-926": {
    userId: "rvarshney-926",
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    slackEnabled: false,
    quietHours: false
  }
};

const devicesDb: { userId: string; deviceToken: string; type: string }[] = [];

// Logger utility function inside the backend app to logging operations
function logApiCall(method: string, path: string, reqBody: any, resBody: any, responseTimeMs: number) {
  console.log(`[Notification BE Log] ${method} ${path} - RequestBody: ${JSON.stringify(reqBody)} - ResponseBody: ${JSON.stringify(resBody)} - Time: ${responseTimeMs}ms`);
}

// 1. Root Handshake Endpoint
app.get("/", (req: Request, res: Response) => {
  const result = { status: "running", service: "AffordMed Notification System Microservice BE", version: "1.0.0" };
  logApiCall("GET", "/", {}, result, 1);
  res.json(result);
});

// 2. Fetch Notification Logs
app.get("/api/logs", (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || "rvarshney-926";
  const filtered = logsDb.filter(log => log.userId === userId);
  logApiCall("GET", "/api/logs", req.query, filtered, 5);
  res.json(filtered);
});

// 3. Dispatch new Notification
app.post("/api/send", (req: Request, res: Response) => {
  const { userId, channel, title, body } = req.body;
  const start = Date.now();

  if (!userId || !channel || !title || !body) {
    const err = { error: "Parameters userId, channel, title, and body are required." };
    logApiCall("POST", "/api/send", req.body, err, Date.now() - start);
    return res.status(400).json(err);
  }

  // Check preferences
  const prefs = preferencesDb[userId];
  if (prefs) {
    if (channel === "EMAIL" && !prefs.emailEnabled) {
      const resp = { success: false, status: "BLOCKED_BY_PREFERENCE", reason: "User has disabled Email dispatches." };
      logApiCall("POST", "/api/send", req.body, resp, Date.now() - start);
      return res.status(200).json(resp);
    }
    if (channel === "SMS" && !prefs.smsEnabled) {
      const resp = { success: false, status: "BLOCKED_BY_PREFERENCE", reason: "User has disabled SMS dispatches." };
      logApiCall("POST", "/api/send", req.body, resp, Date.now() - start);
      return res.status(200).json(resp);
    }
  }

  // Simulate third party transmission delay
  const responseTimeMs = Math.floor(Math.random() * 150) + 50;
  const newLog: NotificationLog = {
    id: `notif-${Math.random().toString(36).substring(2, 9)}`,
    userId,
    channel,
    title,
    body,
    status: Math.random() > 0.05 ? "SENT" : "FAILED",
    timestamp: new Date().toISOString(),
    responseTimeMs
  };

  logsDb.unshift(newLog);

  logApiCall("POST", "/api/send", req.body, newLog, Date.now() - start);
  res.status(201).json({ success: newLog.status === "SENT", log: newLog });
});

// 4. Update Preferences
app.get("/api/preferences/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const prefs = preferencesDb[userId] || {
    userId,
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    slackEnabled: true,
    quietHours: false
  };
  logApiCall("GET", `/api/preferences/${userId}`, {}, prefs, 2);
  res.json(prefs);
});

app.put("/api/preferences/:userId", (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { emailEnabled, smsEnabled, pushEnabled, slackEnabled, quietHours } = req.body;

  preferencesDb[userId] = {
    userId,
    emailEnabled: emailEnabled !== undefined ? emailEnabled : true,
    smsEnabled: smsEnabled !== undefined ? smsEnabled : true,
    pushEnabled: pushEnabled !== undefined ? pushEnabled : true,
    slackEnabled: slackEnabled !== undefined ? slackEnabled : true,
    quietHours: quietHours !== undefined ? quietHours : false
  };

  logApiCall("PUT", `/api/preferences/${userId}`, req.body, preferencesDb[userId], 4);
  res.json(preferencesDb[userId]);
});

// 5. Device Registration Endpoint
app.post("/api/register-device", (req: Request, res: Response) => {
  const { userId, deviceToken, type } = req.body;
  if (!userId || !deviceToken || !type) {
    return res.status(400).json({ error: "userId, deviceToken, and type are required." });
  }

  devicesDb.push({ userId, deviceToken, type });
  logApiCall("POST", "/api/register-device", req.body, { success: true }, 3);
  res.json({ success: true, registeredDevicesCount: devicesDb.length });
});

// Export default app context for integration testing
export default app;

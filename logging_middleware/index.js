const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjg1MTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTM1MSwiaWF0IjoxNzc3Njk4NDUxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGQ4MTJlNTktMDhkOC00YTk2LWFhMWItOTcxZGRhOTA4YjJiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhpa3NoaWRoYSIsInN1YiI6ImJjODAxOGUwLTFkOGQtNGQ1Yy05ODM2LTZjY2I3NzllM2Q2MSJ9LCJlbWFpbCI6ImRuODUxOUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRoaWtzaGlkaGEiLCJyb2xsTm8iOiJyYTIzMTEwMjcwNDAwMDYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJiYzgwMThlMC0xZDhkLTRkNWMtOTgzNi02Y2NiNzc5ZTNkNjEiLCJjbGllbnRTZWNyZXQiOiJXVWVHeWRrRkttZUdkQWFRIn0.CL8UJUMuRZZXFCSkO61R5BzeVcSWSRFwjIT1wHL-FIc";
const LOG_SERVER_URL = "http://20.207.122.201/evaluation-service/logs";

const VALID_STACKS = ["frontend", "backend"];
const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];

// frontend specific packages
const FRONTEND_PACKAGES = [
  "api", "component", "hook", "page",
  "state", "style", "auth", "config", "middleware", "utils"
];

// backend specific packages
const BACKEND_PACKAGES = [
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
  "auth", "config", "middleware", "utils"
];

async function Log(stack, level, pkg, message) {

  // basic validation
  if (!VALID_STACKS.includes(stack)) return;
  if (!VALID_LEVELS.includes(level)) return;

  const validPkgs = stack === "frontend" ? FRONTEND_PACKAGES : BACKEND_PACKAGES;
  if (!validPkgs.includes(pkg)) return;

  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  try {
    const response = await fetch(LOG_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  } catch (err) {
    // don't let logging break anything
  }
}

module.exports = { Log };
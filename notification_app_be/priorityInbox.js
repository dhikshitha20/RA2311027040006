const { Log } = require("../logging_middleware/index");

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkbjg1MTlAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNTMxMSwiaWF0IjoxNzc3NzA0NDExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNjlkZjc4ZWUtNjQ3YS00OGUwLTg5NWMtN2Q5N2QxZTJmYzUzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiZGhpa3NoaWRoYSIsInN1YiI6ImJjODAxOGUwLTFkOGQtNGQ1Yy05ODM2LTZjY2I3NzllM2Q2MSJ9LCJlbWFpbCI6ImRuODUxOUBzcm1pc3QuZWR1LmluIiwibmFtZSI6ImRoaWtzaGlkaGEiLCJyb2xsTm8iOiJyYTIzMTEwMjcwNDAwMDYiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJiYzgwMThlMC0xZDhkLTRkNWMtOTgzNi02Y2NiNzc5ZTNkNjEiLCJjbGllbnRTZWNyZXQiOiJXVWVHeWRrRkttZUdkQWFRIn0.DAZjosU7-oszzBp9DpPWWXbn7zxUAEatgCgmdnDqgWw";

const NOTIFICATIONS_URL = "http://20.207.122.201/evaluation-service/notifications";

// placement > result > event
const weights = {
  Placement: 3,
  Result: 2,
  Event: 1
};

async function fetchNotifications() {
  Log("frontend", "info", "api", "calling notifications API");

  const res = await fetch(NOTIFICATIONS_URL, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
  });

  const data = await res.json();
  return data.notifications;
}

function calcScore(n) {
  const w = weights[n.Type] || 0;
  const ageMs = Date.now() - new Date(n.Timestamp).getTime();
  const ageSecs = ageMs / 1000;
  return w + (1 / (1 + ageSecs));
}

async function getTopN(count) {
  Log("frontend", "info", "utils", "scoring and ranking notifications");

  const notifications = await fetchNotifications();

  const withScores = notifications.map(n => ({
    ...n,
    score: calcScore(n)
  }));

  withScores.sort((a, b) => b.score - a.score);

  const top = withScores.slice(0, count);
  Log("frontend", "info", "utils", `done, got top ${top.length}`);
  return top;
}

getTopN(10).then(results => {
  Log("frontend", "info", "page", "priority inbox loaded");
  console.log(JSON.stringify(results, null, 2));
});
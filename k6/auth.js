import http from "k6/http";
import { check, sleep } from "k6";

const baseurl = __ENV.BASE_URL || "http://localhost:3000";

/* ---------------- TEST DATA ---------------- */
const userPayload = JSON.stringify({
  email: "testuser@example.com",
  password: "Test@1234",
});

const headers = {
  "Content-Type": "application/json",
};

/* ---------------- MAIN TEST ---------------- */
export default function () {
  /* -------- LOGIN -------- */
  const loginRes = http.post(`${baseurl}/api/auth/login-users`, userPayload, {
    headers,
  });

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
    "token received": (r) => r.json("token") !== undefined,
  });

  // If login fails, no point continuing
  if (loginRes.status !== 200) return;

  const token = loginRes.json("token");

  sleep(1);

  /* -------- VERIFY TOKEN (PROTECTED API) -------- */
  const profileRes = http.get(`${baseurl}/api/users/user-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(profileRes, {
    "profile fetched": (r) => r.status === 200,
  });

  sleep(1);
}

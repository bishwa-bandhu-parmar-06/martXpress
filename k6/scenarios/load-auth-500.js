import authTest from "../auth.js";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 500 },
    { duration: "2m", target: 500 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"], // auth me thoda tolerance
    http_req_duration: ["p(95)<1000"], // auth slower allowed
  },
};

export default authTest;

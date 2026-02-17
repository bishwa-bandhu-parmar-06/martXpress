import { runTests } from "../load-template.js";
import { API_ENDPOINTS } from "../api-list.js";
export const options = {
  stages: [
    // Warm-up
    { duration: "30s", target: 50 },

    // Ramp up
    { duration: "1m", target: 200 },
    { duration: "1m", target: 500 },

    // Sustain peak load
    { duration: "2m", target: 500 },

    // Cool down
    { duration: "30s", target: 0 },
  ],

  thresholds: {
    http_req_failed: ["rate<0.01"], // <1% errors
    http_req_duration: ["p(95)<800"], // 95% < 800ms
  },
};



export default function () {
  runTests(API_ENDPOINTS);
}

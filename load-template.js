import http from "k6/http";
import { check } from "k6";
import { API_ENDPOINTS } from "./api-list.js";

export function runTests() {
  API_ENDPOINTS.forEach((url) => {
    const res = http.get(url);
    check(res, {
      "status is 200": (r) => r.status === 200,
    });
  });
}

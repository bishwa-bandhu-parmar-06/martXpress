import http from "k6/http";
import { check } from "k6";

const token = __ENV.TOKEN; // JWT token env se

export function runTests(API_ENDPOINTS) {
  API_ENDPOINTS.forEach((url) => {
    const params = {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      tags: { endpoint: url },
    };

    const res = http.get(url, params);

    check(res, {
      "status is 200": (r) => r.status === 200,
    });
  });
}

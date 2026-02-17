import { runLoadTest } from "../load-template.js";

export const options = {
  stages: [
    { duration: "1m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "1m", target: 0 },
  ],
};

export default function () {
  runLoadTest();
}

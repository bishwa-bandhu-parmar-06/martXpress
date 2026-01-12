import { runTests } from "./load-template.js";

export const options = {
  stages: [
    { duration: "20s", target: 200 },
    { duration: "20s", target: 500 },
    { duration: "20s", target: 1000 },
    { duration: "20s", target: 0 },
  ],
};

export default function () {
  runTests();
}

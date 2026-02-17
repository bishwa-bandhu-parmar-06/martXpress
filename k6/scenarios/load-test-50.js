import { runTests } from "../load-template.js";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  runTests();
}

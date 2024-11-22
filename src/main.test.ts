import { describe, it, expect } from "vitest";
import { parseLogFile } from "./main";

describe("main", () => {
	it("parse log file", () => {
		const contents = `
[2024-11-22 16:33:21Z INFO StepsRunner] Step result:
[2024-11-22 16:33:21Z INFO ExecutionContext] Publish step telemetry for current step {
  "action": "sh",
  "type": "run",
  "stage": "Main",
  "stepId": "dd23db01-cff6-57a4-373a-5c8097a97333",
  "stepContextName": "__run",
  "result": "succeeded",
  "errorMessages": [],
  "executionTimeInSeconds": 2,
  "startTime": "2024-11-22T16:33:19.3107228Z",
  "finishTime": "2024-11-22T16:33:21.0406508Z"
}.
[2024-11-22 16:33:21Z INFO ExecutionContext] Publish step telemetry for current step {
  "action": "sh",
  "type": "run",
  "stage": "Main",
  "stepId": "dd23db01-cff6-57a4-373a-5c8097a97333",
  "stepContextName": "__run",
  "result": "succeeded",
  "errorMessages": [],
  "executionTimeInSeconds": 2,
  "startTime": "2024-11-22T16:33:19.3107228Z",
  "finishTime": "2024-11-22T16:33:21.0406508Z"
}.
`;
		const result = parseLogFile(contents);
		expect(result).toHaveLength(2);
	});
});

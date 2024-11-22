import { describe, it, expect } from "vitest";
import { parseLogFile, parsePerfLogs } from "./main";
import fs from "node:fs";
describe("main", () => {
	it("parse log file", async () => {
		const contents = fs.readFileSync(`${__dirname}/testdata/log.log`, "utf-8");
		const result = parseLogFile(contents);
		console.log(result);
		expect(result).toHaveLength(8);
	});
	it("parse perf logs", () => {
		const runnerLog = fs.readFileSync(
			`${__dirname}/testdata/Runner.perf`,
			"utf-8",
		);
		const workerLog = fs.readFileSync(
			`${__dirname}/testdata/Worker.perf`,
			"utf-8",
		);
		const result = parsePerfLogs(runnerLog, workerLog);
		console.log(result);
		expect(result).toHaveLength(13);
	});
});

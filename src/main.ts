import * as core from "@actions/core";
import * as coreCommand from "@actions/core/lib/command";
import * as stateHelper from "./state-helper";

async function run(): Promise<void> {
    console.log("run");
}

async function cleanup(): Promise<void> {
	console.log("cleanup");
}

// Main
if (!stateHelper.IsPost) {
	run();
} else {
	// Post
	cleanup();
}

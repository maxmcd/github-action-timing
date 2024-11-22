```
runner@fv-az842-847:~/perflog$ ls /home/runner/perflog/
Runner.perf  Worker.perf
runner@fv-az842-847:~/perflog$ tail /home/runner/perflog/*
==> /home/runner/perflog/Runner.perf <==
RunnerProcessStarted:2024-11-22T15:51:11.3057356Z
SessionCreated:2024-11-22T15:51:12.1007262Z
MessageReceived_RunnerJobRequest:2024-11-22T15:51:12.9425814Z
JobRequestRenewed_1923:2024-11-22T15:51:13.2097041Z
StartingWorkerProcess:2024-11-22T15:51:13.2122668Z
RunnerSendingJobToWorker_ca395085-040a-526b-2ce8-bdc85f692774:2024-11-22T15:51:13.2286731Z
SentJobToWorker_1923:2024-11-22T15:51:13.2584035Z

==> /home/runner/perflog/Worker.perf <==
WorkerProcessStarted:2024-11-22T15:51:13.4436578Z
WorkerWaitingForJobMessage:2024-11-22T15:51:13.4553819Z
WorkerJobMessageReceived_1923:2024-11-22T15:51:13.5555236Z
WorkerJobServerQueueStarted_1923:2024-11-22T15:51:14.0993653Z
WorkerJobServerQueueAppendFirstConsoleOutput_655369cc-268d-483c-bde3-b6bba4ee55cc:2024-11-22T15:51:14.3435191Z
WorkerJobInitialized_1923:2024-11-22T15:51:15.0598443Z


runner@fv-az842-847:~/work/_PipelineMapping/maxmcd/github-action-timing$ tail /home/runner/work/_PipelineMapping/maxmcd/github-action-timing/PipelineFolder.json
{
  "pipelineDirectory": "github-action-timing",
  "workspaceDirectory": "github-action-timing/github-action-timing",
  "repositories": {
    "maxmcd/github-action-timing": {
      "repositoryPath": "github-action-timing/github-action-timing",
      "lastRunOn": "11/22/2024 15:51:14 +00:00"
    }
  },
  "lastRunOn": "11/22/2024 15:51:14 +00:00"
}


$ cat /home/runner/work/_actions/actions/checkout/v2.completed
11/22/2024 15:51:14


runner@fv-az842-847:~/work/_temp/_github_workflow$ cat /home/runner/work/_temp/_github_workflow/event.json | head -n 30
{
  "after": "4257b86f5f45e51e68e46aa0c7d2b341b03a2c21",
  "base_ref": null,
  "before": "0000000000000000000000000000000000000000",
  "commits": [
    {
      "author": {
        "email": "max.t.mcdonnell@gmail.com",
        "name": "maxmcd",
        "username": "maxmcd"
      },
      "committer": {
        "email": "max.t.mcdonnell@gmail.com",
        "name": "maxmcd",
        "username": "maxmcd"
      },
      "distinct": true,
      "id": "4257b86f5f45e51e68e46aa0c7d2b341b03a2c21",
      "message": "initial",
      "timestamp": "2024-11-22T10:51:00-05:00",
      "tree_id": "0e4a82fb074e160e62591ff7e803d528820e0203",
      "url": "https://github.com/maxmcd/github-action-timing/commit/4257b86f5f45e51e68e46aa0c7d2b341b03a2c21"
    }
  ],
  "compare": "https://github.com/maxmcd/github-action-timing/commit/4257b86f5f45",
  "created": true,
  "deleted": false,
  "forced": false,
  "head_commit": {
    "author": {
```

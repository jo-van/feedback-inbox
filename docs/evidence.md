# Evidence log (overnight build, 2026-11-19 UTC)

- 04:45Z Sandbox egress: Claude Code inside `ff-sandbox` answered through the allowlist proxy; proxy log shows `DENY http-intake.logs.us5.datadoghq.com:443` (everything not allowlisted is refused). Containers on the internal network cannot reach the instance metadata service.
- 04:49Z Teardown test 1 (`ff-tdtest`): EventBridge Scheduler deleted the SSM parameter (04:48) and called deleteStack (04:49). Every resource was deleted, including the teardown role itself. CloudFormation then reported DELETE_FAILED because its last call used the role it had just deleted. Laptop `teardown.sh` re-ran delete-stack: stack gone, receipt shows nothing remaining.
- 04:59Z Kill switch: `ff.sh kill` during a build; the watchdog stopped the sandbox containers and parked request #6 as "Stopped by the kill switch" within a minute.

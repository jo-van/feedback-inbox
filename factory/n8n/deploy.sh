#!/usr/bin/env bash
# Rebuild, import and publish the factory workflows into the running n8n (run as root on the VM).
set -euo pipefail
cd /srv/ff/src
rm -rf /tmp/wf && node factory/n8n/build-workflows.mjs /tmp/wf >/dev/null
docker exec -u root n8n rm -rf /tmp/wf && docker cp /tmp/wf n8n:/tmp/wf && docker exec -u root n8n chown -R node:node /tmp/wf
docker exec n8n n8n import:workflow --separate --input=/tmp/wf 2>&1 | grep -i -E "success|error" || true
for id in ffStationSpec001 ffStationBuild01 ffStationTest001 ffStationRevw001 ffStationSecu001 ffStationPrev001 ffStationRels001 ffFactoryLine001; do
  docker exec n8n n8n publish:workflow --id=$id >/dev/null 2>&1
done
docker restart n8n >/dev/null
for i in $(seq 1 40); do curl -sf 127.0.0.1:5678/healthz >/dev/null && break; sleep 3; done
echo "n8n workflows deployed"

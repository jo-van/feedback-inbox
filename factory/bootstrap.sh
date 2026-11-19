#!/usr/bin/env bash
# One-time VM setup (idempotent). Run as root via SSM.
set -euxo pipefail
export HOME=/root
export DEBIAN_FRONTEND=noninteractive
if ! command -v docker >/dev/null; then
  apt-get update -q
  apt-get install -yq docker.io git jq unzip curl ca-certificates
fi
if ! node -v 2>/dev/null | grep -q '^v22'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -yq nodejs
fi
if ! command -v aws >/dev/null; then
  curl -fsSL https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o /tmp/awscli.zip
  unzip -qo /tmp/awscli.zip -d /tmp && /tmp/aws/install --update
fi
if ! command -v gitleaks >/dev/null; then
  v=$(curl -fsSL https://api.github.com/repos/gitleaks/gitleaks/releases/latest | jq -r .tag_name)
  curl -fsSL "https://github.com/gitleaks/gitleaks/releases/download/${v}/gitleaks_${v#v}_linux_x64.tar.gz" | tar -xz -C /usr/local/bin gitleaks
fi
usermod -aG docker ubuntu || true
mkdir -p /srv/ff/work /srv/ff/deps /etc/ff
[ -d /srv/ff/src/.git ] || git clone -q https://github.com/jo-van/feedback-inbox.git /srv/ff/src
git -C /srv/ff/src pull -q --ff-only || true
# deploy key (private half never leaves this VM)
mkdir -p /root/.ssh && chmod 700 /root/.ssh
[ -f /root/.ssh/ff_deploy ] || ssh-keygen -q -t ed25519 -N '' -C feedback-factory-vm -f /root/.ssh/ff_deploy
cat > /root/.ssh/config <<'C'
Host github.com
  IdentityFile /root/.ssh/ff_deploy
  IdentitiesOnly yes
C
ssh-keyscan -t ed25519 github.com > /root/.ssh/known_hosts 2>/dev/null
git config --global user.name "Feedback Factory"
git config --global user.email "factory@users.noreply.github.com"
git config --global --add safe.directory "*"
echo "PUBKEY $(cat /root/.ssh/ff_deploy.pub)"

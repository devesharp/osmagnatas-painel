export $(grep -v '^#' .env.build | xargs)
docker build \
  --build-arg SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} \
  --build-arg SENTRY_ORG=${SENTRY_ORG} \
  --build-arg SENTRY_PROJECT=${SENTRY_PROJECT} \
  --build-arg NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN} \
  --build-arg BUILD_TIME=$(date +%s) \
  -t coruja/dash:latest .

cd /home/ubuntu/projects/main

docker compose up -d
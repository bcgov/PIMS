# Build & Deploy

Currently this solution and the related projects are not part of a DevOps build/deploy pipeline. Regrettably the repo is private and not accessible from our cloud platforms.

At some point it would trigger on a Pull Request or merge to the repo. New builds would be built and deployed.

## Developer Environments

To get developing immediately just clone the repo and then run # `./scripts/start-dev.sh`.

- Creates default `.env` environment files
- Creates docker containers
- Setups initial database
- Start all five docker containers required for the solution

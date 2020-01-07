# Getting Started

### 1. Deploying the application

#### Prerequisities

1. Git client is installed

   - Git client can be downloaded from https://git-scm.com/downloads

2. Docker Desktop is installed

   - For Windows, Docker Desktop can be installed following the instructions at https://docs.docker.com/docker-for-windows/install/
   - A Docker ID is required to download the software, although the software itself is free.

3. Docker Desktop is configured to share the appropriate drive

   - Open Docker Desktop
   - Go to **Settings** (you may need to open the app from the taskbar, as it may have moved there immediately after opening)
   - Go to the **Shared Drives** tab and share the drive you will cloning the repo to (you may need to restart Docker Desktop)

4. Chrome or Firefox browser.

#### Steps

You will need to use a terminal window (powershell, bash, or Git Bash). You will also need an account that has access to the GitHub repo. You can find the terminal window in Windows by right clicking on the folder you want to download the repo to.

1. Open a terminal window (powershell, bash, Git Bash) to Clone this repo to your computer and run this command;

   - `git clone https://github.com/BCDevExchange-CodeChallenge/Geo-spatial-Real-Estate-Inventory-System-TeamBlue.git`

2. Open a terminal window (powershell, bash, Git Bash) at root of solution (location you cloned the repo), and run this command;
   - `./scripts/start-dev.sh`
   - This process will take a while as it downloads images, downloads packages, builds containers and starts the containers.
   - If for some unlucky reason while starting containers a mount fails, we've found you simply need rerun the above script. At worst you will need to run the following command `docker-compose up -d`

This script will initialize your local environment so that you can start testing right away.

- Creates default `.env` environment files
- Creates docker containers
- Setups initial database
- Start all five docker containers required for the solution

### 2. Using the application

On the same computer that ran step 1 above, open a Chrome web browser and enter the URL `http://localhost:3000/`.

**Note**: The first time the application is requested in a browser it will take a little longer to initialize KeyCloak's database and the Geo-spatial database. Subsequent sign-ins to the application are much faster.

For a regular user, sign-in using one of the following:

| User name      | Password |
| -------------- | -------- |
| keanu.reeves   | password |
| audrey.hepburn | password |
| james.dean     | password |
| meg.ryan       | password |
| julie.andrews  | password |

For an administrator user, sign-in using the following:

| User name     | Password      |
| ------------- | ------------- |
| administrator | administrator |

Detailed instructions about using the application can be found in the User Guide (see below).

# Documentation & Reference Materials

### [User Guide](./USER-GUIDE.md)

### [How to Build & Deploy the System](./BUILD-DEPLOY.md)

### [User Stories](./USER-STORIES.md)

### [UI/UX Design](./UI-UX-DESIGN.md)

### [Architecture](./ARCHITECTURE.md)

### [Testing](./TESTING.md)

### [Project Plan](./PROJECTPLAN.md)

### [Code Challenge Notice, Instructions & Rules](./CODE-CHALLENGE-NOTICE-INSTRUCTIONS-AND-RULES.md)

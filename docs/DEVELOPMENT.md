# Development

Development is currently supported through the use of Docker containers, and or local development with VS Code and Visual Studio 2019.
Although any IDE that supports the languages should work.

## Setup

1.  Create a fork of the repository [https://github.com/bcgov/pims](https://github.com/bcgov/pims).

2.  Clone the forked branch you want work on.

    ```bash
    git clone https://github.com/bcgov/pims
    ```

3.  Generate the `.env` files required to run the solution.
    After generating you may want to edit them with appropriate usernames and passwords (if you don't want the defaults).

    ```bash
    ./scripts/gen-env-files.sh
    ```

4.  Configure your system hosts file to include **keycloak**. More information - [here](../auth/README.md)

    ```
    127.0.0.1 keycloak
    ```

5.  Regrettablye due to Keycloak deprecating import scripts, the setup requires a few manual steps.
    More information - [here](../auth/keycloak/README.md)

    ```bash
    docker-compose up -d keycloak
    ```

6.  After getting Keycloak running successfully continue with starting the rest of the Docker containers.

    ```bash
    docker-compose up -d
    ```

7.  It will take a few minutes to initialize the API database.
    Once running you can now start using the solution - [http://localhost:3000](http://localhost:3000)

    ```
    http://localhost:3000
    ```

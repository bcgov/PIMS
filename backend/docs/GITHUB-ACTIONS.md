# GitHub Actions

GitHub Actions provide a CI/CD workflow abilities configured through YAML that will allow us to build and test our code before a Pull Request is created and merged.
This will provide us immediate feedback to ensure the solution builds and all automated unit tests are successful before others are required to review.

The YAML file is placed in the `/.github/workflows` folder.
An example configuration to build and test the backend below.

```yml
name: API (.NET Core)

on:
  push:
    branches: [ master, dev ]
  pull_request:
    branches: [ master, dev ]

jobs:
  build:

    runs-on: ubuntu-latest
    env:
      working-directory: ./backend

    steps:
    - uses: actions/checkout@v2
    - name: Setup .NET Core
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 3.1.101
    - name: Install dependencies
      run: dotnet restore
      working-directory: ${{env.working-directory}}
    - name: Build
      run: dotnet build --configuration Release --no-restore
      working-directory: ${{env.working-directory}}

  test:

    runs-on: ubuntu-latest
    env:
      working-directory: ./backend

    steps:
    - uses: actions/checkout@v2
    - name: Setup .NET Core
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 3.1.101
    - name: Install dependencies
      run: dotnet restore
      working-directory: ${{env.working-directory}}
    - name: Build
      run: dotnet build --configuration Release --no-restore
      working-directory: ${{env.working-directory}}
    - name: Test
      run: dotnet test --no-restore --verbosity normal
      working-directory: ${{env.working-directory}}
```

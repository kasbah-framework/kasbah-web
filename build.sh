dotnet restore
dotnet build --version-suffix $CI_BUILD_ID src/**/project.json

# TODO: build admin ui

# TODO: run tests

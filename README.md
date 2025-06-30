# 📚 Learn Along

Welcome to this humble Github repository where I will share some of the best practices, tips, and more about many topics on how to set up a good project.

You'll learn how to:

- Initialise a basic [Bun](https://bun.sh/) project
- Add [Commit Lint](https://commitlint.js.org/) to force [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) as a commit message format
- Set up git hooks with [Husky](https://github.com/typicode/husky) to force commit lint's format
- Add [Biome](https://biomejs.dev/) as a formatter and linter for js/ts
- Set up a [lint-staged](https://github.com/lint-staged/lint-staged) and a pre-commit hook to automatically lint and format code before committing
- Add a [bun server](https://bun.sh/docs/api/http) and tests using bun's testing API
- Add a pre-push hook that automatically runs tests and fails if a test isn't passing
- How to dockerize the bun server
- Add a [Bruno](https://www.usebruno.com/) API collection to test a running server
- Add a CI/CD pipeline that tests for formatting and linting issues
- Add a CI/CD pipeline that tests the code
- Add a CI/CD pipeline that automatically builds a docker image of your application and pushes it to a registry
- Add a CI/CD pipeline that tests the vulnerability of the constructed docker image using [Trivy](https://trivy.dev/latest/), and uploads the results as artefacts
- Add a CI/CD pipeline that tests the vulnerability that checks vulnerabilities of your code, and uploads the results as artefacts
- Add a CI/CD pipeline that runs the Bruno API collection automatically on each push
- How to optimize the docker image size to the maximum

## 🧱 Prerequesites

Here's a list of knowledge you need to have before doing this:

- Basic git commands to initialise, clone, commit, push, etc
- A programming language
- How to install software on your own (for Bun, Docker,)

## 📝 Lessons

Here's a list of all the lessons:

- [Lesson 1 - Initialise a basic Bun project](lessons/1-initialise-bun-project.md)
- [Lesson 2 - Add commitlint and git hooks](lessons/2-add-commit-lint-git-hooks.md)
- [Lesson 3 - Add Biome and lint-staged](lessons/3-biome-lint-staged.md)
- [Lesson 4 - Add a bun server and bun tests](lessons/4-bun-server-tests.md)

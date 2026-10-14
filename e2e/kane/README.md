# End-to-end (e2e) tests for web

Browser end-to-end tests for Workout.cool, authored with [KaneCLI](https://www.testmuai.com/kane-cli/) by TestMu AI. Each test is a plain-English `_test.md` file; KaneCLI runs it in a real Chrome browser and records each step so later runs replay without re-authoring.

| Test | What it covers |
|---|---|
| `workout_builder_test.md` | Stepping through the session builder: choosing equipment, picking a muscle on the body diagram, and reaching the Exercises step |
| `bmi_calculator_test.md` | The BMI calculator: 180 cm and 90 kg give a BMI of 27.8 in the "Overweight" category |

Neither test needs an account. They complement the Vitest unit tests by going through the UI.

## Run the tests

Start the app on `http://localhost:3000` as described in the main README:

```bash
cp .env.example .env
make dev
```

### With KaneCLI

```bash
npm install -g @testmuai/kane-cli
kane-cli login
kane-cli testmd run e2e/kane/workout_builder_test.md --agent
kane-cli testmd run e2e/kane/bmi_calculator_test.md --agent
```

### With the exported Playwright code

Each test also has an exported Playwright (JavaScript) version under `output-<test>/playwright-javascript-code/`:

```bash
cd e2e/kane/output-bmi_calculator/playwright-javascript-code
npm install
npx playwright install chromium
node test.js
```

Copy `.env.example` to `.env` and fill in your TestMu AI (LambdaTest) credentials first.

## Editing a test

Edit the step text in the `_test.md` file and run it again with `kane-cli testmd run`. Changed steps (and the steps after them) are re-recorded; unchanged steps replay from `output-<test>/`.

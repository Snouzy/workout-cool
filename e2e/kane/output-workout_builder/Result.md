---
test: ../workout_builder_test.md
status: passed
started: 2026-10-14T09:31:18.091Z
duration_s: 196
session_id: 79725b60-c8fc-4041-a6fe-c880c6ea952a
---

# Step through the workout builder — Result

## Choose equipment ✓ passed (113.7s)
md5: 2f01620e77abadd931d5f55428fc9600
Open http://localhost:3000/en.
Verify the stepper shows "Equipment", "Muscles" and "Exercises", with "Select your equipment" as the current step.
Click "Barbell" and "Bench" to select them, then click "Continue".
Verify the page shows "Select the muscle(s) you want to train by clicking on them." and a front and back body diagram.

## Choose a muscle ✓ passed (77.2s)
md5: b9eac579ca6e7d367391a48e7abf279d
Click the shoulders on the front body diagram to select them.
Verify the "Continue" button is enabled, then click "Continue".
Verify the "Exercises" step is now the current step.

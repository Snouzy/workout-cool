---
mode: testing
url: http://localhost:3000/en
max_steps: 30
tags: [smoke, workouts]
---

# Step through the workout builder

## Choose equipment
Open http://localhost:3000/en.
Verify the stepper shows "Equipment", "Muscles" and "Exercises", with "Select your equipment" as the current step.
Click "Barbell" and "Bench" to select them, then click "Continue".
Verify the page shows "Select the muscle(s) you want to train by clicking on them." and a front and back body diagram.

## Choose a muscle
Click the shoulders on the front body diagram to select them.
Verify the "Continue" button is enabled, then click "Continue".
Verify the "Exercises" step is now the current step.

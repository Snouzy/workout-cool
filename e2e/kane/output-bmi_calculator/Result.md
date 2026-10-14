---
test: ../bmi_calculator_test.md
status: passed
started: 2026-10-14T09:05:58.595Z
duration_s: 89
session_id: 138c7cf2-272a-4880-a06b-cadf4392d6b1
---

# BMI calculator — Result

## Open the BMI calculator ✓ passed (31s)
md5: a6e3ffee966845994bed9888c9172ea9
Open http://localhost:3000/en/tools/bmi-calculator.
Verify the page shows "Standard BMI Calculator" and "Metric (kg/cm)" units are selected.

## Calculate BMI for 180 cm and 90 kg ✓ passed (48.1s)
md5: 1ef8889c5948aae93312deb9f2adca92
Replace the value in the height field (cm) with "180" and the value in the weight field (kg) with "90".
Verify "Your BMI" shows "27.8" and the BMI Category shows "Overweight".

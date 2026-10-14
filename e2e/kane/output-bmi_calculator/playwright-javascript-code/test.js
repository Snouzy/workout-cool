import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "fa67f6cc-f91d-4171-b98e-522b55a6c79b",
  "name": "Calculate BMI Using Metric Units",
  "tcId": "TC-191",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Calculate BMI Using Metric Units", async (page) => {
  let element_0, element_1;
  await testmu.step("Navigate to http://localhost:3000/en/tools/bmi-calculator", { instructionId: "68a9fa8e-b2b8-424d-9b6e-e4749d2a067d" }, async () => {
    await page.goto("http://localhost:3000/en/tools/bmi-calculator");
  });
  
  await testmu.step("Checking whether the Standard BMI Calculator heading is present", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("standard_bmi_calculator_visible", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {30: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(30).textContent.trim() === 'Standard BMI Calculator');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=heading[name=\"Standard BMI Calculator\"i]"], query: "whether the Standard BMI Calculator heading is present", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The page shows \"Standard BMI Calculator\"." }));
  });
  
  await testmu.step("Checking whether the Metric (kg/cm) unit option is selected", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("metric_kg_cm_units_selected", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {33: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(33).classList.contains('border-[#4F8EF7]'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=button[name=\"Metric (kg/cm)\"i]"], query: "whether the Metric (kg/cm) unit option is selected", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "\"Metric (kg/cm)\" units are selected." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "64a277d1-5675-4153-bc82-d066a000d57c" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "The page shows \"Standard BMI Calculator\".", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{standard_bmi_calculator_visible}}", "store_key": "standard_bmi_calculator_visible", "variable_refs": {"{{standard_bmi_calculator_visible}}": "true"}}, {"description": "\"Metric (kg/cm)\" units are selected.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{metric_kg_cm_units_selected}}", "store_key": "metric_kg_cm_units_selected", "variable_refs": {"{{metric_kg_cm_units_selected}}": "true"}}], "sub_checks": [{"description": "The page shows \"Standard BMI Calculator\".", "store_key": "standard_bmi_calculator_visible", "expected_value": "true", "extracted_value": "{{standard_bmi_calculator_visible}}", "operator": "equals", "transforms": []}, {"description": "\"Metric (kg/cm)\" units are selected.", "store_key": "metric_kg_cm_units_selected", "expected_value": "true", "extracted_value": "{{metric_kg_cm_units_selected}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the page shows \"Standard BMI Calculator\" and \"Metric (kg/cm)\" units are selected"});
  });
  
  await testmu.step("Waiting for the plan to type height and weight", { instructionId: "152ebe28-212e-4f3f-9c0e-1629a54e3425" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Type \"180\" into \"Enter height\"", { instructionId: "2501087d-f568-438a-b262-51c52c08cc57" }, async () => {
    element_0 = page.locator("internal:attr=[placeholder=\"Enter height\"i]");
    await element_0.click();
    await element_0.fill("180");
  });
  
  await testmu.step("Type \"90\" into \"Enter weight\"", { instructionId: "8be74284-d5a2-4c4a-83b3-8bd23ac9bfc7" }, async () => {
    element_1 = page.locator("internal:attr=[placeholder=\"Enter weight\"i]");
    await element_1.click();
    await element_1.fill("90");
  });
  
  await testmu.step("Waiting briefly for the BMI results to settle", { instructionId: "6a88ce1d-a040-4258-a39c-d0d143a19989" }, async () => {
    await page.waitForTimeout(200);
  });
  
  await testmu.step("\"Your BMI\" shows \"27.8\".", { instructionId: "4835baa7-b7ae-4951-9add-8ec6adeefcfd" }, async () => {
    setVar("your_bmi_value_check", await testmu.visionQuery(page, "\"Your BMI\" shows \"27.8\".", ""));
  });
  
  await testmu.step("the BMI Category shows \"Overweight\".", { instructionId: "03530e15-cca2-42fb-858a-a8798ae0f9f0" }, async () => {
    setVar("bmi_category_check", await testmu.visionQuery(page, "the BMI Category shows \"Overweight\".", ""));
  });
  
  await testmu.step("Assertion check", { instructionId: "5519d828-4acd-494a-8bfb-5328b3ece830" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "\"Your BMI\" shows \"27.8\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "27.8", "extracted_value": "{{your_bmi_value_check}}", "store_key": "your_bmi_value_check", "variable_refs": {"{{your_bmi_value_check}}": "27.8"}}, {"description": "the BMI Category shows \"Overweight\".", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Overweight", "extracted_value": "{{bmi_category_check}}", "store_key": "bmi_category_check", "variable_refs": {"{{bmi_category_check}}": "Overweight"}}], "sub_checks": [{"description": "\"Your BMI\" shows \"27.8\".", "store_key": "your_bmi_value_check", "expected_value": "27.8", "extracted_value": "{{your_bmi_value_check}}", "operator": "equals", "transforms": ["strip"]}, {"description": "the BMI Category shows \"Overweight\".", "store_key": "bmi_category_check", "expected_value": "Overweight", "extracted_value": "{{bmi_category_check}}", "operator": "equals", "transforms": ["strip"]}], "composite_operator": "and", "claim": "\"Your BMI\" shows \"27.8\" and the BMI Category shows \"Overweight\"."});
  });
});

testmu.run();
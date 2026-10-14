import testmu, { resolveVar, setVar } from '@testmuai/playwright-bindings';
import { expect } from '@playwright/test';

testmu.configure({
  "build": "09df34c3-906f-4d2f-b33f-17460a54afe0",
  "name": "Select Equipment and Target Muscles",
  "tcId": "TC-194",
  "network": (process.env.NETWORK ?? "false").toLowerCase() === "true",
  "autoHealVersion": "AH2",
  "defaultActionTimeoutMs": 10000,
  "defaultNavigationTimeoutMs": 60000,
  "kaneRunV4": true
});

testmu.test("Select Equipment and Target Muscles", async (page) => {
  let element_0, element_1, element_2, element_4;
  await testmu.step("Navigate to http://localhost:3000/en", { instructionId: "296824d3-16e8-4f8a-ba05-f77b58f799eb" }, async () => {
    await page.goto("http://localhost:3000/en");
  });
  
  await testmu.step("Checking the workout setup stepper labels", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("stepper_labels_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {30: 0, 32: 1, 34: 2};\n  const el = (i) => els[__m[i]];\n  const __v = ([el(30),el(32),el(34)].map(e=>e.textContent.trim()).join('|') === 'Equipment|Muscles|Exercises');\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=heading[name=\"Equipment\"i]", "internal:role=heading[name=\"Muscles\"i]", "internal:role=heading[name=\"Exercises\"i]"], query: "whether the workout setup stepper shows the Equipment, Muscles, and Exercises labels", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "the stepper shows \"Equipment\", \"Muscles\" and \"Exercises\"" }));
  });
  
  await testmu.step("Checking the current workout setup step", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("current_step_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {31: 0, 30: 1};\n  const el = (i) => els[__m[i]];\n  const __v = (el(31).textContent.trim() === 'Select your equipment' && el(30).classList.contains('text-blue-600'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=paragraph >> internal:has-text=\"Select your equipment\"i", "internal:role=heading[name=\"Equipment\"i]"], query: "whether the Select your equipment step is the current workout setup step", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "\"Select your equipment\" is the current step" }));
  });
  
  await testmu.step("Assertion check", { instructionId: "7785f297-8c6a-423b-ad85-b445844cae87" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the stepper shows \"Equipment\", \"Muscles\" and \"Exercises\"", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{stepper_labels_check}}", "store_key": "stepper_labels_check", "variable_refs": {"{{stepper_labels_check}}": "true"}}, {"description": "\"Select your equipment\" is the current step", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{current_step_check}}", "store_key": "current_step_check", "variable_refs": {"{{current_step_check}}": "true"}}], "sub_checks": [{"description": "the stepper shows \"Equipment\", \"Muscles\" and \"Exercises\"", "store_key": "stepper_labels_check", "expected_value": "true", "extracted_value": "{{stepper_labels_check}}", "operator": "equals", "transforms": []}, {"description": "\"Select your equipment\" is the current step", "store_key": "current_step_check", "expected_value": "true", "extracted_value": "{{current_step_check}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the stepper shows \"Equipment\", \"Muscles\" and \"Exercises\", with \"Select your equipment\" as the current step"});
  });
  
  await testmu.step("Waiting for the plan steps to complete", { instructionId: "2a3a25ce-79ea-43a0-a780-0b91779d6e45" }, async () => {
    await page.waitForTimeout(1000);
  });
  
  await testmu.step("Click \"Barbell\"", { instructionId: "5252190c-3fa1-46c8-aa2f-db06bfdf2100" }, async () => {
    element_0 = page.locator("internal:role=heading[name=\"Barbell\"i]");
    await element_0.click();
  });
  
  await testmu.step("Click \"Bench\"", { instructionId: "c2b235b4-bdcf-4550-b9a3-dc797cc144fa" }, async () => {
    element_1 = page.locator("internal:role=heading[name=\"Bench\"i]");
    await element_1.click();
  });
  
  await testmu.step("Click \"Continue\"", { instructionId: "81abbda8-1066-4b30-b6b4-068bff6ba2e9" }, async () => {
    element_2 = page.locator("internal:role=button[name=\"Continue\"i]");
    await element_2.click();
  });
  
  await testmu.step("Waiting briefly on the muscle selection page after equipment submission", { instructionId: "adb7a300-f06d-4f31-8385-8b29b5ddc7ea" }, async () => {
    await page.waitForTimeout(500);
  });
  
  await testmu.step("Reading the muscle-selection instruction", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("muscle_selection_instruction_check", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {37: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(37).textContent.trim());\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:text=\"Select the muscle(s) you want\"i"], query: "the muscle-selection instruction text", expectedValue: "Select the muscle(s) you want to train by clicking on them.", needsUnitConversion: false, operator: "equals", transforms: ["strip"], condition: "the page shows \"Select the muscle(s) you want to train by clicking on them.\"" }));
  });
  
  await testmu.step("whether front and back body diagrams are visible", { instructionId: "5f8f379e-33f9-4e63-85c9-467535dd9bbf" }, async () => {
    setVar("front_and_back_body_diagram_check", await testmu.visionQuery(page, "whether front and back body diagrams are visible", ""));
  });
  
  await testmu.step("Assertion check", { instructionId: "01b4cf94-fab4-4fb3-916e-1c9237d42b1d" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "the page shows \"Select the muscle(s) you want to train by clicking on them.\"", "passed": true, "operator": "equals", "transforms": ["strip"], "json_path": null, "expected": "Select the muscle(s) you want to train by clicking on them.", "extracted_value": "{{muscle_selection_instruction_check}}", "store_key": "muscle_selection_instruction_check", "variable_refs": {"{{muscle_selection_instruction_check}}": "Select the muscle(s) you want to train by clicking on them."}}, {"description": "the page shows a front and back body diagram", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{front_and_back_body_diagram_check}}", "store_key": "front_and_back_body_diagram_check", "variable_refs": {"{{front_and_back_body_diagram_check}}": "true"}}], "sub_checks": [{"description": "the page shows \"Select the muscle(s) you want to train by clicking on them.\"", "store_key": "muscle_selection_instruction_check", "expected_value": "Select the muscle(s) you want to train by clicking on them.", "extracted_value": "{{muscle_selection_instruction_check}}", "operator": "equals", "transforms": ["strip"]}, {"description": "the page shows a front and back body diagram", "store_key": "front_and_back_body_diagram_check", "expected_value": "true", "extracted_value": "{{front_and_back_body_diagram_check}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the page shows \"Select the muscle(s) you want to train by clicking on them.\" and a front and back body diagram"});
  });
  
  await testmu.step("PRIMARY: shoulders on the front body diagram; role=clickable; text=\"\" | HINTS: upper outer torso on the left/front human figure, below the neck and above the upper arms", { instructionId: "eaeb1296-7e9b-41e2-903e-877861ab157d" }, async () => {
    const _c_3 = await testmu.getVisionCoordinates(page, "PRIMARY: shoulders on the front body diagram; role=clickable; text=\"\" | HINTS: upper outer torso on the left/front human figure, below the neck and above the upper arms", "click", 791, 474);
    await page.mouse.click(_c_3.x, _c_3.y);
  });
  
  await testmu.step("Checking whether the Continue button is enabled", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("continue_button_enabled", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {54: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (!el(54).disabled);\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=button[name=\"Continue\"i]"], query: "whether the Continue button is enabled", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Continue\" button is enabled." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "d8f8dd2e-7099-4691-82a3-e90b57361025" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "The \"Continue\" button is enabled.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{continue_button_enabled}}", "store_key": "continue_button_enabled", "variable_refs": {"{{continue_button_enabled}}": "true"}}], "sub_checks": [{"description": "The \"Continue\" button is enabled.", "store_key": "continue_button_enabled", "expected_value": "true", "extracted_value": "{{continue_button_enabled}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the \"Continue\" button is enabled"});
  });
  
  await testmu.step("Clicking Continue button", { instructionId: "08f2378f-8f2a-4ce9-9e11-99f94878efc8" }, async () => {
    element_4 = page.locator("internal:role=button[name=\"Continue\"i]");
    await element_4.click();
  });
  
  await testmu.step("Waiting 800 milliseconds for the Exercises step content to settle", { instructionId: "23adb3af-ebc9-4749-a9b5-4a059e8df2a6" }, async () => {
    await page.waitForTimeout(800);
  });
  
  await testmu.step("Checking whether the Exercises step is current", async () => {
    await page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    setVar("exercises_step_current", await testmu.textualAnalyzer(page, { wrappedJs: "(els) => {\n  const __m = {36: 0};\n  const el = (i) => els[__m[i]];\n  const __v = (el(36).classList.contains('text-blue-600') || el(36).classList.contains('dark:text-blue-400'));\n  return (typeof __v === 'boolean' ? String(__v) : __v);\n}", locators: ["internal:role=heading[name=\"Exercises\"i]"], query: "whether the Exercises step is the current step", expectedValue: "true", needsUnitConversion: false, operator: "equals", transforms: [], condition: "The \"Exercises\" step is now the current step." }));
  });
  
  await testmu.step("Assertion check", { instructionId: "ec54920e-0939-489c-8e30-81a538cb5abc" }, async () => {
    await testmu.verifyAssertion(page, "Assertion check", {"operator": ["equals"], "assertion_operands": [], "left_operand": null, "right_operand": null, "operands": [], "sub_results": [{"description": "The \"Exercises\" step is now the current step.", "passed": true, "operator": "equals", "transforms": [], "json_path": null, "expected": "true", "extracted_value": "{{exercises_step_current}}", "store_key": "exercises_step_current", "variable_refs": {"{{exercises_step_current}}": "true"}}], "sub_checks": [{"description": "The \"Exercises\" step is now the current step.", "store_key": "exercises_step_current", "expected_value": "true", "extracted_value": "{{exercises_step_current}}", "operator": "equals", "transforms": []}], "composite_operator": "and", "claim": "the \"Exercises\" step is now the current step"});
  });
});

testmu.run();
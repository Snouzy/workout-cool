"use client";

import { useI18n } from "locales/client";
import { env } from "@/env";
import { InArticle } from "@/components/ads";

import { FormulaCard, createFraction, createSuperscript } from "./MathEquation";

export function BmiEducationalContent() {
  const t = useI18n();

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* BMI Introduction */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.introduction_title")}</h2>
        <div className="prose prose-lg max-w-none text-base-content/80">
          <p>{t("bmi-calculator.educational.introduction_text")}</p>
          <p>{t("bmi-calculator.educational.introduction_usage")}</p>
        </div>
      </section>

      {/* BMI Tables */}
      <section className="space-y-8">
        <div className="space-y-6">
          {env.NEXT_PUBLIC_IN_ARTICLE_BMI_1_AD_SLOT && <InArticle adSlot={env.NEXT_PUBLIC_IN_ARTICLE_BMI_1_AD_SLOT} />}
          <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.adult_table_title")}</h2>

          <p className="text-base-content/80">{t("bmi-calculator.educational.adult_table_description")}</p>

          {/* WHO Adult BMI Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full bg-base-100">
              <thead>
                <tr className="bg-primary text-primary-content">
                  <th className="text-left">{t("bmi-calculator.educational.classification")}</th>
                  <th className="text-center">{t("bmi-calculator.educational.bmi_range")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_severe_thinness")}</td>
                  <td className="text-center font-mono">&lt; 16</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_moderate_thinness")}</td>
                  <td className="text-center font-mono">16 - 17</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_mild_thinness")}</td>
                  <td className="text-center font-mono">17 - 18.5</td>
                </tr>
                <tr className="bg-success/20">
                  <td className="font-medium">{t("bmi-calculator.category_normal")}</td>
                  <td className="text-center font-mono font-bold">18.5 - 25</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_overweight")}</td>
                  <td className="text-center font-mono">25 - 30</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_obese_class_1")}</td>
                  <td className="text-center font-mono">30 - 35</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_obese_class_2")}</td>
                  <td className="text-center font-mono">35 - 40</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.category_obese_class_3")}</td>
                  <td className="text-center font-mono">&gt; 40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Children BMI Table */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.children_table_title")}</h2>
          <p className="text-base-content/80">{t("bmi-calculator.educational.children_table_description")}</p>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full bg-base-100">
              <thead>
                <tr className="bg-primary text-primary-content">
                  <th className="text-left">{t("bmi-calculator.educational.category")}</th>
                  <th className="text-center">{t("bmi-calculator.educational.percentile_range")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.educational.underweight")}</td>
                  <td className="text-center font-mono">&lt; 5%</td>
                </tr>
                <tr className="bg-success/20">
                  <td className="font-medium">{t("bmi-calculator.educational.healthy_weight")}</td>
                  <td className="text-center font-mono font-bold">5% - 85%</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.educational.at_risk_overweight")}</td>
                  <td className="text-center font-mono">85% - 95%</td>
                </tr>
                <tr>
                  <td className="font-medium">{t("bmi-calculator.educational.overweight")}</td>
                  <td className="text-center font-mono">&gt; 95%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Health Risks */}
      <section className="space-y-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.overweight_risks_title")}</h2>
          <p className="text-base-content/80">{t("bmi-calculator.educational.overweight_risks_intro")}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-base-content">{t("bmi-calculator.educational.cardiovascular_risks")}</h4>
              <ul className="space-y-2 text-base-content/80">
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.high_blood_pressure")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.cholesterol_issues")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.coronary_heart_disease")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.stroke")}
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-base-content">{t("bmi-calculator.educational.metabolic_risks")}</h4>
              <ul className="space-y-2 text-base-content/80">
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.type_2_diabetes")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.gallbladder_disease")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.sleep_apnea")}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  {t("bmi-calculator.educational.osteoarthritis")}
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-base-content">{t("bmi-calculator.educational.other_risks")}</h4>
            <ul className="grid md:grid-cols-2 gap-2 text-base-content/80">
              <li className="flex items-start gap-2">
                <span className="text-error">•</span>
                {t("bmi-calculator.educational.certain_cancers")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error">•</span>
                {t("bmi-calculator.educational.mental_health_issues")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error">•</span>
                {t("bmi-calculator.educational.reduced_quality_life")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-error">•</span>
                {t("bmi-calculator.educational.increased_mortality")}
              </li>
            </ul>
          </div>
        </div>

        {/* Underweight Risks */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.underweight_risks_title")}</h2>
          <p className="text-base-content/80">{t("bmi-calculator.educational.underweight_risks_intro")}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-base-content/80">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.malnutrition")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.osteoporosis")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.immune_function_decrease")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.growth_development_issues")}
              </li>
            </ul>
            <ul className="space-y-2 text-base-content/80">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.reproductive_issues")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.surgery_complications")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-1">•</span>
                {t("bmi-calculator.educational.increased_mortality_underweight")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BMI Limitations */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.limitations_title")}</h2>
        <div className="prose prose-lg max-w-none text-base-content/80">
          <p>{t("bmi-calculator.limitations_text")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-base-content">{t("bmi-calculator.educational.adults_limitations")}</h4>
            <ul className="space-y-2 text-base-content/80">
              <li className="flex items-start gap-2">
                <span className="text-info mt-1">•</span>
                {t("bmi-calculator.educational.older_adults_fat")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-1">•</span>
                {t("bmi-calculator.educational.women_fat_difference")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-1">•</span>
                {t("bmi-calculator.educational.athletes_muscle_mass")}
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-base-content">{t("bmi-calculator.educational.children_limitations")}</h4>
            <ul className="space-y-2 text-base-content/80">
              <li className="flex items-start gap-2">
                <span className="text-info mt-1">•</span>
                {t("bmi-calculator.educational.height_maturation_influence")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-1">•</span>
                {t("bmi-calculator.educational.fat_free_mass_difference")}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-info mt-1">•</span>
                {t("bmi-calculator.educational.population_accuracy")}
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BMI Formulas */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.formulas_title")}</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Metric Formula */}
          <FormulaCard
            description="Standard international formula using kilograms and meters"
            equation={`BMI = ${createFraction("weight (kg)", createSuperscript("height", "2") + " (m)")}`}
            example={`${createFraction("70", createSuperscript("1.75", "2"))} = 22.9`}
            title={t("bmi-calculator.educational.metric_formula")}
          />

          {/* Imperial Formula */}
          <FormulaCard
            description="US customary units formula with conversion factor"
            equation={`BMI = 703 × ${createFraction("weight (lbs)", createSuperscript("height", "2") + " (in)")}`}
            example={`703 × ${createFraction("154", createSuperscript("69", "2"))} = 22.9`}
            title={t("bmi-calculator.educational.imperial_formula")}
          />
        </div>
      </section>

      {env.NEXT_PUBLIC_IN_ARTICLE_BMI_2_AD_SLOT && <InArticle adSlot={env.NEXT_PUBLIC_IN_ARTICLE_BMI_2_AD_SLOT} />}

      {/* BMI Prime Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.about_bmi_prime")}</h2>
        <div className="prose prose-lg max-w-none text-base-content/80">
          <p>{t("bmi-calculator.bmi_prime_explanation")}</p>
        </div>

        <FormulaCard
          description={t("bmi-calculator.educational.bmi_prime_description")}
          equation={`BMI Prime = ${createFraction("BMI", "25")}`}
          title={t("bmi-calculator.educational.bmi_prime_formula")}
        />

        {/* BMI Prime Table */}
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full bg-base-100">
            <thead>
              <tr className="bg-primary text-primary-content">
                <th className="text-left">Classification</th>
                <th className="text-center">BMI</th>
                <th className="text-center">BMI Prime</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_severe_thinness")}</td>
                <td className="text-center font-mono">&lt; 16</td>
                <td className="text-center font-mono">&lt; 0.64</td>
              </tr>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_moderate_thinness")}</td>
                <td className="text-center font-mono">16 - 17</td>
                <td className="text-center font-mono">0.64 - 0.68</td>
              </tr>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_mild_thinness")}</td>
                <td className="text-center font-mono">17 - 18.5</td>
                <td className="text-center font-mono">0.68 - 0.74</td>
              </tr>
              <tr className="bg-success/20">
                <td className="font-medium">{t("bmi-calculator.category_normal")}</td>
                <td className="text-center font-mono font-bold">18.5 - 25</td>
                <td className="text-center font-mono font-bold">0.74 - 1.0</td>
              </tr>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_overweight")}</td>
                <td className="text-center font-mono">25 - 30</td>
                <td className="text-center font-mono">1.0 - 1.2</td>
              </tr>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_obese_class_1")}</td>
                <td className="text-center font-mono">30 - 35</td>
                <td className="text-center font-mono">1.2 - 1.4</td>
              </tr>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_obese_class_2")}</td>
                <td className="text-center font-mono">35 - 40</td>
                <td className="text-center font-mono">1.4 - 1.6</td>
              </tr>
              <tr>
                <td className="font-medium">{t("bmi-calculator.category_obese_class_3")}</td>
                <td className="text-center font-mono">&gt; 40</td>
                <td className="text-center font-mono">&gt; 1.6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Ponderal Index */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-base-content">{t("bmi-calculator.educational.ponderal_index_title")}</h2>
        <div className="prose prose-lg max-w-none text-base-content/80">
          <p>{t("bmi-calculator.educational.ponderal_index_explanation")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Metric PI Formula */}
          <FormulaCard
            description={t("bmi-calculator.educational.ponderal_index_metric_description")}
            equation={`PI = ${createFraction("weight (kg)", createSuperscript("height", "3") + " (m)")}`}
            title={t("bmi-calculator.educational.metric_formula")}
          />

          {/* Imperial PI Formula */}
          <FormulaCard
            description={t("bmi-calculator.educational.ponderal_index_imperial_description")}
            equation={`PI = ${createFraction(createSuperscript("height", "3") + " (in)", "∛weight (lbs)")}`}
            title={t("bmi-calculator.educational.imperial_formula")}
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-warning/10 border border-warning/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="text-warning text-xl">⚠️</div>
          <div className="space-y-2">
            <h4 className="font-semibold text-base-content">{t("bmi-calculator.educational.medical_disclaimer_title")}</h4>
            <p className="text-base-content/80">{t("bmi-calculator.disclaimer")}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

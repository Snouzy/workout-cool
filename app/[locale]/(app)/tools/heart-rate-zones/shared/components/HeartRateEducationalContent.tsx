"use client";

import React, { useState } from "react";
import {
  Heart,
  Activity,
  TrendingUp,
  BarChart3,
  BookOpen,
  HelpCircle,
  Info,
  Calculator,
  Lightbulb,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { useI18n } from "locales/client";

export function HeartRateEducationalContent() {
  const t = useI18n();
  const [activeSection, setActiveSection] = useState(0);

  const educationalSections = [
    {
      icon: Heart,
      emoji: "❤️",
      color: "bg-red-500",
      title: t("tools.heart-rate-zones.educational.what_are_zones.title"),
      content: t("tools.heart-rate-zones.educational.what_are_zones.content"),
    },
    {
      icon: Activity,
      emoji: "🏃",
      color: "bg-blue-500",
      title: t("tools.heart-rate-zones.educational.why_use_zones.title"),
      content: t("tools.heart-rate-zones.educational.why_use_zones.content"),
    },
    {
      icon: TrendingUp,
      emoji: "📈",
      color: "bg-green-500",
      title: t("tools.heart-rate-zones.educational.zone_distribution.title"),
      content: t("tools.heart-rate-zones.educational.zone_distribution.content"),
    },
    {
      icon: BarChart3,
      emoji: "📊",
      color: "bg-purple-500",
      title: t("tools.heart-rate-zones.educational.monitoring.title"),
      content: t("tools.heart-rate-zones.educational.monitoring.content"),
    },
  ];

  const faqItems = [
    {
      question: t("tools.heart-rate-zones.faq.q1"),
      answer: t("tools.heart-rate-zones.faq.a1"),
      emoji: "🤔",
    },
    {
      question: t("tools.heart-rate-zones.faq.q2"),
      answer: t("tools.heart-rate-zones.faq.a2"),
      emoji: "⏱️",
    },
    {
      question: t("tools.heart-rate-zones.faq.q3"),
      answer: t("tools.heart-rate-zones.faq.a3"),
      emoji: "💪",
    },
    {
      question: t("tools.heart-rate-zones.faq.q4"),
      answer: t("tools.heart-rate-zones.faq.a4"),
      emoji: "🎯",
    },
    {
      question: t("tools.heart-rate-zones.faq.q5"),
      answer: t("tools.heart-rate-zones.faq.a5"),
      emoji: "📱",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Interactive Educational Content */}
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border-2 border-primary/10">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-primary to-secondary text-primary-content rounded-full w-12 h-12">
                <BookOpen className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h2 className="card-title text-2xl">{t("tools.heart-rate-zones.educational.title")}</h2>
              <p className="text-sm text-base-content/60">Apprenez tout sur les zones cardiaques</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6">
            {educationalSections.map((section, index) => (
              <button
                className={`btn btn-sm gap-2 ${activeSection === index ? "btn-primary shadow-lg" : "btn-ghost"}`}
                key={index}
                onClick={() => setActiveSection(index)}
              >
                <span className="text-lg">{section.emoji}</span>
                <span className="hidden sm:inline">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          <div className="animate-fadeIn">
            {educationalSections.map((section, index) => {
              if (activeSection !== index) return null;
              const Icon = section.icon;

              return (
                <div className="space-y-4" key={index}>
                  <div className="flex items-start gap-4">
                    <div className={"avatar placeholder flex-shrink-0"}>
                      <div className={`${section.color} text-white rounded-xl w-16 h-16 shadow-lg`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{section.title}</h3>
                      <p className="text-base-content/70 leading-relaxed">{section.content}</p>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {educationalSections.map((_, idx) => (
                      <div
                        className={`h-2 rounded-full transition-all ${idx === activeSection ? "w-8 bg-primary" : "w-2 bg-base-300"}`}
                        key={idx}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gamified FAQ Section */}
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border-2 border-secondary/10">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-secondary to-accent text-secondary-content rounded-full w-12 h-12">
                <HelpCircle className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h2 className="card-title text-2xl">{t("tools.heart-rate-zones.faq.title")}</h2>
              <p className="text-sm text-base-content/60">Questions fréquentes</p>
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div className="collapse collapse-plus bg-base-200 hover:bg-base-300 transition-colors" key={index}>
                <input defaultChecked={index === 0} name="faq-accordion" type="radio" />
                <div className="collapse-title text-base font-medium flex items-center gap-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="flex-1">{item.question}</span>
                </div>
                <div className="collapse-content">
                  <div className="pt-2 pl-11">
                    <p className="text-sm text-base-content/70 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Formulas Reference */}
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-xl border-2 border-accent/10">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="avatar placeholder">
              <div className="bg-gradient-to-br from-accent to-primary text-accent-content rounded-full w-12 h-12">
                <Calculator className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h2 className="card-title text-2xl">{t("tools.heart-rate-zones.formulas.basic_formula")}</h2>
              <p className="text-sm text-base-content/60">Comprendre les calculs</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Formula */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Formule de base</span>
              </div>
              <div className="mockup-code bg-base-300">
                <pre className="text-success" data-prefix="📐">
                  <code>{t("tools.heart-rate-zones.formulas.mhr_calculation")}</code>
                </pre>
                <pre className="text-info" data-prefix="💡">
                  <code>{t("tools.heart-rate-zones.formulas.basic_explanation")}</code>
                </pre>
              </div>
            </div>

            {/* Karvonen Formula */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>{t("tools.heart-rate-zones.formulas.karvonen_formula")}</span>
              </div>
              <div className="mockup-code bg-base-300">
                <pre className="text-warning" data-prefix="🎯">
                  <code>{t("tools.heart-rate-zones.formulas.karvonen_explanation")}</code>
                </pre>
              </div>
              <div className="alert alert-info mt-3">
                <Info className="h-5 w-5" />
                <span className="text-sm">
                  La formule de Karvonen est plus précise car elle prend en compte votre fréquence cardiaque au repos!
                </span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 text-center">
            <button className="btn btn-primary gap-2" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Essayer le calculateur
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

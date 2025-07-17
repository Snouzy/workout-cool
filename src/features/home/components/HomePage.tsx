"use client";

import React from "react";
import Image from "next/image";
import { Dumbbell, Target, Clock, ChevronRight, Trophy, Sparkles, Heart, Users } from "lucide-react";

import { WorkoutEmoji } from "@/components/ui/workout-emoji";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function HomePage() {
  const t = await getI18n();

  const features = [
    {
      icon: Target,
      title: "Ciblage Musculaire Précis",
      description: "Sélectionnez exactement les muscles que vous voulez travailler",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Dumbbell,
      title: "Base d'Exercices Complète",
      description: "Accédez à des centaines d'exercices avec vidéos explicatives",
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      icon: Clock,
      title: "Séances Rapides",
      description: "Créez votre entraînement en moins de 30 secondes",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
    {
      icon: Trophy,
      title: "Suivi des Progrès",
      description: "Suivez vos performances et visualisez votre évolution",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ];

  const stats = [
    { label: "Exercices", value: "500+", icon: Dumbbell },
    { label: "Utilisateurs", value: "10K+", icon: Users },
    { label: "Séances créées", value: "50K+", icon: Target },
    { label: "Minutes d'entraînement", value: "1M+", icon: Clock },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-dark">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32 lg:pb-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent" />
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="mb-6 inline-flex items-center gap-2">
              <Badge className="gap-2" size="lg" variant="gradient">
                <Sparkles className="h-4 w-4" />
                Application #1 pour débutants
              </Badge>
            </div>

            {/* Hero Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Créez votre séance de sport
              <span className="block bg-gradient-to-r from-primary to-purple bg-clip-text text-transparent">en 3 clics</span>
            </h1>

            {/* Hero Description */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
              Workout.cool vous aide à créer des entraînements personnalisés adaptés à votre niveau. Simple, rapide et efficace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button className="group" size="xl" variant="gradient">
                Commencer gratuitement
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="xl" variant="outline">
                Voir une démo
              </Button>
            </div>

            {/* Emoji Mascot */}
            <div className="mt-8">
              <WorkoutEmoji animated animation="bounce" size="xl" type="happy" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Tout ce dont vous avez besoin</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Des fonctionnalités pensées pour rendre votre entraînement simple et efficace
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card className="group relative overflow-hidden" key={index} variant="interactive">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} transition-transform duration-200 group-hover:scale-110`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary to-purple px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div className="text-center" key={index}>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Comment ça marche ?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Créez votre séance en 3 étapes simples</p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choisissez votre équipement",
                description: "Sélectionnez le matériel dont vous disposez",
                emoji: "/images/emojis/WorkoutCoolDumbbell.png",
              },
              {
                step: "2",
                title: "Ciblez vos muscles",
                description: "Indiquez les groupes musculaires à travailler",
                emoji: "/images/emojis/WorkoutCoolBiceps.png",
              },
              {
                step: "3",
                title: "Commencez l'entraînement",
                description: "Suivez votre séance personnalisée avec vidéos",
                emoji: "/images/emojis/WorkoutCoolFire.png",
              },
            ].map((item, index) => (
              <div className="relative text-center" key={index}>
                <div className="mb-6">
                  <span className="text-6xl font-bold text-gray-200 dark:text-dark-300">{item.step}</span>
                </div>
                <Image alt={item.title} className="mx-auto mb-4" height={64} src={item.emoji} width={64} />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="p-8 lg:p-12" variant="gradient">
            <Image alt="Start your workout" className="mx-auto mb-6" height={80} src="/images/emojis/WorkoutCoolLove.png" width={80} />
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Prêt à transformer votre entraînement ?</h2>
            <p className="mb-8 text-lg text-white/90">Rejoignez des milliers d'utilisateurs qui ont déjà adopté Workout.cool</p>
            <Button className="group" size="xl" variant="secondary">
              Créer ma première séance
              <Heart className="ml-2 h-5 w-5 animate-pulse text-red-500" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}

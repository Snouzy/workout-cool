"use client";

import React, { useState } from "react";
import Link from "next/link";



export function SEOOptimizedContent() {
  const [activeTab, setActiveTab] = useState(0);

  // Age-based heart rate chart data
  const ageChartData = [
    { age: "20-29", maxHR: "190-200", target50: "95-100", target85: "162-170" },
    { age: "30-39", maxHR: "180-190", target50: "90-95", target85: "153-162" },
    { age: "40-49", maxHR: "170-180", target50: "85-90", target85: "145-153" },
    { age: "50-59", maxHR: "160-170", target50: "80-85", target85: "136-145" },
    { age: "60-69", maxHR: "150-160", target50: "75-80", target85: "128-136" },
    { age: "70+", maxHR: "140-150", target50: "70-75", target85: "119-128" },
  ];

  const faqItems = [
    {
      question: "Qu'est-ce que la fréquence cardiaque maximale (FCM) ?",
      answer: "La fréquence cardiaque maximale est le nombre maximal de battements par minute que votre cœur peut atteindre lors d'un effort physique intense. Elle est généralement calculée avec la formule : 220 - votre âge. Cependant, cette formule peut varier de ±10-15 bpm selon les individus.",
    },
    {
      question: "Comment mesurer ma fréquence cardiaque au repos ?",
      answer: "Mesurez votre pouls au réveil, avant de sortir du lit. Comptez les battements pendant 60 secondes ou pendant 15 secondes et multipliez par 4. Répétez pendant 3-5 jours et utilisez la moyenne. Une FCR normale est entre 60-100 bpm.",
    },
    {
      question: "Quelle zone est la meilleure pour perdre du poids ?",
      answer: "La zone de combustion des graisses (60-70% FCM) est optimale pour brûler les graisses comme carburant. Cependant, les zones plus intenses brûlent plus de calories totales. Pour une perte de poids efficace, alternez entre différentes zones.",
    },
    {
      question: "Puis-je m'entraîner dans la zone VO2 Max tous les jours ?",
      answer: "Non, la zone VO2 Max (90-100% FCM) est extrêmement intense et ne devrait être utilisée que 1-2 fois par semaine pour de courtes périodes (30 secondes à 2 minutes). La majorité de votre entraînement devrait être dans les zones aérobiques.",
    },
    {
      question: "La formule 220-âge est-elle précise ?",
      answer: "C'est une estimation générale qui fonctionne pour la plupart des gens mais peut varier de ±10-15 bpm. Pour plus de précision, utilisez la formule de Karvonen avec votre FCR ou faites un test d'effort supervisé.",
    },
    {
      question: "Comment savoir si je suis dans la bonne zone ?",
      answer: "Utilisez un cardiofréquencemètre pour une mesure précise. Sans appareil, utilisez le test de la parole : Zone légère = conversation facile, Zone modérée = phrases courtes, Zone intense = mots isolés seulement.",
    },
    {
      question: "Les zones changent-elles avec l'amélioration de ma condition physique ?",
      answer: "Oui, avec l'entraînement, votre fréquence cardiaque au repos diminue et votre efficacité cardiaque s'améliore. Recalculez vos zones tous les 2-3 mois pour ajuster votre entraînement.",
    },
    {
      question: "Quelle est la différence entre les formules Basic et Karvonen ?",
      answer: "La formule Basic utilise seulement l'âge (THR = FCM × %Intensité). La formule Karvonen est plus précise car elle prend en compte votre FCR : THR = [(FCM - FCR) × %Intensité] + FCR.",
    },
  ];

  const trainingTips = [
    {
      title: "Échauffement progressif",
      description: "Commencez toujours par 5-10 minutes en zone 1 (50-60%) pour préparer votre système cardiovasculaire.",
      icon: "🔥",
    },
    {
      title: "Règle du 80/20",
      description: "80% de votre entraînement en zones 1-3 (aérobie), 20% en zones 4-5 (anaérobie) pour un développement optimal.",
      icon: "📊",
    },
    {
      title: "Récupération active",
      description: "Après un effort intense, redescendez progressivement en zone 1-2 pendant 5-10 minutes.",
      icon: "🔄",
    },
    {
      title: "Hydratation constante",
      description: "Buvez avant, pendant et après l'exercice. La déshydratation augmente la fréquence cardiaque.",
      icon: "💧",
    },
    {
      title: "Sommeil réparateur",
      description: "7-9 heures de sommeil permettent une meilleure récupération et une FCR plus basse.",
      icon: "😴",
    },
    {
      title: "Progression graduelle",
      description: "Augmentez l'intensité ou la durée de 10% maximum par semaine pour éviter le surentraînement.",
      icon: "📈",
    },
  ];

  return (
    <div className="space-y-12 mt-16">
      {/* Introduction détaillée */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Guide Complet des Zones de Fréquence Cardiaque pour l'Entraînement
        </h2>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Les zones de fréquence cardiaque sont un outil scientifique essentiel pour optimiser vos entraînements 
            et atteindre vos objectifs fitness. Que vous cherchiez à perdre du poids, améliorer votre endurance 
            ou augmenter vos performances, comprendre et utiliser les zones cardiaques transformera votre approche 
            de l'exercice.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            Ce calculateur utilise des formules validées scientifiquement pour déterminer vos zones personnalisées 
            basées sur votre âge et, optionnellement, votre fréquence cardiaque au repos. Chaque zone correspond 
            à une intensité spécifique et offre des bénéfices uniques pour votre santé cardiovasculaire.
          </p>
        </div>
      </section>

      {/* Tableau de référence par âge */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Tableau de Référence des Fréquences Cardiaques par Âge
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Âge</th>
                <th className="px-6 py-4 text-left">FCM (bpm)</th>
                <th className="px-6 py-4 text-left">50% Intensité</th>
                <th className="px-6 py-4 text-left">85% Intensité</th>
              </tr>
            </thead>
            <tbody>
              {ageChartData.map((row, index) => (
                <tr key={row.age} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}>
                  <td className="px-6 py-4 font-semibold">{row.age}</td>
                  <td className="px-6 py-4">{row.maxHR}</td>
                  <td className="px-6 py-4">{row.target50}</td>
                  <td className="px-6 py-4">{row.target85}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          * Ces valeurs sont des moyennes. Votre FCM réelle peut varier de ±10-15 bpm.
        </p>
      </section>

      {/* Explication détaillée des zones */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Les 5 Zones d'Entraînement Expliquées en Détail
        </h2>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚶</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                  Zone 1 : Échauffement (50-60% FCM)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  La zone d'échauffement est idéale pour débuter une séance, récupérer entre les intervalles 
                  ou terminer un entraînement. À cette intensité, vous pouvez maintenir une conversation normale 
                  sans essoufflement.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bénéfices :</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Améliore la circulation sanguine</li>
                      <li>Prépare les muscles et articulations</li>
                      <li>Réduit le risque de blessures</li>
                      <li>Favorise la récupération active</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Durée recommandée :</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      5-10 minutes en début/fin de séance<br/>
                      20-30 minutes pour la récupération active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🔥</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
                  Zone 2 : Combustion des Graisses (60-70% FCM)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Dans cette zone, votre corps utilise principalement les graisses comme source d'énergie. 
                  C'est l'intensité optimale pour développer l'endurance de base et améliorer l'efficacité 
                  métabolique.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bénéfices :</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Maximise l'utilisation des graisses</li>
                      <li>Développe l'endurance aérobie</li>
                      <li>Améliore l'efficacité cardiaque</li>
                      <li>Renforce le système immunitaire</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Durée recommandée :</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      30-90 minutes pour l'endurance<br/>
                      45-60 minutes pour la perte de poids
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏃</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">
                  Zone 3 : Aérobie (70-80% FCM)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  La zone aérobie améliore significativement votre capacité cardiovasculaire. Vous respirez 
                  plus fort mais pouvez encore prononcer des phrases courtes. C'est la zone d'entraînement 
                  principale pour la plupart des athlètes.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bénéfices :</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Augmente la capacité pulmonaire</li>
                      <li>Améliore l'endurance cardiovasculaire</li>
                      <li>Renforce le cœur</li>
                      <li>Optimise l'utilisation de l'oxygène</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Durée recommandée :</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      20-60 minutes en continu<br/>
                      Intervalles de 5-15 minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💪</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">
                  Zone 4 : Anaérobie (80-90% FCM)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  Dans la zone anaérobie, votre corps produit de l'acide lactique plus rapidement qu'il ne peut 
                  l'éliminer. Cette intensité développe la puissance et la vitesse mais ne peut être maintenue 
                  longtemps.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bénéfices :</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Augmente la puissance musculaire</li>
                      <li>Améliore la tolérance au lactate</li>
                      <li>Développe la vitesse</li>
                      <li>Renforce le mental</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Durée recommandée :</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Intervalles de 2-8 minutes<br/>
                      Récupération égale ou double
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚀</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">
                  Zone 5 : VO2 Max (90-100% FCM)
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  La zone VO2 Max représente l'effort maximal. À cette intensité, vous ne pouvez prononcer 
                  que quelques mots et l'effort est insoutenable au-delà de quelques minutes. Réservée aux 
                  athlètes expérimentés.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Bénéfices :</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>Maximise la capacité aérobie</li>
                      <li>Améliore l'économie de course</li>
                      <li>Développe la puissance maximale</li>
                      <li>Repousse les limites mentales</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Durée recommandée :</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Intervalles de 30s à 2 minutes<br/>
                      Maximum 1-2 fois par semaine
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conseils d'entraînement */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Conseils d'Expert pour Optimiser votre Entraînement
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingTips.map((tip) => (
            <div key={tip.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{tip.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{tip.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ complète avec schema */}
      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8" itemScope itemType="https://schema.org/FAQPage">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Questions Fréquentes sur les Zones de Fréquence Cardiaque
        </h2>
        
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
              itemScope 
              itemProp="mainEntity" 
              itemType="https://schema.org/Question"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setActiveTab(activeTab === index ? -1 : index)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4" itemProp="name">
                  {item.question}
                </h3>
                <span className="text-2xl text-gray-500">
                  {activeTab === index ? "−" : "+"}
                </span>
              </button>
              {activeTab === index && (
                <div 
                  className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50"
                  itemScope 
                  itemProp="acceptedAnswer" 
                  itemType="https://schema.org/Answer"
                >
                  <p className="text-gray-700 dark:text-gray-300" itemProp="text">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Liens internes et CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à Optimiser vos Entraînements ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Utilisez notre calculateur pour découvrir vos zones personnalisées et transformez votre fitness
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-white text-blue-600 hover:bg-gray-100 text-xl font-bold py-4 px-8 rounded-full transform transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            Calculer Mes Zones Maintenant
          </button>
          
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
            <Link href="/tools/bmi-calculator" className="block bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="font-bold text-lg mb-2">Calculateur d'IMC</h3>
              <p className="opacity-90">Évaluez votre indice de masse corporelle</p>
            </Link>
            <Link href="/tools/calorie-calculator" className="block bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="font-bold text-lg mb-2">Calculateur de Calories</h3>
              <p className="opacity-90">Déterminez vos besoins caloriques quotidiens</p>
            </Link>
            <Link href="/tools/macro-calculator" className="block bg-white/10 backdrop-blur rounded-2xl p-6 hover:bg-white/20 transition-colors">
              <h3 className="font-bold text-lg mb-2">Calculateur de Macros</h3>
              <p className="opacity-90">Optimisez votre répartition nutritionnelle</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Avertissement médical */}
      <section className="bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Avertissement Médical Important</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Ce calculateur fournit des estimations basées sur des formules générales. Les résultats peuvent 
              varier selon votre condition physique, vos médicaments et votre état de santé. Consultez toujours 
              un professionnel de santé avant de commencer un nouveau programme d'exercice, particulièrement si 
              vous avez des conditions médicales préexistantes ou si vous ressentez des symptômes inhabituels 
              pendant l'exercice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
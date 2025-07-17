"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Trophy, Target, Clock, Users, Zap, Star, ArrowRight, CheckCircle, Eye, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useI18n } from "locales/client";
import { cn } from "@/shared/lib/utils";

interface StatisticsPremiumGateProps {
  className?: string;
  onUpgrade?: () => void;
}

// Composant CountdownTimer pour l'urgence
const CountdownTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 px-3 py-2 rounded-full">
      <Clock className="w-4 h-4 text-red-500" />
      <span className="text-sm font-bold text-red-600 dark:text-red-400">
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
};

// Composant SocialProof pour montrer l'activité
const SocialProof: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(0);
  const recentUsers = ["Sarah", "Mike", "Emma", "Alex", "Julia", "Tom"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUser((prev) => (prev + 1) % recentUsers.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-green-500/10 px-3 py-2 rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-green-600 dark:text-green-400">
        <AnimatePresence mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 10 }}
            key={currentUser}
            transition={{ duration: 0.3 }}
          >
            {recentUsers[currentUser]} just upgraded to Premium
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};

// Composant PriceComparison pour montrer la valeur
const PriceComparison: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Regular price</p>
          <p className="text-xl font-bold text-gray-400 line-through">9.90€</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-600 dark:text-green-400">Launch offer</p>
          <p className="text-3xl font-black text-green-600 dark:text-green-400">7.90€</p>
        </div>
        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">-20%</div>
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">💰 Save 24€ per year with this offer</div>
    </div>
  );
};

// Composant principal du gate
export const StatisticsPremiumGate: React.FC<StatisticsPremiumGateProps> = ({ className, onUpgrade }) => {
  const t = useI18n();
  const [showFullFeatures, setShowFullFeatures] = useState(false);

  // Countdown jusqu'à demain à minuit
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const premiumFeatures = [
    {
      icon: TrendingUp,
      title: "Advanced Progress Tracking",
      description: "Track your progression with detailed analytics and insights",
      highlight: "Most popular",
    },
    {
      icon: Trophy,
      title: "Personal Records History",
      description: "Keep track of all your PRs and celebrate your achievements",
      highlight: "New",
    },
    {
      icon: Target,
      title: "Goal Setting & Tracking",
      description: "Set specific goals and monitor your progress towards them",
      highlight: "",
    },
    {
      icon: BarChart3,
      title: "Detailed Exercise Analytics",
      description: "Deep dive into your performance with comprehensive charts",
      highlight: "Premium",
    },
  ];

  const stats = [
    { value: "15.4K+", label: "Active daily users" },
    { value: "89%", label: "Success rate" },
    { value: "4.8★", label: "User rating" },
  ];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20",
        "border border-purple-200 dark:border-purple-700 rounded-2xl p-8 shadow-2xl",
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.2),transparent)]" />

      {/* Header avec urgence */}
      <div className="relative z-10 text-center mb-8">
        <div className="flex justify-center gap-4 mb-4">
          <CountdownTimer endTime={tomorrow.getTime()} />
          <SocialProof />
        </div>

        <motion.div animate={{ scale: 1 }} className="mb-4" initial={{ scale: 0.9 }} transition={{ duration: 0.3 }}>
          <h2 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Unlock Your Full Potential
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Get deep insights into your fitness journey with Premium Statistics</p>
        </motion.div>

        {/* Stats sociaux */}
        <div className="flex justify-center gap-8 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              key={index}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Aperçu des fonctionnalités */}
      <div className="relative z-10 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-purple-100 dark:border-purple-800"
              initial={{ opacity: 0, x: -20 }}
              key={index}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <feature.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                    {feature.highlight && (
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {feature.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Comparaison de prix */}
      <div className="relative z-10 mb-8">
        <PriceComparison />
      </div>

      {/* Call to action principal */}
      <div className="relative z-10 text-center">
        <motion.button
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300"
          onClick={onUpgrade}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            <span className="text-lg">Start Your Premium Journey</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>

        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>7-day money back</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>GDPR compliant</span>
          </div>
        </div>
      </div>

      {/* Éléments de trust */}
      <div className="relative z-10 mt-8 pt-6 border-t border-purple-200 dark:border-purple-700">
        <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Join 12,400+ users</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.8/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>No ads, ever</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

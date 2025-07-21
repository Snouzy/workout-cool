"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, TrendingUp, Zap, Star, Crown, ArrowRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useI18n, useCurrentLocale } from "locales/client";
import { cn } from "@/shared/lib/utils";

interface StatisticsPreviewOverlayProps {
  className?: string;
  onUpgrade?: () => void;
  isVisible?: boolean;
}

// Composant pour simuler les données qui bougent
const AnimatedChart: React.FC = () => {
  const [data, setData] = useState([
    { x: 0, y: 30 },
    { x: 1, y: 45 },
    { x: 2, y: 35 },
    { x: 3, y: 60 },
    { x: 4, y: 50 },
    { x: 5, y: 75 },
    { x: 6, y: 85 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((point) => ({
          ...point,
          y: Math.max(20, Math.min(90, point.y + (Math.random() - 0.5) * 10)),
        })),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const pathData = data.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x * 40} ${100 - point.y}`).join(" ");

  return (
    <div className="relative w-full h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 240 100">
        {/* Grid */}
        <defs>
          <pattern height="20" id="grid" patternUnits="userSpaceOnUse" width="40">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(139,92,246,0.1)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect fill="url(#grid)" height="100%" width="100%" />

        {/* Animated line */}
        <motion.path
          animate={{ pathLength: 1 }}
          d={pathData}
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="url(#gradient)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Animated dots */}
        {data.map((point, index) => (
          <motion.circle
            animate={{ scale: 1 }}
            cx={point.x * 40}
            cy={100 - point.y}
            fill="#8B5CF6"
            initial={{ scale: 0 }}
            key={index}
            r="4"
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </svg>

      {/* Overlay stats */}
      <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="w-3 h-3" />
          <span className="font-semibold">+12.5%</span>
        </div>
      </div>
    </div>
  );
};

// Composant pour les métriques qui s'animent
const AnimatedMetrics: React.FC = () => {
  const t = useI18n();
  const locale = useCurrentLocale();

  const [metrics, setMetrics] = useState({
    totalVolume: 2450,
    prIncrease: 15,
    weightProgression: 78,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 50) - 25,
        prIncrease: Math.max(0, prev.prIncrease + Math.floor(Math.random() * 6) - 3),
        weightProgression: Math.max(0, Math.min(100, prev.weightProgression + Math.floor(Math.random() * 10) - 5)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <motion.div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center" whileHover={{ scale: 1.05 }}>
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.totalVolume.toLocaleString(locale)}</p>
        <p className="text-xs text-black dark:text-gray-400">{t("statistics.total_volume")}</p>
      </motion.div>

      <motion.div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center" whileHover={{ scale: 1.05 }}>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">+{metrics.prIncrease}%</p>
        <p className="text-xs text-black dark:text-gray-400">{t("statistics.pr_increase")}</p>
      </motion.div>

      <motion.div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 text-center" whileHover={{ scale: 1.05 }}>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.weightProgression}%</p>
        <p className="text-xs text-black dark:text-gray-400">{t("statistics.weight_progress")}</p>
      </motion.div>
    </div>
  );
};

export const StatisticsPreviewOverlay: React.FC<StatisticsPreviewOverlayProps> = ({ className, onUpgrade, isVisible = true }) => {
  const t = useI18n();
  const [isPlaying] = useState(true);
  const [showTeaserModal, setShowTeaserModal] = useState(false);

  if (!isVisible) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className={cn(
        "absolute inset-0 z-50 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-purple-900/90 backdrop-blur-sm rounded-lg",
        "flex flex-col items-center justify-center p-8",
        className,
      )}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
    >
      {/* Icône principale avec animation */}
      <motion.div
        animate={{
          rotate: isPlaying ? 360 : 0,
          scale: isPlaying ? 1.1 : 1,
        }}
        className="mb-6"
        transition={{
          rotate: { duration: 2, repeat: isPlaying ? Infinity : 0, ease: "linear" },
          scale: { duration: 0.3 },
        }}
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-full shadow-2xl">
            <Lock className="w-12 h-12 text-white" />
          </div>
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            className="absolute -top-1 -right-1 bg-orange-500 p-2 rounded-full"
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Crown className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Titre principal */}
      <motion.h3
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold text-white mb-2 text-center"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        {t("statistics.premium_statistics")}
      </motion.h3>

      <motion.p
        animate={{ y: 0, opacity: 1 }}
        className="text-purple-200 text-center mb-6 max-w-md"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        {t("statistics.premium_statistics_description")}
      </motion.p>

      {/* Aperçu des données animées */}
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatedChart />
      </motion.div>

      {/* Métriques animées */}
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md mb-8"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatedMetrics />
      </motion.div>

      {/* Boutons d'action */}
      <div className="flex items-center gap-4">
        <motion.button
          className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
          onClick={onUpgrade}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>{t("statistics.upgrade_now")}</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.button>
      </div>

      {/* Éléments de confiance */}
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="mt-6 flex items-center gap-4 text-sm text-purple-200"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{t("statistics.rating")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{t("statistics.no_ads")}</span>
        </div>
        <div className="flex items-center gap-1">
          <RotateCcw className="w-4 h-4" />
          <span>{t("statistics.cancel_anytime")}</span>
        </div>
      </motion.div>

      {/* Modal de teaser */}
      <AnimatePresence>
        {showTeaserModal && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.8 }}
            initial={{ opacity: 0, scale: 0.8 }}
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm mx-4">
              <h4 className="text-xl font-bold text-center mb-4">{t("statistics.preview_notice")}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{t("statistics.preview_description")}</p>
              <button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                onClick={() => {
                  setShowTeaserModal(false);
                  onUpgrade?.();
                }}
              >
                {t("statistics.get_premium_access")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

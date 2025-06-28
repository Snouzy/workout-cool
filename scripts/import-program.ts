// scripts/import-program.ts
import * as path from "path";
import * as fs from "fs";

import Papa from "papaparse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ProgramData {
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;
  category: string;
  image: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  type: string;
  durationWeeks: string;
  sessionsPerWeek: string;
  sessionDurationMin: string;
  equipment: string;
  isPremium: string;
  isActive: string;
  participantCount: string;
  visibility: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

interface WeekData {
  weekNumber: string;
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;
}

interface SessionData {
  weekNumber: string;
  sessionNumber: string;
  title: string;
  titleEn: string;
  titleEs: string;
  titlePt: string;
  titleRu: string;
  titleZhCn: string;
  slug: string;
  slugEn: string;
  slugEs: string;
  slugPt: string;
  slugRu: string;
  slugZhCn: string;
  description: string;
  descriptionEn: string;
  descriptionEs: string;
  descriptionPt: string;
  descriptionRu: string;
  descriptionZhCn: string;
  equipment: string;
  estimatedMinutes: string;
  exercises: string;
}

interface ExerciseSetData {
  exerciseId: string;
  setIndex: string;
  type1: string;
  value1: string;
  type2: string;
  value2: string;
  type3: string;
  value3: string;
}

function parseEquipment(equipmentStr: string): string[] {
  // eslint-disable-next-line quotes
  if (!equipmentStr || equipmentStr === '"{BODY_ONLY}"') {
    return ["BODY_ONLY"];
  }

  // Parse equipment array format: "{BODY_ONLY,BANDS}" -> ["BODY_ONLY", "BANDS"]
  const cleaned = equipmentStr.replace(/[{}'"]/g, "");
  return cleaned
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function importProgram() {
  try {
    console.log("🚀 Début de l'import du programme...");

    // NETTOYAGE DE LA BASE (optionnel - décommenter si besoin)
    console.log("🧹 Nettoyage des données existantes...");
    await prisma.programSuggestedSet.deleteMany({});
    await prisma.programSessionExercise.deleteMany({});
    await prisma.programSession.deleteMany({});
    await prisma.programWeek.deleteMany({});
    await prisma.program.deleteMany({
      where: {
        slug: "programme-fessiers-sculptés", // Supprimer seulement ce programme
      },
    });
    console.log("✅ Nettoyage terminé");

    const csvPath = path.join(__dirname, "data", "programme-fessiers-sculptés.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");

    // Séparer les sections du CSV
    const sections = csvContent.split(/^# /m);

    // 1. Import du programme principal
    console.log("📋 Import du programme principal...");
    const programSection = sections.find((s) => s.startsWith("PROGRAM CSV"));
    if (!programSection) throw new Error("Section PROGRAM non trouvée");

    const programLines = programSection.split("\n").filter((line) => line && !line.startsWith("#") && !line.startsWith("PROGRAM CSV"));
    const programData = Papa.parse(programLines.join("\n"), { header: true }).data[0] as ProgramData;

    // Vérifier si le programme existe déjà
    let program = await prisma.program.findUnique({
      where: { slug: programData.slug },
    });

    if (program) {
      console.log(`⚠️  Programme "${program.title}" existe déjà (ID: ${program.id})`);
    } else {
      program = await prisma.program.create({
        data: {
          slug: programData.slug,
          slugEn: programData.slugEn,
          slugEs: programData.slugEs,
          slugPt: programData.slugPt,
          slugRu: programData.slugRu,
          slugZhCn: programData.slugZhCn,
          title: programData.title,
          titleEn: programData.titleEn,
          titleEs: programData.titleEs,
          titlePt: programData.titlePt,
          titleRu: programData.titleRu,
          titleZhCn: programData.titleZhCn,
          description: programData.description,
          descriptionEn: programData.descriptionEn,
          descriptionEs: programData.descriptionEs,
          descriptionPt: programData.descriptionPt,
          descriptionRu: programData.descriptionRu,
          descriptionZhCn: programData.descriptionZhCn,
          category: programData.category,
          image: programData.image,
          level: programData.level,
          type: programData.type as any,
          durationWeeks: parseInt(programData.durationWeeks),
          sessionsPerWeek: parseInt(programData.sessionsPerWeek),
          sessionDurationMin: parseInt(programData.sessionDurationMin),
          equipment: parseEquipment(programData.equipment) as any[],
          isPremium: programData.isPremium === "true",
          isActive: programData.isActive === "true",
          participantCount: parseInt(programData.participantCount),
          visibility: programData.visibility,
        },
      });
      console.log(`✅ Programme créé: ${program.title} (ID: ${program.id})`);
    }

    // 2. Import des semaines
    console.log("📅 Import des semaines...");
    const weeksSection = sections.find((s) => s.startsWith("WEEKS CSV"));
    if (!weeksSection) throw new Error("Section WEEKS non trouvée");

    const weeksLines = weeksSection.split("\n").filter((line) => line && !line.startsWith("#") && !line.startsWith("WEEKS CSV"));
    const weeksData = Papa.parse(weeksLines.join("\n"), { header: true }).data as WeekData[];

    const createdWeeks = [];
    for (const weekData of weeksData) {
      if (!weekData.weekNumber) continue;

      const week = await prisma.programWeek.create({
        data: {
          programId: program.id, // Utilise l'ID généré du programme
          weekNumber: parseInt(weekData.weekNumber),
          title: weekData.title,
          titleEn: weekData.titleEn,
          titleEs: weekData.titleEs,
          titlePt: weekData.titlePt,
          titleRu: weekData.titleRu,
          titleZhCn: weekData.titleZhCn,
          description: weekData.description,
          descriptionEn: weekData.descriptionEn,
          descriptionEs: weekData.descriptionEs,
          descriptionPt: weekData.descriptionPt,
          descriptionRu: weekData.descriptionRu,
          descriptionZhCn: weekData.descriptionZhCn,
        },
      });
      createdWeeks.push(week);
      console.log(`✅ Semaine ${week.weekNumber} créée: ${week.title} (ID: ${week.id})`);
    }

    // 3. Import des sessions
    console.log("🏋️ Import des sessions...");
    const sessionsSection = sections.find((s) => s.startsWith("SESSIONS CSV"));
    if (!sessionsSection) throw new Error("Section SESSIONS non trouvée");

    const sessionsLines = sessionsSection.split("\n").filter((line) => line && !line.startsWith("#") && !line.startsWith("SESSIONS CSV"));
    const sessionsData = Papa.parse(sessionsLines.join("\n"), { header: true }).data as SessionData[];

    const createdSessions = [];
    const sessionExerciseMap = new Map<string, string>(); // exerciseId -> sessionExerciseId

    for (const sessionData of sessionsData) {
      if (!sessionData.weekNumber) continue;

      // Trouver la semaine correspondante
      let weekNumber: number;
      if (sessionData.weekNumber === "week1") {
        weekNumber = 1;
      } else if (sessionData.weekNumber === "week2") {
        weekNumber = 2;
      } else {
        weekNumber = parseInt(sessionData.weekNumber);
      }

      const week = createdWeeks.find((w) => w.weekNumber === weekNumber);
      if (!week) {
        console.log(`⚠️ Semaine ${sessionData.weekNumber} (numéro ${weekNumber}) non trouvée`);
        continue;
      }

      const session = await prisma.programSession.upsert({
        where: {
          weekId_sessionNumber: {
            weekId: week.id,
            sessionNumber: parseInt(sessionData.sessionNumber),
          },
        },
        update: {
          // Mettre à jour si existe déjà
          title: sessionData.title,
          titleEn: sessionData.titleEn,
          titleEs: sessionData.titleEs,
          titlePt: sessionData.titlePt,
          titleRu: sessionData.titleRu,
          titleZhCn: sessionData.titleZhCn,
          description: sessionData.description,
          descriptionEn: sessionData.descriptionEn,
          descriptionEs: sessionData.descriptionEs,
          descriptionPt: sessionData.descriptionPt,
          descriptionRu: sessionData.descriptionRu,
          descriptionZhCn: sessionData.descriptionZhCn,
          equipment: parseEquipment(sessionData.equipment) as any[],
          estimatedMinutes: parseInt(sessionData.estimatedMinutes),
        },
        create: {
          // Créer si n'existe pas
          weekId: week.id,
          sessionNumber: parseInt(sessionData.sessionNumber),
          title: sessionData.title,
          titleEn: sessionData.titleEn,
          titleEs: sessionData.titleEs,
          titlePt: sessionData.titlePt,
          titleRu: sessionData.titleRu,
          titleZhCn: sessionData.titleZhCn,
          slug: sessionData.slug,
          slugEn: sessionData.slugEn,
          slugEs: sessionData.slugEs,
          slugPt: sessionData.slugPt,
          slugRu: sessionData.slugRu,
          slugZhCn: sessionData.slugZhCn,
          description: sessionData.description,
          descriptionEn: sessionData.descriptionEn,
          descriptionEs: sessionData.descriptionEs,
          descriptionPt: sessionData.descriptionPt,
          descriptionRu: sessionData.descriptionRu,
          descriptionZhCn: sessionData.descriptionZhCn,
          equipment: parseEquipment(sessionData.equipment) as any[],
          estimatedMinutes: parseInt(sessionData.estimatedMinutes),
          isPremium: false,
        },
      });
      createdSessions.push(session);
      console.log(`✅ Session créée: ${session.title} (ID: ${session.id})`);

      // 4. Import des exercices de la session
      const exerciseIds = sessionData.exercises.split("|").filter(Boolean);

      // Supprimer les exercices existants pour cette session
      await prisma.programSessionExercise.deleteMany({
        where: {
          sessionId: session.id,
        },
      });

      for (let i = 0; i < exerciseIds.length; i++) {
        const exerciseId = exerciseIds[i].trim();

        // Nettoyer l'exerciseId des caractères invalides
        let cleanExerciseId = exerciseId.replace(/[^a-zA-Z0-9]/g, "");

        // Les IDs valides font 25 caractères, on coupe si c'est plus long
        if (cleanExerciseId.length > 25) {
          cleanExerciseId = cleanExerciseId.substring(0, 25);
        }
        if (cleanExerciseId !== exerciseId) {
          console.log(`⚠️  ID exercice nettoyé: "${exerciseId}" -> "${cleanExerciseId}"`);
        }

        // Skip si l'ID est trop court (probablement corrompu)
        if (cleanExerciseId.length < 20) {
          console.log(`⚠️  ID exercice trop court, ignoré: "${cleanExerciseId}"`);
          continue;
        }

        // Vérifier que l'exercice existe
        const exercise = await prisma.exercise.findUnique({
          where: { id: cleanExerciseId },
        });

        if (!exercise) {
          console.log(`⚠️  Exercice non trouvé: ${cleanExerciseId} (original: ${exerciseId})`);
          continue;
        }

        const sessionExercise = await prisma.programSessionExercise.upsert({
          where: {
            sessionId_order: {
              sessionId: session.id,
              order: i + 1,
            },
          },
          update: {
            exerciseId: cleanExerciseId,
            instructions: "Effectue cet exercice en respectant les séries indiquées.",
            instructionsEn: "Perform this exercise following the indicated sets.",
            instructionsEs: "Realiza este ejercicio siguiendo las series indicadas.",
            instructionsPt: "Execute este exercício seguindo as séries indicadas.",
            instructionsRu: "Выполняйте это упражнение согласно указанным подходам.",
            instructionsZhCn: "按照指定的组数执行此练习。",
          },
          create: {
            sessionId: session.id,
            exerciseId: cleanExerciseId,
            order: i + 1,
            instructions: "Effectue cet exercice en respectant les séries indiquées.",
            instructionsEn: "Perform this exercise following the indicated sets.",
            instructionsEs: "Realiza este ejercicio siguiendo las series indicadas.",
            instructionsPt: "Execute este exercício seguindo as séries indicadas.",
            instructionsRu: "Выполняйте это упражнение согласно указанным подходам.",
            instructionsZhCn: "按照指定的组数执行此练习。",
          },
        });

        // Stocker la relation exerciceId -> sessionExerciseId pour les séries
        // Utiliser une clé unique qui combine sessionId et exerciseId
        const exerciseKey = `${session.id}_${cleanExerciseId}`;
        sessionExerciseMap.set(exerciseKey, sessionExercise.id);

        // Aussi stocker avec juste l'exerciseId pour la compatibilité (prendre le dernier)
        sessionExerciseMap.set(cleanExerciseId, sessionExercise.id);

        console.log(`  ✅ Exercice ajouté: ${exercise.name} (SessionExercise ID: ${sessionExercise.id})`);
      }
    }

    // 5. Import des séries d'exercices
    console.log("💪 Import des séries...");

    // Parse les lignes de séries qui sont après les sessions
    const csvLines = csvContent.split("\n");
    const exerciseSetLines = [];
    let inExerciseSection = false;

    for (const line of csvLines) {
      if (line.includes("# EXERCISES WITH SETS") || line.includes("# Format: exerciseId,setIndex")) {
        inExerciseSection = true;
        continue;
      }

      if (inExerciseSection && line.trim() && !line.startsWith("#")) {
        // Ligne qui ressemble à: cmbw9snf902xr9kv1z2cr4yw7,1,REPS,8,TIME,30,BODYWEIGHT,NULL
        if (line.includes("cmbw") && line.split(",").length >= 4) {
          exerciseSetLines.push(line.trim());
        }
      }
    }

    console.log(`📊 Trouvé ${exerciseSetLines.length} lignes de séries à importer`);

    // Grouper les séries par exercice
    const exerciseSets = new Map<string, any[]>();

    for (const line of exerciseSetLines) {
      const parts = line.split(",");
      if (parts.length >= 4) {
        const rawExerciseId = parts[0].trim();
        // Nettoyer l'ID de l'exercice comme on l'a fait pour les exercices
        const exerciseId = rawExerciseId.replace(/[^a-zA-Z0-9]/g, "");
        const setIndex = parseInt(parts[1].trim());
        const type1 = parts[2].trim();
        const value1 = parts[3].trim();
        const type2 = parts[4]?.trim();
        const value2 = parts[5]?.trim();
        const type3 = parts[6]?.trim();
        const value3 = parts[7]?.trim();
        const type4 = parts[8]?.trim();
        const value4 = parts[9]?.trim();

        if (!exerciseSets.has(exerciseId)) {
          exerciseSets.set(exerciseId, []);
        }

        const types = [];
        const valuesInt = [];
        const valuesSec = [];

        // Type 1
        if (type1 && type1 !== "NA") {
          types.push(type1);
          if (value1 && value1 !== "NULL") {
            if (type1 === "TIME") {
              valuesSec.push(parseInt(value1));
            } else if (type1 === "REPS") {
              valuesInt.push(parseInt(value1));
            }
          }
        }

        // Type 2
        if (type2 && type2 !== "NA" && type2 !== "NULL") {
          types.push(type2);
          if (value2 && value2 !== "NULL") {
            if (type2 === "TIME") {
              valuesSec.push(parseInt(value2));
            } else if (type2 === "REPS") {
              valuesInt.push(parseInt(value2));
            }
          }
        }

        // Type 3
        if (type3 && type3 !== "NA" && type3 !== "NULL") {
          types.push(type3);

          if (value3 && value3 !== "NULL") {
            if (type3 === "TIME") {
              valuesSec.push(parseInt(value3));
            } else if (type3 === "REPS") {
              valuesInt.push(parseInt(value3));
            }
          }
        }

        // Type 4
        if (type4 && type4 !== "NA" && type4 !== "NULL") {
          types.push(type4);

          if (value4 && value4 !== "NULL") {
            if (type4 === "TIME") {
              valuesSec.push(parseInt(value4));
            } else if (type4 === "REPS") {
              valuesInt.push(parseInt(value4));
            }
          }
        }

        const existingSets = exerciseSets.get(exerciseId)!;
        // Vérifier si ce setIndex existe déjà pour cet exercice
        const existingSet = existingSets.find((s) => s.setIndex === setIndex);

        if (existingSet) {
          console.log(`⚠️  Set ${setIndex} déjà existant pour l'exercice ${exerciseId}, remplacement...`);
          // Remplacer l'existant
          Object.assign(existingSet, {
            types,
            valuesInt,
            valuesSec,
          });
        } else {
          // Ajouter le nouveau set
          existingSets.push({
            setIndex,
            types,
            valuesInt,
            valuesSec,
          });
        }
      }
    }

    // Créer les séries en base
    let totalSetsCreated = 0;
    for (const [exerciseId, sets] of exerciseSets) {
      // Utiliser la map pour trouver le sessionExerciseId
      const sessionExerciseId = sessionExerciseMap.get(exerciseId);

      if (sessionExerciseId) {
        // Supprimer les séries existantes pour cet exercice de session
        await prisma.programSuggestedSet.deleteMany({
          where: {
            programSessionExerciseId: sessionExerciseId,
          },
        });

        for (const set of sets) {
          const suggestedSet = await prisma.programSuggestedSet.create({
            data: {
              programSessionExerciseId: sessionExerciseId, // Utilise l'ID généré
              setIndex: set.setIndex,
              types: set.types,
              valuesInt: set.valuesInt,
              valuesSec: set.valuesSec,
              units: [],
            },
          });
          totalSetsCreated++;
        }
        console.log(`  ✅ ${sets.length} séries créées pour l'exercice ${exerciseId}`);
      } else {
        console.log(`  ⚠️  Exercice de session non trouvé pour ${exerciseId}`);
      }
    }

    console.log(`✅ ${totalSetsCreated} séries totales importées`);

    console.log("🎉 Import terminé avec succès!");
    console.log(`Programme "${program.title}" importé avec ${createdWeeks.length} semaines et ${createdSessions.length} sessions`);
  } catch (error) {
    console.error("❌ Erreur lors de l'import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'import
importProgram();

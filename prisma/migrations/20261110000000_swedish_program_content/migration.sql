-- Swedish is optional for new content and for installations with their own catalog.
-- This migration can also be reapplied after restoring/importing the official programs.
BEGIN;

ALTER TABLE "programs"
    ADD COLUMN IF NOT EXISTS "titleSv" TEXT,
    ADD COLUMN IF NOT EXISTS "descriptionSv" TEXT;

ALTER TABLE "program_weeks"
    ADD COLUMN IF NOT EXISTS "titleSv" TEXT,
    ADD COLUMN IF NOT EXISTS "descriptionSv" TEXT;

ALTER TABLE "program_sessions"
    ADD COLUMN IF NOT EXISTS "titleSv" TEXT,
    ADD COLUMN IF NOT EXISTS "descriptionSv" TEXT;

ALTER TABLE "program_session_exercises"
    ADD COLUMN IF NOT EXISTS "instructionsSv" TEXT;

-- Swedish labels and independently written summaries of the publicly listed program,
-- week and session previews at https://www.workout.cool/en/programs.
-- Match by program slug and position (IDs differ between installations). The MD5
-- of titleEn + newline + descriptionEn ensures a customized or revised source
-- does not receive the stock translation. Existing Swedish texts take precedence.

WITH translations (program_slug, source_md5, title_sv, description_sv) AS (
    VALUES
        ('full-body-at-home-novice', 'ed00d942130b2379dd95ed7caab81c1d', 'Helkroppsträning hemma för nybörjare', 'Ett fyraveckorsprogram för dig som vill börja styrketräna hemma. Du tränar hela kroppen med din egen kroppsvikt.'),
        ('full-body-novice-bodybuilding', '1ba4a4a217a4e983bbe08fa47a5be899', 'Helkroppsträning på gym för nybörjare', 'Ett fyra veckor långt styrkeprogram för dig som är ny på gymmet. Du tränar hela kroppen med bland annat hantlar och skivstång.'),
        ('summer-hiit-and-abs', '74aa09de6e668dc1aed79c5949a6cdbe', 'Sommarträning med HIIT och magövningar', 'Högintensiv intervallträning för dig med viss träningsvana. Under fyra veckor kombinerar du konditionspass med övningar för magen.'),
        ('titan-core', 'a26add7b46b74a61e5ebb99ecb000ac8', 'Titan Core – bålstyrka', 'Ett program för dig som vill stärka magen och förbättra bålstabiliteten. Träningen passar som komplement till andra pass där du behöver balans och kontroll.'),
        ('booty-pump', '84409a18a0ad10b4a5349020212bbba5', 'Booty Pump – styrketräning för sätet', 'Ett sexveckorsprogram för nybörjare med fokus på att bygga styrka och muskelmassa i sätet. Träningen är indelad i block med olika inriktning.')
)
UPDATE "programs" AS p
SET "titleSv" = COALESCE(NULLIF(p."titleSv", ''), t.title_sv),
    "descriptionSv" = COALESCE(NULLIF(p."descriptionSv", ''), t.description_sv)
FROM translations AS t
WHERE p."slugEn" = t.program_slug
  AND md5(p."titleEn" || E'\n' || p."descriptionEn") = t.source_md5
  AND (NULLIF(p."titleSv", '') IS NULL OR NULLIF(p."descriptionSv", '') IS NULL);

WITH translations (program_slug, week_number, source_md5, title_sv, description_sv) AS (
    VALUES
        ('full-body-at-home-novice', 1, 'f7732f1c650b018af732c4208f62b0d0', 'Grunderna i kroppsviktsträning', 'Lär känna basrörelserna och hur du använder din egen kroppsvikt som motstånd.'),
        ('full-body-at-home-novice', 2, '4325ed5bd399d275cf3fe3ef075b33df', 'Stadigare rörelser', 'Veckans pass tränar koordination och kontroll. Målet är att rörelserna ska kännas stadigare och mer följsamma.'),
        ('full-body-at-home-novice', 3, '624f9f206e37b06dde1526fc4e0a568f', 'Kraft och uthållighet', 'Du fortsätter att utveckla både styrka och uthållighet. Passen växlar mellan explosivitet och finjustering av tekniken.'),
        ('full-body-at-home-novice', 4, 'ce69a77a3048e4c11bf6badb45f6a039', 'Sätt ihop helheten', 'Under avslutningsveckan förenar du styrka, koordination och teknik i helkroppspassen.'),
        ('full-body-novice-bodybuilding', 1, 'b6184c9c6b314d33f1840fd11fe5e400', 'Lär känna basövningarna', 'Första veckan får du vänja dig vid gymmets grundrörelser och upptäcka vilka muskler som arbetar.'),
        ('full-body-novice-bodybuilding', 2, 'db654b8bbb0e37a5c3896dddd6314f23', 'Bygg vidare på grunderna', 'Du fortsätter att utveckla styrkan och befäster tekniken från den första veckan.'),
        ('full-body-novice-bodybuilding', 3, '0b49f56bfa9069ce1ebb58ed868afe00', 'Mer kraft', 'Den här veckan får du arbeta med styrka och precision när övningarna blir mer intensiva.'),
        ('full-body-novice-bodybuilding', 4, 'cbb9c6e3b0e62f23cc4dd39f13229149', 'Behärska rörelserna', 'Sista veckan använder du den styrka och teknik som du har tränat upp under programmet.'),
        ('summer-hiit-and-abs', 1, '0f1e1dbc3d4930f02c438e35eeaae87b', 'Kom igång med intervaller', 'Vänj dig vid högintensiv intervallträning och växlingen mellan lugnare och mer explosivt arbete.'),
        ('summer-hiit-and-abs', 2, '45e4406e8aaae9b72b9ed182d21b1ffb', 'Högre intensitet', 'Arbetsperioderna blir mer krävande och magmusklerna fortsätter att stå i centrum.'),
        ('summer-hiit-and-abs', 3, 'bb9648b9fd2962dfc525a5ade4c908c7', 'Kontroll i högt tempo', 'Veckans mål är att behålla kontrollen över rörelseserierna och bygga uthållighet.'),
        ('summer-hiit-and-abs', 4, 'fa21592a9203e0f7d77b267235a78015', 'Avslutande HIIT-vecka', 'Under sista veckan får du använda den kondition och bålstyrka du har byggt upp i programmet.'),
        ('titan-core', 1, '98f3504e81aecc38fe9c8112eacfe7a6', 'Lär känna kroppen', 'Bekanta dig med grundrörelserna och uppmärksamma hur kroppen arbetar.'),
        ('titan-core', 2, '2de2e772d8f6aec2ed058a288ad2156c', 'Stabilitet och kontroll', 'Träna samordningen mellan över- och underkroppen för att hitta en stabil grund i rörelserna.'),
        ('titan-core', 3, '7e9ed853711618377f5528d79c4bfdac', 'Muskelgrupper i samspel', 'Öva på att använda flera muskelgrupper tillsammans.'),
        ('titan-core', 4, '76b26ad9b1413a3bebbca8184ccad474', 'Kraft och rörelseflyt', 'Intensiteten ökar. Försök behålla ett följsamt rörelsemönster genom passet.'),
        ('booty-pump', 1, '1e86b02942eb48e4a84ce17ffab9b8d0', 'Aktivera sätesmusklerna', 'Första veckan handlar om att hitta kontakten med sätesmusklerna och lära känna övningarna.'),
        ('booty-pump', 2, '5e2b75e9fe5a05705f1093ed5c7db47c', 'Fördjupa muskelkontakten', 'När grundrörelserna känns bekanta kan du finslipa utförandet och bli mer precis i hur du aktiverar musklerna.'),
        ('booty-pump', 3, '6ab0d2789d82f0dfce7e5c894b772b84', 'Träningsvolym och muskeltillväxt', 'Här börjar volymblocket. Antalet set ökar och sätesmusklerna får en större sammanlagd träningsmängd.'),
        ('booty-pump', 4, '1fd6f7ecf2650addfbb7cf00d3727852', 'Volymblockets höjdpunkt', 'Träningsvolymen når sin högsta nivå innan det blir dags att gå över till tyngre styrketräning.'),
        ('booty-pump', 5, '0f1657fa2604830ffb0b1efd4ae64fb0', 'Styrka och explosivitet', 'Nu ligger fokus på tyngre vikter och explosiva repetitioner.'),
        ('booty-pump', 6, 'c5cf16a86821e3fe1514f880025a113c', 'Toppning', 'Under sista veckan ligger fokus på hur styrkan och rörelsekvaliteten har utvecklats genom programmet.')
)
UPDATE "program_weeks" AS w
SET "titleSv" = COALESCE(NULLIF(w."titleSv", ''), t.title_sv),
    "descriptionSv" = COALESCE(NULLIF(w."descriptionSv", ''), t.description_sv)
FROM translations AS t
JOIN "programs" AS p ON p."slugEn" = t.program_slug
WHERE w."programId" = p.id
  AND w."weekNumber" = t.week_number
  AND md5(w."titleEn" || E'\n' || w."descriptionEn") = t.source_md5
  AND (NULLIF(w."titleSv", '') IS NULL OR NULLIF(w."descriptionSv", '') IS NULL);

WITH translations (program_slug, week_number, session_number, source_md5, title_sv, description_sv) AS (
    VALUES
        ('full-body-at-home-novice', 1, 1, '7eb39d89c761436a247e95698cae7e17', 'Lär känna rörelserna', 'Börja med grundrörelserna och känn efter hur kroppen arbetar.'),
        ('full-body-at-home-novice', 1, 2, '088eeddcbfe81e3f5ee6502002b47c60', 'Få igång musklerna', 'Öva på att aktivera musklerna med medvetna rörelser.'),
        ('full-body-at-home-novice', 1, 3, '0609b482c61bfb66dcb1e33391f951c4', 'Styrka och rörlighet', 'Träna på att kombinera styrka med rörlighet i samma pass.'),
        ('full-body-at-home-novice', 1, 4, 'de95f1fc3599961a25439a8a6601c1d1', 'Hitta din styrka', 'Bygg vidare på veckans rörelser och känn hur du tar i.'),
        ('full-body-at-home-novice', 2, 1, 'd24ec9a0ac84f1023749567de91e1c91', 'Nästa steg', 'Bygg vidare på grunderna när övningarna blir mer krävande.'),
        ('full-body-at-home-novice', 2, 2, '55455d730a94b3436a647209d43f77d2', 'Håll ut längre', 'Träna på att hålla i en rörelse även när musklerna börjar bli trötta.'),
        ('full-body-at-home-novice', 2, 3, '1c7702286e7860d92e4d2140a1811df7', 'Balans och stabilitet', 'Fokusera på balansen så att varje rörelse blir stabil.'),
        ('full-body-at-home-novice', 2, 4, '9a56937eab9f2870421366dd67b8f864', 'Följ dina framsteg', 'Lägg märke till hur kroppen svarar på övningarna jämfört med i början av programmet.'),
        ('full-body-at-home-novice', 3, 1, 'd4a77dd15f7cfdbc3a54739355290eb8', 'Explosiva rörelser', 'Lägg kraft i rörelserna när du tränar explosivitet.'),
        ('full-body-at-home-novice', 3, 2, '05cbc015ff2b3bc013537d0cf10b6438', 'Rörelsekontroll', 'Gör rörelserna med precision och behåll kontrollen hela vägen.'),
        ('full-body-at-home-novice', 3, 3, '47f8c920cb7825bfcc9827ef14caa1b4', 'Hitta flytet', 'Arbeta med jämna övergångar så att rörelserna hänger ihop.'),
        ('full-body-at-home-novice', 3, 4, 'd4110906b80e5a7f9533a0764095475c', 'Slipa på tekniken', 'Ägna varje repetition åt rörelsens utförande.'),
        ('full-body-at-home-novice', 4, 1, '1c14950f0bc986aa80824b1f52b4387c', 'Kontroll i varje rörelse', 'Använd den kroppskontroll som du tränat upp under programmet.'),
        ('full-body-at-home-novice', 4, 2, 'a391b431f82111bdab796e04dcd5325a', 'Muskler i samspel', 'Fokusera på hur olika muskelgrupper samarbetar i rörelserna.'),
        ('full-body-at-home-novice', 4, 3, '8b953cf0b1b00f12a0fa53bc8e737d7d', 'Teknik med närvaro', 'Behåll koncentrationen på utförandet genom hela passet.'),
        ('full-body-at-home-novice', 4, 4, '46fd4fd350b460dfa959d68a6bb111cd', 'Avslutande helkroppspass', 'Avsluta hemmaprogrammet med ett pass där du får använda det du har lärt dig.'),
        ('full-body-novice-bodybuilding', 1, 1, 'c71f9d07299e7726e7ad22615217be1a', 'Ditt första gympass', 'Lär känna rörelserna som resten av programmet bygger på.'),
        ('full-body-novice-bodybuilding', 1, 2, '6056ab60926e56c1ae6aa8536b2cd6cd', 'Grunden till din styrka', 'Träna grundrörelser som engagerar hela kroppen.'),
        ('full-body-novice-bodybuilding', 1, 3, '37e4289c31ceb88835042899b6a8c37a', 'Styrka och uthållighet', 'Arbeta med både muskelstyrka och uthållighet i samma pass.'),
        ('full-body-novice-bodybuilding', 1, 4, '084af4813eda44e401ea637b0b8f328c', 'Hitta kontakten med musklerna', 'Uppmärksamma vilka muskler som arbetar när du gör övningarna.'),
        ('full-body-novice-bodybuilding', 2, 1, '228cd1f9d0f0b1c4373e622715c81ad6', 'Ökad intensitet', 'Ett mer krävande pass där musklerna får vänja sig vid högre intensitet.'),
        ('full-body-novice-bodybuilding', 2, 2, '3b2b372650bbb8000bf1a4f7cadaf7f0', 'Styrka i rörelsen', 'Fokusera på hur du använder din styrka i varje övning.'),
        ('full-body-novice-bodybuilding', 2, 3, 'cb05bacace557b138d8c32b32a138721', 'Stegvisa framsteg', 'Följ utvecklingen av din styrka och uthållighet från pass till pass.'),
        ('full-body-novice-bodybuilding', 2, 4, 'f0d4b8bb3593d91d0b93cf92f46a08a2', 'Uppmärksamma utvecklingen', 'Känn efter vad som har förändrats sedan du började träna.'),
        ('full-body-novice-bodybuilding', 3, 1, '9ace7b591738478ed3c7121c35299654', 'Kraft i repetitionerna', 'Ta i med kontroll i de mer intensiva repetitionerna.'),
        ('full-body-novice-bodybuilding', 3, 2, 'fc2b6a48a09f55db60cd5973638d6b3a', 'Kontroll från början till slut', 'Håll en jämn teknik när du tar i genom hela rörelsen.'),
        ('full-body-novice-bodybuilding', 3, 3, '020569abf8145aae4b59efc6370e2e43', 'Teknik i fokus', 'Lägg särskild vikt vid hur du utför varje övning.'),
        ('full-body-novice-bodybuilding', 3, 4, 'b4e48e2582014d731270811a9e606eb2', 'Muskelkontroll', 'Öva på att styra rörelsen och aktivera avsedda muskelgrupper.'),
        ('full-body-novice-bodybuilding', 4, 1, '06709a5c3885053d1b94c1f709a8322e', 'Precision i utförandet', 'Håll fokus på rörelsebanan genom varje repetition.'),
        ('full-body-novice-bodybuilding', 4, 2, 'dbc8a8eced09a253fe0b19f5a188fd8c', 'Samla koncentrationen', 'Håll uppmärksamheten på rörelsen under ansträngningen.'),
        ('full-body-novice-bodybuilding', 4, 3, 'd4eb75156aa82243c3a974389c1bc967', 'Kroppskontroll', 'Fokusera på hur du använder hela kroppen för att styra övningarna.'),
        ('full-body-novice-bodybuilding', 4, 4, 'de77f069af8d967fb278acc2c0fad43a', 'Avslutande gympass', 'Avrunda de fyra veckorna och uppmärksamma vad du har lärt dig på gymmet.'),
        ('summer-hiit-and-abs', 1, 1, '4328b5c8afd49ddc0bbf27fcbf8daf56', 'Ditt första intervallpass', 'Börja med ett pass där både konditionen och magmusklerna får arbeta.'),
        ('summer-hiit-and-abs', 1, 2, '320dc82a3d920529f77afb87ee6585eb', 'Kondition och mage', 'Kombinera pulshöjande rörelser med övningar för magen.'),
        ('summer-hiit-and-abs', 1, 3, 'dab67f163ad5f433eebfca5f2a13472f', 'Öka intensiteten', 'Bekanta dig stegvis med en högre ansträngningsnivå.'),
        ('summer-hiit-and-abs', 1, 4, '39fd7170ed6f692b87c4cf9e1c0bde51', 'Håll i ansträngningen', 'Fokusera på att arbeta genom hela intervallet.'),
        ('summer-hiit-and-abs', 2, 1, 'c3ad61afbf595977d807a181584af48a', 'Intensivt konditionspass', 'Högre intensitet ställer större krav på konditionen.'),
        ('summer-hiit-and-abs', 2, 2, 'c27e157ef946155f0ce6ffd2381c6e15', 'Magmuskler i fokus', 'Arbeta med tydlig muskelkontakt i de krävande magövningarna.'),
        ('summer-hiit-and-abs', 2, 3, '06d27d92dd36806bdff5001cec4aa400', 'Håll tempot', 'Träna på att hålla rytmen när passet blir ansträngande.'),
        ('summer-hiit-and-abs', 2, 4, '19fbbaf2523d994f030f67c1e71a7356', 'Kombinerat intervallpass', 'Knyt ihop veckans konditions- och magträning i samma pass.'),
        ('summer-hiit-and-abs', 3, 1, '59828a3b419c924a62854216d468347b', 'Effektiva rörelser', 'Hitta flytet när du växlar mellan konditionsträning och magövningar.'),
        ('summer-hiit-and-abs', 3, 2, '3db84ccfe8651d50cb27a380d30fd4f9', 'Explosiv styrka och kondition', 'Kombinera kraft och kondition med kontroll över rörelserna.'),
        ('summer-hiit-and-abs', 3, 3, '22d7123f9a32c1120db9b937525add67', 'Uthållighet i intervallerna', 'Arbeta med att hålla ut när belastningen blir mer krävande.'),
        ('summer-hiit-and-abs', 3, 4, '4b87166799e830f2c5a9d363642986f8', 'Behärska intensiteten', 'Behåll en jämn teknik även i de mer intensiva övningarna.'),
        ('summer-hiit-and-abs', 4, 1, '820f4b7f7dc54db9c6a3902517a960bb', 'In i slutveckan', 'Inled den avslutande omgången intervaller med fokus på kondition och mage.'),
        ('summer-hiit-and-abs', 4, 2, '61ed230104ff4cf02899642740379305', 'Precision under ansträngning', 'Håll rörelserna kontrollerade även vid hög intensitet.'),
        ('summer-hiit-and-abs', 4, 3, 'edc965682679e1395b6c808bedc2693a', 'Veckans kraftprov', 'Utmana uthålligheten under programmets näst sista intervallpass.'),
        ('summer-hiit-and-abs', 4, 4, '9782ef946e38fdfa9416e80b2f418928', 'Sista intervallpasset', 'Avsluta de fyra veckorna med ett pass för både konditionen och magen.'),
        ('titan-core', 1, 1, '745e7b081884b04e546f4b4245884fe2', 'Pass 1', 'Börja i lugnt tempo och lär känna rörelserna.'),
        ('titan-core', 1, 2, '087d3f5771ba70240471839a6132dcf7', 'Väck musklerna', 'Aktivera kroppens olika muskelgrupper steg för steg.'),
        ('titan-core', 1, 3, 'b8ff18161bf0248dde306801cc11e852', 'Närvaro i rörelsen', 'Arbeta med följsamma rörelser och uppmärksamma hur de känns.'),
        ('titan-core', 1, 4, 'c42676b1fb9ddbafe2553f360cead759', 'Aktivera bålen', 'Fokusera på bålmusklernas arbete under rörelserna.'),
        ('booty-pump', 1, 1, '7453108d869319b8c1bd5f93dc0cd628', 'Hitta sätesmusklerna', 'Börja med grundövningar och känn efter när sätet arbetar.'),
        ('booty-pump', 1, 2, 'a6ee8e184fa248d8e850deeb7e76e813', 'Grundläggande benstyrka', 'Träna ben och säte med knäböj och utfall.'),
        ('booty-pump', 1, 3, 'ebbed01d0ce75675de2c031051ca6d21', 'Hela underkroppen', 'Arbeta med sätesmusklerna och med både fram- och baksida lår.'),
        ('booty-pump', 1, 4, '6f8adfac0535ddc33517fd7ceff4effe', 'Säte och stabilitet', 'Arbeta med en sida i taget för att träna balans och styrka.'),
        ('booty-pump', 1, 5, '0638b4c72f5fcc5bce888d3a6817c3db', 'Muskelkontakt i lugnt tempo', 'Avsluta veckan med kontrollerade rörelser och fokus på hur musklerna spänns.'),
        ('booty-pump', 2, 1, '1e4a7d028e0204ec0dc15bd1fc0e2b26', 'Teknik och kontroll', 'Finslipa tekniken och uppmärksamma vilka muskler som arbetar.'),
        ('booty-pump', 2, 2, '5fdd0156512d3ea81532d7dc25c3a604', 'Explosivitet i sätet', 'Använd explosiva rörelser för att utveckla kraften i sätesmusklerna.'),
        ('booty-pump', 2, 3, '21b2c7619c6586c5eb660da799548736', 'Hela benens styrka', 'Fördela arbetet mellan benens muskelgrupper.'),
        ('booty-pump', 2, 4, 'b38d94a4a0576e0651444b9e62bdbb41', 'Isolerad sätesträning', 'Ge sätesmusklerna särskild uppmärksamhet med isoleringsövningar.'),
        ('booty-pump', 2, 5, 'e964bbeeb4f7e6a1dfdebd4c3d11d9df', 'Helkroppspass med tyngdpunkt på benen', 'Komplettera arbetet för underkroppen med träning för överkroppen.'),
        ('booty-pump', 3, 1, '4284f56a0fc56726c894e1e51e424d86', 'Börja volymblocket', 'Arbeta med fler set och repetitioner än tidigare i programmet.'),
        ('booty-pump', 3, 2, '90de12b543d815f33cb8c04920046911', 'Muskeltillväxt i sätet', 'Ett pass med hög träningsvolym, inriktat på sätesmusklernas tillväxt.'),
        ('booty-pump', 3, 3, 'cf2589234b959b0962517c5abf926879', 'Hög volym för benen', 'Träna benens muskler med stor sammanlagd arbetsmängd.'),
        ('booty-pump', 3, 4, '97094f00d44184656b2cd2a34e6af122', 'Korta vilopauser', 'Kombinera hög volym med kort vila mellan seten.'),
        ('booty-pump', 3, 5, '95e6dc435d4c6805dfdc1be53d30449f', 'Volympass för hela underkroppen', 'Avsluta veckan med ett omfattande pass för både säte och ben.'),
        ('booty-pump', 4, 1, '8c76741f0624baf48a5f5087b5ef2483', 'Hög träningsvolym', 'Inled den sista veckan med hög volym innan styrkeblocket tar vid.'),
        ('booty-pump', 4, 2, 'b37d5030a5febd76ac3cc3e82cee1247', 'Sätet i centrum', 'Ett intensivt pass med fokus helt på sätesmusklerna.'),
        ('booty-pump', 4, 3, '32cb4495e859e3bb74c759b96e6777da', 'Förbered dig för styrkeblocket', 'Prova tyngre belastning och färre repetitioner.'),
        ('booty-pump', 4, 4, 'a9fc3a116b66f166d068ceab707fdd4b', 'Sista stora volympasset', 'Avrunda arbetet för muskeltillväxt med ytterligare ett volympass.'),
        ('booty-pump', 4, 5, 'f71cda01541eafb481e7c034ac1346e8', 'Balanserad avslutning', 'Knyt ihop volymblocket med träning för både under- och överkroppen.'),
        ('booty-pump', 5, 1, '0908df01370a47c6cc619410280c0c3a', 'Styrka för sätet', 'Inled styrkeblocket med tyngre belastning och färre repetitioner.'),
        ('booty-pump', 5, 2, '37276575743bb3cd2ff871afe37a2272', 'Explosiv benstyrka', 'Kombinera tunga knäböj med explosiva rörelser.'),
        ('booty-pump', 5, 3, '45f183d231f59d1640862fd8f9017f8f', 'Maxstyrka', 'Den här gången ligger tyngdpunkten på styrka vid hög belastning.'),
        ('booty-pump', 5, 4, '9c6f0348e1ac704ab305f563aa337a9c', 'Spänst och explosivitet', 'Arbeta med plyometriska rörelser för att träna snabbhet och kraft.'),
        ('booty-pump', 5, 5, '2bf1c50777f5f20a2227ca1c24e8f999', 'Avsluta styrkeblocket', 'Befäst styrkan inför programmets sista vecka.'),
        ('booty-pump', 6, 1, '3b532839995919e504a6ffefd198899a', 'Toppning för sätet', 'Öka intensiteten och minska träningsvolymen.'),
        ('booty-pump', 6, 2, 'e71ef439b4443bd8f994020326b3ba92', 'Benstyrka under toppningen', 'Arbeta med tung belastning och anpassad volym.'),
        ('booty-pump', 6, 3, 'b66251f15dc0b91e84ccb1542b8febd5', 'Visa din styrka', 'Följ upp hur styrkan har utvecklats sedan starten.'),
        ('booty-pump', 6, 4, 'b448dbe9ff939bd6d9d7546ba0d4cc3c', 'Rörelsekvalitet', 'Ägna passet åt att utföra rörelserna med god kontroll.'),
        ('booty-pump', 6, 5, '9f499df257f34a0d64ee053839705aa8', 'Programmets sista pass', 'Avsluta de sex veckorna med ett balanserat pass och se tillbaka på din utveckling.')
)
UPDATE "program_sessions" AS s
SET "titleSv" = COALESCE(NULLIF(s."titleSv", ''), t.title_sv),
    "descriptionSv" = COALESCE(NULLIF(s."descriptionSv", ''), t.description_sv)
FROM translations AS t
JOIN "programs" AS p ON p."slugEn" = t.program_slug
JOIN "program_weeks" AS w ON w."programId" = p.id AND w."weekNumber" = t.week_number
WHERE s."weekId" = w.id
  AND s."sessionNumber" = t.session_number
  AND md5(s."titleEn" || E'\n' || s."descriptionEn") = t.source_md5
  AND (NULLIF(s."titleSv", '') IS NULL OR NULLIF(s."descriptionSv", '') IS NULL);

COMMIT;

BEGIN;

ALTER TABLE "exercises"
  ADD COLUMN IF NOT EXISTS "nameSv" TEXT,
  ADD COLUMN IF NOT EXISTS "descriptionSv" TEXT,
  ADD COLUMN IF NOT EXISTS "introductionSv" TEXT;

-- Only translate fields whose English source still matches the bundled sample.
-- A self-hosted installation may have edited its instructions under the same slug.
UPDATE "exercises" AS e
SET "nameSv" = COALESCE(NULLIF(e."nameSv", ''), CASE WHEN e."nameEn" = sv.source_name THEN sv.name END),
    "descriptionSv" = COALESCE(NULLIF(e."descriptionSv", ''), CASE WHEN md5(e."descriptionEn") = sv.source_description_md5 THEN sv.description END),
    "introductionSv" = COALESCE(NULLIF(e."introductionSv", ''), CASE WHEN md5(e."introductionEn") = sv.source_introduction_md5 THEN sv.introduction END)
FROM (VALUES
  (
    'fentes-arrieres-barre',
    'Barbell Alternating Reverse Lunges',
    '7032daf7f7fe4b94bdb1af347be40384',
    '2531aeea13dbfe055e30b7a46b53790d',
    'Växelvisa utfall bakåt med skivstång',
    '<p>Stå upprätt med en skivstång vilande över axlarnas baksida.</p><p>Ta ett steg på ungefär 60–90 cm bakåt med ena foten och sänk kroppen.</p><p>Låt det bakre knät nästan nudda golvet. Det främre knät ska vara böjt i ungefär 90 graders vinkel.</p><p>Pressa dig upp till utgångsläget.</p><p>Upprepa med det andra benet och fortsätt att växla ben tills du har gjort det angivna antalet repetitioner.</p>',
    '<p>Med <strong>växelvisa utfall bakåt med skivstång</strong> tränar du <strong>benen</strong> och <strong>sätet</strong>. Övningen passar dig som har viss träningsvana och hjälper dig att utveckla <em>balans</em>, <em>stabilitet</em> och <strong>benstyrka</strong>.</p>'
  ),
  (
    'tirage-horizontal-corde-poulie-haute',
    'Facepulls',
    '29ba4df1c4962ec37ac8a18f96122c4a',
    '1980e22813eafae9ed7f18b107d1533d',
    'Face pulls med rep',
    '<p>Fäst ett rep i kabelmaskinens nedre trissa.</p><p>Stå vänd mot maskinen och ta tag i repet med överhandsgrepp.</p><p>Ta ett steg bakåt tills kabeln är spänd. Stå med fötterna axelbrett isär.</p><p>Håll ryggen rak, luta dig lätt framåt och böj knäna något.</p><p>Dra repet mot bröstet samtidigt som du för ihop skulderbladen.</p><p>Stanna till i slutläget. Sträck sedan långsamt ut armarna igen.</p><p>Upprepa önskat antal gånger.</p>',
    '<p><strong>Face pulls med rep</strong>, även kallat <em>ansiktsdrag</em>, är en <em>isolationsövning</em> för <strong>axlarnas baksida</strong> och <strong>övre delen av ryggen</strong>. Övningen används för att motverka muskulära obalanser som påverkar hållningen och passar både nybörjare och vana utövare.</p>'
  ),
  (
    'sauts-alternes-cotes-banc',
    'Bench Hops',
    '1c01779c69db592123c95f9dc50ff31b',
    '0eb6540b23f3abc4250068f33600b3e8',
    'Sidledshopp över bänk',
    '<p>Ställ dig vid en låda eller bänk med fötterna axelbrett isär.</p><p>Gör en grund knäböj för att ta sats.</p><p>Hoppa över bänken och landa med böjda knän så att benen dämpar landningen.</p>',
    '<p><strong>Sidledshopp över bänk</strong> tränar din <em>explosivitet</em> och <em>smidighet</em>. När du hoppar fram och tillbaka över bänken arbetar <strong>lårets fram- och baksida samt vaderna</strong>. Den intensiva övningen passar både idrottare och dig som vill förbättra din fysiska form.</p>'
  )
) AS sv(slug, source_name, source_description_md5, source_introduction_md5, name, description, introduction)
WHERE e.slug = sv.slug AND (
    (NULLIF(e."nameSv", '') IS NULL AND e."nameEn" = sv.source_name) OR
    (NULLIF(e."descriptionSv", '') IS NULL AND md5(e."descriptionEn") = sv.source_description_md5) OR
    (NULLIF(e."introductionSv", '') IS NULL AND md5(e."introductionEn") = sv.source_introduction_md5)
);

-- Two further exercises are identified by name in the workout seed and CSV guide.
-- They have no bundled instructions.
UPDATE "exercises" AS e
SET "nameSv" = sv.name_sv
FROM (VALUES
  ('Développé couché à la barre prise large', 'Wide-Grip Barbell Bench Press', 'Bänkpress med brett grepp'),
  ('Squat avec barre', 'Barbell Squat', 'Knäböj med skivstång')
) AS sv(name_fr, name_en, name_sv)
WHERE e.name = sv.name_fr AND e."nameEn" = sv.name_en AND NULLIF(e."nameSv", '') IS NULL;

COMMIT;

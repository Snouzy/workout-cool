Generate 50 unique fitness exercises in CSV format with the following columns:

`id,name,name_en,description,description_en,full_video_url,full_video_image_url,introduction,introduction_en,slug,slug_en,attribute_name,attribute_value`

## Requirements:

- Each exercise should have multiple rows (one per attribute)
- Use REALISTIC YouTube URLs for videos (format: https://www.youtube.com/watch?v=VIDEO_ID) from
  @https://www.youtube.com/@fit-distance/videos
- Use corresponding thumbnail URLs (format: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)
- Include HTML tags in descriptions (like <p>, <strong>, <em>)
- Create slugs in kebab-case format

## Attribute values (use EXACTLY these values in the CSV):

`TYPE`: `STRENGTH, CARDIO, PLYOMETRICS, STRETCHING, POWERLIFTING, WEIGHTLIFTING, CROSSFIT, STABILIZATION`
  - Alias accepted by the importer: FLEXIBILITY -> STRETCHING (prefer STRETCHING directly)

`PRIMARY_MUSCLE`: `QUADRICEPS, CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, HAMSTRINGS, GLUTES, CALVES, ABDOMINALS, FOREARMS, LATS, TRAPS, OBLIQUES`
  - Alias accepted by the importer: CORE -> ABDOMINALS (prefer ABDOMINALS directly)

`SECONDARY_MUSCLE`: same list as PRIMARY_MUSCLE
  - Alias accepted by the importer: CORE -> ABDOMINALS (prefer ABDOMINALS directly)

`EQUIPMENT`: `BARBELL, DUMBBELL, BODY_ONLY, MACHINE, CABLE, BANDS, KETTLEBELLS, MEDICINE_BALL, PULLUP_BAR, BENCH, TRX, SWISS_BALL, FOAM_ROLL`
  - Alias accepted by the importer: BODYWEIGHT -> BODY_ONLY, RESISTANCE_BAND -> BANDS (prefer BODY_ONLY / BANDS directly)

`MECHANICS_TYPE`: `COMPOUND, ISOLATION`

Use `NA` for any attribute that does not apply to an exercise.

## Example format:

1,"Squat avec barre","Barbell Squat","<p>Placez la barre...</p>","<p>Place the barbell...</p>",https://www.youtube.com/watch?v=abc123,https://img.youtube.com/vi/abc123/maxresdefault.jpg,"Introduction courte","Short introduction","squat-avec-barre","barbell-squat",TYPE,STRENGTH
1,"Squat avec barre","Barbell Squat","<p>Placez la barre...</p>","<p>Place the barbell...</p>",https://www.youtube.com/watch?v=abc123,https://img.youtube.com/vi/abc123/maxresdefault.jpg,"Introduction courte","Short introduction","squat-avec-barre","barbell-squat",PRIMARY_MUSCLE,QUADRICEPS
1,"Squat avec barre","Barbell Squat","<p>Placez la barre...</p>","<p>Place the barbell...</p>",https://www.youtube.com/watch?v=abc123,https://img.youtube.com/vi/abc123/maxresdefault.jpg,"Introduction courte","Short introduction","squat-avec-barre","barbell-squat",EQUIPMENT,BARBELL
1,"Squat avec barre","Barbell Squat","<p>Placez la barre...</p>","<p>Place the barbell...</p>",https://www.youtube.com/watch?v=abc123,https://img.youtube.com/vi/abc123/maxresdefault.jpg,"Introduction courte","Short introduction","squat-avec-barre","barbell-squat",MECHANICS_TYPE,COMPOUND

Reply only with the csv.

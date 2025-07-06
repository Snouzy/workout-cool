Generate 50 unique fitness exercises in CSV format with the following columns:

`id,name,name_en,description,description_en,full_video_url,full_video_image_url,introduction,introduction_en,slug,slug_en,attribute_name,attribute_value`

## Requirements:

- Each exercise should have multiple rows (one per attribute)
- Use REALISTICS YouTube URLs for videos (format: https://www.youtube.com/watch?v=VIDEO_ID) from
  @https://www.youtube.com/@fit-distance/videos
- Use corresponding thumbnail URLs (format: https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)
- Include HTML tags in descriptions (like <p>, <strong>, <em>)
- Create slugs in kebab-case format

Use these attribute types and ONLY these: `TYPE`: `STRENGTH, CARDIO, PLYOMETRICS, STRETCHING, FLEXIBILITY, POWERLIFTING` `PRIMARY_MUSCLE`:
`QUADRICEPS, CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, HAMSTRINGS, GLUTES, CALVES, CORE, FOREARMS` `SECONDARY_MUSCLE`:
`QUADRICEPS, CHEST, BACK, SHOULDERS, BICEPS, TRICEPS, HAMSTRINGS, GLUTES, CALVES, CORE, FOREARMS` `EQUIPMENT`:
`BARBELL, DUMBBELL, BODYWEIGHT, MACHINE, CABLE, RESISTANCE_BAND, KETTLEBELLS, MEDICINE_BALL` `MECHANICS_TYPE`: `COMPOUND, ISOLATION`

## Example format:

1,"Squat avec barre","Barbell Squat","<p>Placez la barre...</p>","<p>Place the
barbell...</p>",https://www.youtube.com/watch?v=abc123,https://img.youtube.com/vi/abc123/maxresdefault.jpg,"Introduction courte","Short
introduction","squat-avec-barre","barbell-squat",TYPE,STRENGTH 1,"Squat avec barre","Barbell Squat","<p>Placez la barre...</p>","<p>Place
the barbell...</p>",https://www.youtube.com/watch?v=abc123,https://img.youtube.com/vi/abc123/maxresdefault.jpg,"Introduction courte","Short
introduction","squat-avec-barre","barbell-squat",PRIMARY_MUSCLE,QUADRICEPS

Reply only with the csv.

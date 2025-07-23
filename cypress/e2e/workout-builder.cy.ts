import { BottomNavigation } from "cypress/pageManager/navigation/bottomNavigation.util";
import { WorkoutPage } from "cypress/pageManager/pages/workoutPage.util";

describe('test flow', function () {
    const bottomNavigation = new BottomNavigation();
    const workoutPage = new WorkoutPage();

    beforeEach(function () {
        //navigate to the home page using "baseURL" from cypress.config.ts
        cy.visit("/");
    })

    it('Successfully adds workouts', function () {
        workoutPage.selectBarbell()
        workoutPage.selectContinue()
        workoutPage.muscleSelection('quadriceps', 'glutes')
        workoutPage.selectContinue()

        workoutPage.getAllExerciseNames().then((exerciseNames) => {
            const exercise = JSON.stringify(exerciseNames[0]).replace(/[\]\["]/g, '')
            workoutPage.exerciseVideo(exercise)
            cy.get('[data-testid="exercise-video-name"]').contains(exercise)
        })
        cy.pause()
    })
})
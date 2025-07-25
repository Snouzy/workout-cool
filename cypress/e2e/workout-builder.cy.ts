import { BottomNavigation } from "cypress/pageManager/navigation/bottomNavigation.util";
import { SessionPage } from "cypress/pageManager/pages/sessionPage.util";
import { WorkoutPage } from "cypress/pageManager/pages/workoutPage.util";


describe('Workout flow', function () {
    const bottomNavigation = new BottomNavigation();
    const workoutPage = new WorkoutPage();
    const sessionPage = new SessionPage();

    beforeEach(function () {
        //navigate to the home page using "baseURL" from cypress.config.ts
        cy.visit("/");
    })

    it('Successfully progresses through the workout flow', function () {
        workoutPage.selectBarbell()
        workoutPage.selectContinue()
        workoutPage.muscleSelection('quadriceps')
        workoutPage.selectContinue()

        workoutPage.getAllExerciseNames().then((exerciseNames) => {
            const exercise = JSON.stringify(exerciseNames[0]).replace(/[\]\["]/g, '')
            workoutPage.exerciseVideo(exercise)
            cy.get('[data-testid="exercise-video-name"]').contains(exercise)
        })
        cy.get('[data-testid="exercise-video-tags"]').contains('Quadriceps')
        workoutPage.modalClose()
        workoutPage.selectContinue()
        sessionPage.finishWorkoutSession()
        sessionPage.closeDonationModal()
        workoutPage.confirmWorkoutFinished()
    })
})
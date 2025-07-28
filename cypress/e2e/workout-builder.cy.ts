import { HeaderNavigation } from "cypress/pageManager/navigation/header.util";
import { FinishedWorkoutPage } from "cypress/pageManager/pages/finishedWorkoutPage.utils";
import { ProfilePage } from "cypress/pageManager/pages/profilePage.util";
import { SessionPage } from "cypress/pageManager/pages/sessionPage.util";
import { WorkoutPage } from "cypress/pageManager/pages/workoutPage.util";



describe('Workout flow', function () {
    const headerNavigation = new HeaderNavigation();
    const workoutPage = new WorkoutPage();
    const sessionPage = new SessionPage();
    const finishedWorkoutPage = new FinishedWorkoutPage();
    const profilePage = new ProfilePage();

    beforeEach(function () {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        //navigate to the home page using "baseURL" from cypress.config.ts
        cy.visit("/");
    })


    it('Successfully progresses through the workout flow', function () {
        headerNavigation.checkWorkoutStreak().should('equal', 0)
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
        finishedWorkoutPage.confirmWorkoutFinished()
        finishedWorkoutPage.gotToProfile()
        headerNavigation.checkWorkoutStreak().should('equal', 1)
    })
    it('Successfully completes the workout flow from the "New Workout" option', () => {
        headerNavigation.profileDropdown('profile')
        headerNavigation.checkWorkoutStreak().should('equal', 0)
        profilePage.newWorkout()
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
        finishedWorkoutPage.confirmWorkoutFinished()
        finishedWorkoutPage.gotToProfile()
        headerNavigation.checkWorkoutStreak().should('equal', 1)
    })
})
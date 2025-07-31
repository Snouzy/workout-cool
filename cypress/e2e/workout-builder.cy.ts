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
        let exerciseNames: string [] = [];
        let exerciseHistory: string [] = [];
        headerNavigation.checkWorkoutStreak().should('equal', 0)
        workoutPage.selectBarbell()
        workoutPage.selectContinue()
        workoutPage.muscleSelection('quadriceps')
        workoutPage.selectContinue()
        workoutPage.getAllExerciseNames()
            .then((exercises) => {
                exercises.forEach((exercise) => {
                    const exerciseName = JSON.stringify(exercise).replace(/[\]\["]/g, '')
                    exerciseNames.push(exerciseName)
                })
                exerciseNames.forEach((exerciseName) => {
                    workoutPage.exerciseVideo(exerciseName)
                    cy.get('[data-testid="exercise-video-name"]').contains(exerciseName)
                    workoutPage.modalClose()
                })
                workoutPage.selectContinue()
                sessionPage.finishWorkoutSession()
                sessionPage.closeDonationModal()
                finishedWorkoutPage.confirmWorkoutFinished()
                finishedWorkoutPage.gotToProfile()
            })
            .then( () => {
                headerNavigation.checkWorkoutStreak().should('equal', 1)
                profilePage.getWorkoutSessionExercises().then(workoutSessions => {
                    exerciseHistory = workoutSessions
                })
            })
            .then(() => {
                exerciseNames.forEach((exerciseName) => {
                    expect(exerciseHistory).to.include(exerciseName.toLowerCase())
                })
            })
    })
    it('Successfully completes the workout flow from the "New Workout" option', () => {
        let exerciseNames: string [] = [];
        let exerciseHistory: string [] = [];
        headerNavigation.profileDropdown('profile')
        headerNavigation.checkWorkoutStreak().should('equal', 0)
        profilePage.newWorkout()
        workoutPage.selectBarbell()
        workoutPage.selectContinue()
        workoutPage.muscleSelection('quadriceps')
        workoutPage.selectContinue()
        workoutPage.getAllExerciseNames()
            .then((exercises) => {
                exercises.forEach((exercise) => {
                    const exerciseName = JSON.stringify(exercise).replace(/[\]\["]/g, '')
                    exerciseNames.push(exerciseName)
                })
                exerciseNames.forEach((exerciseName) => {
                    workoutPage.exerciseVideo(exerciseName)
                    cy.get('[data-testid="exercise-video-name"]').contains(exerciseName)
                    workoutPage.modalClose()
                })
                workoutPage.selectContinue()
                sessionPage.finishWorkoutSession()
                sessionPage.closeDonationModal()
                finishedWorkoutPage.confirmWorkoutFinished()
                finishedWorkoutPage.gotToProfile()
            })
            .then( () => {
                headerNavigation.checkWorkoutStreak().should('equal', 1)
                profilePage.getWorkoutSessionExercises().then(workoutSessions => {
                    exerciseHistory = workoutSessions
                })               
            })
            .then(() => {
                exerciseNames.forEach((exerciseName) => {
                    expect(exerciseHistory).to.include(exerciseName.toLowerCase())
                })
            })
    })
    it('Successfully deletes a workout from the history', function () {
        let exerciseNames: string [] = [];
        workoutPage.selectBarbell()
        workoutPage.selectContinue()
        workoutPage.muscleSelection('quadriceps')
        workoutPage.selectContinue()
        workoutPage.getAllExerciseNames()
            .then((exercises) => {
                exercises.forEach((exercise) => {
                    const exerciseName = JSON.stringify(exercise).replace(/[\]\["]/g, '')
                    exerciseNames.push(exerciseName)
                })
                exerciseNames.forEach((exerciseName) => {
                    workoutPage.exerciseVideo(exerciseName)
                    cy.get('[data-testid="exercise-video-name"]').contains(exerciseName)
                    workoutPage.modalClose()
                })
                workoutPage.selectContinue()
                sessionPage.finishWorkoutSession()
                sessionPage.closeDonationModal()
                finishedWorkoutPage.confirmWorkoutFinished()
                finishedWorkoutPage.gotToProfile()
            })
            .then( () => {
                exerciseNames.forEach((exerciseName) => {
                    profilePage.deleteWorkout(exerciseName)
                })
            })
            .then(() => {
                headerNavigation.checkWorkoutStreak().should('equal', 0)
            })
    })
    it('Successfully repeats an exercise from the history', function () {
        let firstExercise: string = "";
        let exerciseCount: number = 0;
        workoutPage.selectBarbell()
        workoutPage.selectContinue()
        workoutPage.muscleSelection('quadriceps')
        workoutPage.selectContinue()
        workoutPage.getAllExerciseNames()
            .then((exercise) => {
                const exerciseName = JSON.stringify(exercise).replace(/[\]\["]/g, '')
                firstExercise = exerciseName
                workoutPage.exerciseVideo(exerciseName)
                cy.get('[data-testid="exercise-video-name"]').contains(exerciseName)
                workoutPage.modalClose()
                workoutPage.selectContinue()
                sessionPage.finishWorkoutSession()
                sessionPage.closeDonationModal()
                finishedWorkoutPage.confirmWorkoutFinished()
                finishedWorkoutPage.gotToProfile()
            })
            .then(() => {
                profilePage.repeatWorkout(firstExercise)
                workoutPage.exerciseVideo(firstExercise)
                cy.get('[data-testid="exercise-video-name"]').contains(firstExercise)
                workoutPage.modalClose()
                workoutPage.selectContinue()
                sessionPage.finishWorkoutSession()
                sessionPage.closeDonationModal()
                finishedWorkoutPage.confirmWorkoutFinished()
                finishedWorkoutPage.gotToProfile()
            })
            .then(() => {
                cy.wait(5000)
                profilePage.getWorkoutSessionExercises().then(exerciseHistory => {
                    exerciseHistory.forEach(exercise => {
                        if (exercise.toLowerCase() === firstExercise.toLowerCase()) exerciseCount += 1
                    })
                })
            })
            .then(() => {
                expect(exerciseCount).to.equal(2)
            })
    })
})
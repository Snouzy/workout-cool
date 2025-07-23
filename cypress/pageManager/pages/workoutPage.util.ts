export class WorkoutPage {
    selectBodyweight() {
        cy.get('[data-testid="equipment-select-bodyweight"]').click()
    }
    selectDumbbell() {
        cy.get('[data-testid="equipment-select-dumbbell"]').click()
    }
    selectBarbell() {
        cy.get('[data-testid="equipment-select-barbell"]').click()
    }
    selectKettlebell() {
        cy.get('[data-testid="equipment-select-kettlebell"]').click()
    }
    selectBand() {
        cy.get('[data-testid="equipment-select-band"]').click()
    }
    selectPlate() {
        cy.get('[data-testid="equipment-select-plate"]').click()
    }
    selectPullupBar() {
        cy.get('[data-testid="equipment-select-pull-up bar"]').click()
    }
    selectBench() {
        cy.get('[data-testid="equipment-select-bench"]').click()
    }
    selectContinue() {
        cy.get('[data-testid="workout-builder-continue"]').click()
    }
    selectPrevious() {
        cy.get('[data-testid="workout-builder-previous"]').click()
    }
    muscleSelection(...muscles: string[]) {
        const muscleTestIds: Record<string, string> = {
            biceps: "muscle-selection-biceps",
            forearms: "muscle-selection-forearms",
            chest: "muscle-selection-chest",
            triceps: "muscle-selection-triceps",
            abdominals: "muscle-selection-abdominals",
            obliques: "muscle-selection-obliques",
            quadriceps: "muscle-selection-quadriceps",
            shoulders: "muscle-selection-shoulders",
            calves: "muscle-selection-calves",
            traps: "muscle-selection-traps",
            back: "muscle-selection-back",
            hamstrings: "muscle-selection-hamstrings",
            glutes: "muscle-selection-glutes",
        };

        muscles.forEach(muscle => {
            const testId = muscleTestIds[muscle];
            if (testId) {
                cy.get(`[data-testid="${testId}"]`).click({force: true});
            } else {
                cy.log(`Unknown muscle: ${muscle}`);
            }
        });
    }
    exerciseSelection(...muscles: string[]) {
        muscles.forEach(muscle => {
            if (muscle) {
                cy.get(`[data-testid="exercise-"${muscle}]`)
                    .should('exist')
            } else {
                cy.log(`No exercises found for: ${muscle}`)
            }
        });        
    }
    getAllExerciseNames(): Cypress.Chainable<string[]> {
        return cy.get('[data-testid="exercise-selection-name"]').then($els => {
            const names = Cypress._.map($els, el => el.innerText.trim());
            return names;
        });
    }
    deleteAllExercises() {
        cy.get('[data-testid="exercise-selection-exercises"]')
            .should('have.length.greaterThan', 0)
            .each((exercise) => {
                cy.get('[data-testid="exercise-selection-delete"]').click()
            })
    }
    deleteExercise(exerciseName: string) {
        cy.get('[data-testid="exercise-selection-exercises"]')
            .then(() => 
                cy.get('[data-testid="exercise-selection-name"]')
                    .contains(exerciseName)
                    .then(() => 
                        cy.get('[data-testid="exercise-selection-delete"]').click()
                    )
            )
    }
    shuffleExercise(exerciseName: string) {
        cy.get('[data-testid="exercise-selection-exercises"]')
            .then(() => 
                cy.get('[data-testid="exercise-selection-name"]')
                    .contains(exerciseName)
                    .then(() => 
                        cy.get('[data-testid="exercise-selection-shuffle"]').click()
                    )
            )
    }
    exerciseVideo(exerciseName: string) {
        cy.get('[data-testid="exercise-selection-exercises"]')
            .then(() => 
                cy.get('[data-testid="exercise-selection-name"]')
                    .contains(exerciseName)
                    .then(() => 
                        cy.get('[data-testid="exercise-selection-video"]').click()
                    )
            )
    }
    confirmExerciseIsNotThere(exerciseName: string) {
        cy.get('[data-testid="exercise-selection-name"]')
            .contains(exerciseName)
            .should('not.exist')
    }
    exerciseSelectionError() {
        cy.get('[data-testid="exercise-selection-error"]')
            .should('have.text', 'No exercises found')
    }
}
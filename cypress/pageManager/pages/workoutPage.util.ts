export class WorkoutPage {
    bodyweight() {
        cy.get('[data-testid="equipment-select-bodyweight"]').click()
    }
    dumbbell() {
        cy.get('[data-testid="equipment-select-dumbbell"]').click()
    }
    barbell() {
        cy.get('[data-testid="equipment-select-barbell"]').click()
    }
    kettlebell() {
        cy.get('[data-testid="equipment-select-kettlebell"]').click()
    }
    band() {
        cy.get('[data-testid="equipment-select-band"]').click()
    }
    plate() {
        cy.get('[data-testid="equipment-select-plate"]').click()
    }
    pullupBar() {
        cy.get('[data-testid="equipment-select-pull-up bar"]').click()
    }
    bench() {
        cy.get('[data-testid="equipment-select-bench"]').click()
    }
    continue() {
        cy.get('[data-testid="workout-builder-continue"]').click()
    }
    previous() {
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
                cy.get(`[data-testid="${testId}"]`).click();
            } else {
                cy.log(`Unknown muscle: ${muscle}`);
            }
        });
    }
}
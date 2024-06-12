const glpk = require('glpk.js');

 

// Define parameters

const demandPerWeek = [100, 120, 80, ...]; // Sales demand per week for a year

const numWeeks = 52;

const weeksPerProcess = 10;

const maxBatchSize = 1000; // Maximum batch size constraint

const productionCosts = [...]; // Production costs for each week

 

// Create LP problem

const lp = new glpk.GLPK();

 

// Define decision variables

const batchVars = [];

for (let i = 0; i < numWeeks; i++) {

    batchVars.push(lp.addVar(0, maxBatchSize, 0, glpk.GLP_IV));

}

 

// Define objective function (minimize production costs)

const objCoeffs = [];

for (let i = 0; i < numWeeks; i++) {

    objCoeffs.push(productionCosts[i]);

}

lp.setObjDir(glpk.GLP_MIN);

lp.setObjCoeffs(objCoeffs);

 

// Define constraints (demand requirement)

for (let i = 0; i < numWeeks; i += weeksPerProcess) {

    const constraint = [];

    for (let j = i; j < i + weeksPerProcess; j++) {

        if (j < numWeeks) {

            constraint.push(1);

        }

    }

    lp.addRow(0, demandPerWeek[i / weeksPerProcess], constraint);

}

 

// Solve the LP problem

lp.simplex();

 

// Retrieve optimal solution

const solution = lp.getPrimalSolution();

 

// Output results

console.log('Optimal batch sizes:');

for (let i = 0; i < numWeeks; i++) {

    console.log(`Week ${i + 1}: ${solution[i]}`);

}
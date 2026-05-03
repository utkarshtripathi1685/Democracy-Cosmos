const test = require("node:test");
const assert = require("node:assert/strict");

const {
    getUnansweredStageIndex,
    applyAnswer,
    summarizeSubsetResults
} = require("./election-core.js");

test("getUnansweredStageIndex returns first unanswered stage index", () => {
    const stages = [{ answered: true }, { answered: false }, { answered: false }];
    assert.equal(getUnansweredStageIndex(stages), 1);
});

test("applyAnswer tracks correctness and marks answered state", () => {
    const stages = [{ id: "registration", answered: false, correctIndex: 1 }];
    const userAnswers = {};
    const stateData = { id: "registration", correctIndex: 1 };

    const result = applyAnswer(stages, userAnswers, stateData, 1, false);
    assert.equal(result.isCorrect, true);
    assert.equal(result.answeredQuestionsDelta, 1);
    assert.equal(stages[0].answered, true);
    assert.equal(userAnswers.registration, true);
});

test("applyAnswer does not mutate stages in crisis mode", () => {
    const stages = [{ id: "registration", answered: false }];
    const userAnswers = {};
    const stateData = { id: "crisis_1", correctIndex: 0 };

    const result = applyAnswer(stages, userAnswers, stateData, 1, true);
    assert.equal(result.isCorrect, false);
    assert.equal(result.answeredQuestionsDelta, 0);
    assert.equal(stages[0].answered, false);
});

test("summarizeSubsetResults returns strong/weak breakdown", () => {
    const subset = [{ id: "a", label: "A" }, { id: "b", label: "B" }];
    const answers = { a: true, b: false };
    const summary = summarizeSubsetResults(subset, answers);

    assert.deepEqual(summary.strong, ["A"]);
    assert.deepEqual(summary.weak, ["B"]);
    assert.equal(summary.percent, 50);
});

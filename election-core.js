;(function attachElectionCore(globalScope) {
    "use strict";

    function getUnansweredStageIndex(stages) {
        return stages.findIndex((stage) => !stage.answered);
    }

    function applyAnswer(stages, userAnswers, stateData, selectedIndex, isCrisis) {
        const isCorrect = selectedIndex === stateData.correctIndex;
        userAnswers[stateData.id] = isCorrect;

        let answeredQuestionsDelta = 0;
        if (!isCrisis) {
            const stage = stages.find((candidate) => candidate.id === stateData.id);
            if (stage && !stage.answered) {
                stage.answered = true;
                answeredQuestionsDelta = 1;
            }
        }

        return {
            isCorrect: isCorrect,
            answeredQuestionsDelta: answeredQuestionsDelta
        };
    }

    function summarizeSubsetResults(subset, userAnswers) {
        const strong = [];
        const weak = [];
        let scoreCount = 0;

        subset.forEach((item) => {
            if (userAnswers[item.id]) {
                scoreCount++;
                strong.push(item.label || item.id);
            } else if (userAnswers[item.id] === false) {
                weak.push(item.label || item.id);
            }
        });

        const total = Math.max(1, subset.length);
        const percent = Math.round((scoreCount / total) * 100);
        return { strong: strong, weak: weak, total: total, scoreCount: scoreCount, percent: percent };
    }

    const api = {
        getUnansweredStageIndex: getUnansweredStageIndex,
        applyAnswer: applyAnswer,
        summarizeSubsetResults: summarizeSubsetResults
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

    globalScope.ElectionCore = api;
})(typeof window !== "undefined" ? window : globalThis);

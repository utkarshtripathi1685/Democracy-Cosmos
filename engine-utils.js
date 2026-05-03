;(function attachEngineUtils(globalScope) {
    "use strict";

    function clampScore(score) {
        const numeric = Number(score);
        if (!Number.isFinite(numeric)) return 0;
        return Math.max(0, Math.min(100, Math.round(numeric)));
    }

    function buildProgressData(answeredQuestions, totalQuestions) {
        const total = Math.max(1, Number(totalQuestions) || 1);
        const answered = Math.max(0, Number(answeredQuestions) || 0);
        const ratio = Math.max(0, Math.min(1, answered / total));
        const percent = Math.round(ratio * 100);
        const filled = Math.round(ratio * 10);
        const empty = 10 - filled;
        const bar = "█".repeat(filled) + "░".repeat(empty);

        return {
            percent: percent,
            bar: bar,
            text: "[" + bar + "] " + percent + "%"
        };
    }

    function getScoreEndpoint() {
        const runtimeConfig = globalScope.__PROMPTWAR_CONFIG__ || {};
        const endpoint = runtimeConfig.scoreEndpoint || "";
        if (!endpoint) return "";

        try {
            const parsed = new URL(endpoint, globalScope.location.href);
            if (!/^https?:$/.test(parsed.protocol)) return "";
            return parsed.toString();
        } catch (error) {
            return "";
        }
    }

    function getFirebaseConfig() {
        const runtimeConfig = globalScope.__PROMPTWAR_CONFIG__ || {};
        const firebase = runtimeConfig.firebase || {};
        const projectId = firebase.projectId || "";
        const apiKey = firebase.apiKey || "";
        if (!projectId || !apiKey) {
            return null;
        }
        return { projectId: String(projectId), apiKey: String(apiKey) };
    }

    function buildFirestorePayload(payload) {
        return {
            fields: {
                score: { integerValue: String(clampScore(payload.score)) },
                mode: { stringValue: String(payload.mode || "standard") },
                timestamp: { integerValue: String(payload.timestamp || Date.now()) }
            }
        };
    }

    async function safeJsonPost(endpoint, payload) {
        if (!endpoint) return { ok: false, status: 0, skipped: true };
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            mode: "cors",
            credentials: "omit",
            cache: "no-store"
        });
        return { ok: response.ok, status: response.status, skipped: false };
    }

    async function saveScoreToFirestore(payload) {
        const firebase = getFirebaseConfig();
        if (!firebase) return { ok: false, status: 0, skipped: true };
        const url =
            "https://firestore.googleapis.com/v1/projects/" +
            encodeURIComponent(firebase.projectId) +
            "/databases/(default)/documents/election_scores?key=" +
            encodeURIComponent(firebase.apiKey);
        return safeJsonPost(url, buildFirestorePayload(payload));
    }

    async function reportScoreWithGoogleServices(payload) {
        const results = [];
        const cloudRunResult = await safeJsonPost(getScoreEndpoint(), payload);
        results.push({ channel: "cloud_run", result: cloudRunResult });

        const firestoreResult = await saveScoreToFirestore(payload);
        results.push({ channel: "firestore", result: firestoreResult });

        return results;
    }

    const api = {
        clampScore: clampScore,
        buildProgressData: buildProgressData,
        getScoreEndpoint: getScoreEndpoint,
        getFirebaseConfig: getFirebaseConfig,
        buildFirestorePayload: buildFirestorePayload,
        safeJsonPost: safeJsonPost,
        saveScoreToFirestore: saveScoreToFirestore,
        reportScoreWithGoogleServices: reportScoreWithGoogleServices
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = api;
    }

    globalScope.EngineUtils = api;
})(typeof window !== "undefined" ? window : globalThis);

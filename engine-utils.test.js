const test = require("node:test");
const assert = require("node:assert/strict");

global.fetch = async () => ({ ok: true, status: 200 });
global.location = { href: "https://example.org/" };

const {
    clampScore,
    buildProgressData,
    getScoreEndpoint,
    safeJsonPost,
    getFirebaseConfig,
    buildFirestorePayload,
    saveScoreToFirestore,
    reportScoreWithGoogleServices
} = require("./engine-utils.js");

test("clampScore keeps value within 0-100", () => {
    assert.equal(clampScore(25.2), 25);
    assert.equal(clampScore(-5), 0);
    assert.equal(clampScore(1000), 100);
    assert.equal(clampScore("bad"), 0);
});

test("buildProgressData returns stable bar text", () => {
    const data = buildProgressData(3, 5);
    assert.equal(data.percent, 60);
    assert.equal(data.text, "[██████░░░░] 60%");
});

test("getScoreEndpoint validates protocol and URL shape", () => {
    global.__PROMPTWAR_CONFIG__ = { scoreEndpoint: "https://api.example.org/save-score" };
    assert.equal(getScoreEndpoint(), "https://api.example.org/save-score");

    global.__PROMPTWAR_CONFIG__ = { scoreEndpoint: "javascript:alert(1)" };
    assert.equal(getScoreEndpoint(), "");
});

test("safeJsonPost returns request status object", async () => {
    const result = await safeJsonPost("https://api.example.org/save-score", { score: 80 });
    assert.equal(result.ok, true);
    assert.equal(result.status, 200);

    const skipped = await safeJsonPost("", { score: 80 });
    assert.equal(skipped.skipped, true);
});

test("getFirebaseConfig validates firebase runtime setup", () => {
    global.__PROMPTWAR_CONFIG__ = { firebase: { projectId: "demo", apiKey: "abc123" } };
    assert.deepEqual(getFirebaseConfig(), { projectId: "demo", apiKey: "abc123" });

    global.__PROMPTWAR_CONFIG__ = { firebase: { projectId: "", apiKey: "" } };
    assert.equal(getFirebaseConfig(), null);
});

test("buildFirestorePayload maps fields to Firestore schema", () => {
    const payload = buildFirestorePayload({ score: 95, mode: "simulation", timestamp: 123 });
    assert.equal(payload.fields.score.integerValue, "95");
    assert.equal(payload.fields.mode.stringValue, "simulation");
    assert.equal(payload.fields.timestamp.integerValue, "123");
});

test("saveScoreToFirestore skips when firebase config missing", async () => {
    global.__PROMPTWAR_CONFIG__ = {};
    const result = await saveScoreToFirestore({ score: 80, mode: "standard", timestamp: 1 });
    assert.equal(result.skipped, true);
});

test("reportScoreWithGoogleServices returns channel-level results", async () => {
    global.__PROMPTWAR_CONFIG__ = {
        scoreEndpoint: "https://api.example.org/save-score",
        firebase: { projectId: "demo-project", apiKey: "abc123" }
    };
    const result = await reportScoreWithGoogleServices({ score: 70, mode: "standard", timestamp: 2 });
    assert.equal(result.length, 2);
    assert.equal(result[0].channel, "cloud_run");
    assert.equal(result[1].channel, "firestore");
});

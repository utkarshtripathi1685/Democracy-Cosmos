const test = require("node:test");
const assert = require("node:assert/strict");

global.fetch = async () => ({ ok: true, status: 200 });
global.location = { href: "https://example.org/" };

const {
    clampScore,
    buildProgressData,
    getScoreEndpoint,
    safeJsonPost
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

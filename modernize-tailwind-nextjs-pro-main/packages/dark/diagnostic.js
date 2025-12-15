
const fetch = require('node-fetch');
const OTPAuth = require('otpauth');

const BASE_URL = "https://notifyhub-sandbox-1028525309597.us-central1.run.app";
const GRAPHQL_URL = `${BASE_URL}/graphql/`;
const CLIENT_ID = "N2xGLLGM8zDEiHeFei4gCk1pYMtTns4xJT9ad2gh"; // Broken
// const CLIENT_ID = ""; // Maybe valid for public interaction?

const TEST_USER = {
    username: `test_user_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: "TestPassword123!"
};

async function runDiagnostics() {
    console.log("=== STARTING DIAGNOSTICS ===");
    console.log(`Target: ${BASE_URL}`);

    let mfaSecret = null;
    let mfaChallengeId = null;
    let accessToken = null;

    // 1. Test Signup
    console.log("\n[1] Testing Signup...");
    try {
        const signupResp = await fetch(`${BASE_URL}/signup/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const signupData = await signupResp.json();
        console.log(`Status: ${signupResp.status}`);
        // console.log(`Body:`, signupData);

        if (signupResp.ok && signupData.mfa && signupData.mfa.secret) {
            mfaSecret = signupData.mfa.secret;
            console.log("SUCCESS: Captured MFA Secret:", mfaSecret);
        } else {
            console.log("Signup did not return MFA secret directly?", signupData);
        }

    } catch (e) {
        console.error("Signup failed:", e.message);
    }

    // 4. Test /login/password/ (Alternative Auth)
    console.log("\n[2] Testing /login/password/...");
    try {
        const loginResp = await fetch(`${BASE_URL}/login/password/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: TEST_USER.username,
                password: TEST_USER.password
            })
        });
        const loginData = await loginResp.json();
        console.log(`Status: ${loginResp.status}`);

        if (loginData.mfa_required) {
            mfaChallengeId = loginData.mfa_challenge_id;
            console.log("MFA Required. Challenge ID:", mfaChallengeId);
        } else {
            console.log("Login did not request MFA?", loginData);
            if (loginData.access_token) accessToken = loginData.access_token;
        }
    } catch (e) {
        console.error("Login Password failed:", e.message);
    }

    // 5. Test /mfa/verify/ with Time Drift Check
    if (mfaChallengeId && mfaSecret) {
        console.log("\n[3] Testing /mfa/verify/ (Checking Time Drift)...");

        const offsets = [0, -1, 1, -2, 2, -4, 4]; // Check +/- 30s, 60s, 120s
        let successToken = null;

        for (const offset of offsets) {
            if (successToken) break;

            // Generate TOTP with offset
            const totp = new OTPAuth.TOTP({
                issuer: 'NotifyHub',
                label: TEST_USER.username,
                algorithm: 'SHA1',
                digits: 6,
                period: 30,
                secret: OTPAuth.Secret.fromBase32(mfaSecret)
            });

            // Adjust time: offset * period (30s) * 1000ms
            const time = Date.now() + (offset * 30 * 1000);
            const code = totp.generate({ timestamp: time });
            console.log(`Trying Offset ${offset} (Time: ${new Date(time).toISOString()}) -> Code: ${code}`);

            try {
                const verifyResp = await fetch(`${BASE_URL}/mfa/verify/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        mfa_challenge_id: mfaChallengeId,
                        totp_code: code
                    })
                });
                const verifyData = await verifyResp.json();
                console.log(`Status: ${verifyResp.status} | Msg: ${verifyData.message || 'OK'}`);

                if (verifyResp.ok && (verifyData.access_token || verifyData.token)) {
                    console.log("SUCCESS! Drift Found:", offset * 30, "seconds");
                    successToken = verifyData.access_token || verifyData.token;
                    accessToken = successToken;
                }
            } catch (e) {
                console.error("MFA Verify Request failed:", e.message);
            }

            // Small delay to be nice
            await new Promise(r => setTimeout(r, 500));
        }

        if (!accessToken) {
            console.log("ALL MFA Attempts Failed.");
        }
    } else {
        console.log("Skipping MFA Verify check (missing secret or challenge).");
    }

    // 6. Test GraphQL with Real Token (if obtained)
    if (accessToken) {
        console.log("\n[4] Testing GraphQL with REAL TOKEN...");
        try {
            const query = `
                query {
                    reminders(active: true) {
                        id
                        title
                    }
                }
            `;
            const gqlResp = await fetch(GRAPHQL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ query })
            });
            // Try to get text first in case of 500 HTML
            const text = await gqlResp.text();
            console.log(`Status: ${gqlResp.status}`);
            console.log(`Body Preview: ${text.substring(0, 500)}`);
        } catch (e) {
            console.error("Authenticated GraphQL failed:", e.message);
        }
    }

    // 6. Test Unauthenticated Data Access (Last Resort)
    console.log("\n[6] Testing Unauthenticated GraphQL Data Query...");
    try {
        const query = `
            query {
                departments {
                    id
                    name
                }
            }
        `;
        const gqlResp = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const text = await gqlResp.text();
        console.log(`Status: ${gqlResp.status}`);
        console.log(`Body Preview: ${text.substring(0, 500)}`);
    } catch (e) {
        console.error("Unauth GraphQL failed:", e.message);
    }

    console.log("=== DIAGNOSTICS COMPLETE ===");
}

runDiagnostics();

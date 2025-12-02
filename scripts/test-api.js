
const baseUrl = "http://localhost:3000/api";

async function testRegistration() {
    console.log("Testing Registration...");
    const email = `test.student.${Date.now()}@college.edu`;
    const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            role: "student",
            email,
            password: "password123",
            firstName: "Test",
            lastName: "Student",
            department: "dept-cse",
            batch: "2024",
            rollNumber: "CSE2024999",
            phone: "9876543210"
        }),
    });
    const data = await res.json();
    console.log("Registration Response:", data);
    return { email, password: "password123" };
}

async function testLogin(creds) {
    console.log("Testing Login...");
    const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
    });
    const data = await res.json();
    console.log("Login Response:", data);

    // Extract cookies manually if needed, but fetch in node doesn't persist cookies automatically like a browser.
    // For this simple test, we just check if login returns success.
    // To test protected routes, we'd need to handle the Set-Cookie header.
    return res.headers.get("set-cookie");
}

async function runTests() {
    try {
        const creds = await testRegistration();
        if (creds) {
            const cookies = await testLogin(creds);
            if (cookies) {
                console.log("Login successful, cookies received.");
                // We could test protected routes here if we parse cookies and send them back.
            }
        }
    } catch (e) {
        console.error("Test failed:", e);
    }
}

runTests();

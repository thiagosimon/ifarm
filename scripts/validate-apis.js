const http = require("http");

function makeReq(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : "";
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    if (data) headers["Content-Length"] = Buffer.byteLength(data);
    const req = http.request(
      { hostname: "localhost", port: 3000, path, method, headers },
      (res) => {
        let b = "";
        res.on("data", (c) => (b += c));
        res.on("end", () => resolve({ status: res.statusCode, body: b }));
      },
    );
    req.on("error", (e) => resolve({ status: 0, body: e.message }));
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  // Login to get token
  const loginRes = await makeReq("POST", "/api/v1/auth/login", {
    email: "retailer@test.com",
    password: "retailer123",
  });
  console.log(
    "1. POST /api/v1/auth/login =>",
    loginRes.status,
    loginRes.status === 200 ? "OK" : "FAIL",
  );

  let token = "";
  if (loginRes.status === 200) {
    const parsed = JSON.parse(loginRes.body);
    token = parsed.accessToken;
  }

  const tests = [
    // Public
    ["GET", "/health", null, false],
    ["GET", "/api/v1/catalog/products", null, false],
    [
      "POST",
      "/api/v1/identity/retailers",
      {
        businessName: "TestCo",
        ownerName: "Test",
        email: "validate@test.com",
        phone: "11999999999",
        federalTaxId: "12345678901234",
      },
      false,
    ],
    ["GET", "/api/v1/identity/team-members", null, false],
    ["GET", "/api/v1/identity/customers", null, false],
    ["POST", "/api/v1/auth/refresh", { refreshToken: "invalid-token" }, false],
    // Protected (with token)
    ["GET", "/api/v1/orders/orders", null, true],
    ["GET", "/api/v1/payments/payments", null, true],
    ["GET", "/api/v1/notifications/notifications", null, true],
    ["GET", "/api/v1/reviews/reviews", null, true],
    ["GET", "/api/v1/quotes/quotations", null, true],
  ];

  let passed = 1; // login already passed
  let total = tests.length + 1;

  for (let i = 0; i < tests.length; i++) {
    const [method, path, body, needsAuth] = tests[i];
    const r = await makeReq(method, path, body, needsAuth ? token : null);
    // Accept any non-5xx as "reachable"
    const ok = r.status > 0 && r.status < 500;
    if (ok) passed++;
    const detail = r.status >= 400 ? " " + r.body.substring(0, 80) : "";
    console.log(
      i +
        2 +
        ". " +
        method +
        " " +
        path +
        " => " +
        r.status +
        (ok ? " OK" : " FAIL") +
        detail,
    );
  }

  console.log(
    "\n=== RESULT: " + passed + "/" + total + " endpoints reachable ===",
  );
}

run().catch((e) => console.error(e));

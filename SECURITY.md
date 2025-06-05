# 🛡️ Security Policy

## 🚧 Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |

This project is actively maintained, including security updates when necessary.

---

## 🔐 Security Considerations

This project was developed following reasonable measures to mitigate common security risks in modern web applications:

- **Authentication:** JWT-based authentication using Passport Strategy. All endpoints require authentication.
- **Authorization:** Access control ensures that data is only accessible to its rightful owners.
- **Secure Data Storage:** PostgreSQL is used with appropriate relational constraints to protect data integrity.
- **Session Management:** Stateless architecture using JWT.
- **Cache:** Redis is used with controlled key management to minimize unnecessary data exposure.
- **Runtime Environment:** Docker containers configured to prevent processes from running as root.
- **Input Validation:** Strict validation at the DTO level using `class-validator` in NestJS.
- **Error Handling:** Controlled responses that avoid exposing internal system details.
- **Secure Configuration:** CORS policies are restrictive by default and environment variables are securely managed.

---

## 📣 Vulnerability Reporting

If you discover a potential security vulnerability, please report it responsibly.

- **Email:** hormigadev7@gmail.com
- **Note:** Do not open public GitHub issues for security-related concerns.

**Expected response time:** within **72 hours**.

---

## 📜 Disclosure Policy

- Reports will be evaluated and, if confirmed, handled privately.
- Public disclosure will occur **only after a patch is available**.
- Credit will be given to the reporter unless anonymity is requested.

---

## 🔍 Out of Scope Vulnerabilities

- Issues caused by insecure configurations made by the user (e.g., running without `.env`, exposing internal ports like Redis or PostgreSQL, disabling authentication, etc.).
- Vulnerabilities in third-party dependencies that already have available upstream patches.

---

## 🚀 Secure Deployment Recommendations

- Ensure all environment variables are properly configured (`JWT_SECRET`, `DATABASE_URL`, etc.).
- Never expose sensitive service ports (e.g., Redis, PostgreSQL) to the public. Use Docker internal networks or VPNs.
- Always use HTTPS in production.
- Rotate secrets and credentials periodically.
- Use trusted container images and run security scans (e.g., with Trivy or Docker Scout).

---

## 🔥 Why This Matters

This document reflects this project's commitment to applying reasonable measures to mitigate common security risks. While no system is entirely immune, deliberate efforts have been made to provide a level of protection aligned with modern software development standards.

---

# Project Working Agreement

## Purpose

This repository is a learning workspace for a full-stack people directory based on the documented feature set of [shxrox/Crud-FullStack](https://github.com/shxrox/Crud-FullStack). Reimplement its behavior independently; do not copy its source files. Credit the reference in project documentation. The user has already built a To-Do project; do not repeat it.

## Coaching agreement

The user is the project author and writes the project code. Act as a tutor/coach:
- Explain one concept and one bite-sized task at a time.
- Offer progressive hints and explain errors before giving a full solution.
- Review and debug code the user shares; help them trace requests and data flow.
- Do not edit project code or provide a complete implementation unless the user explicitly asks for code, a sample, or a direct edit.

## Project scope

Build a portfolio-ready directory with user registration and sign-in; authenticated users can browse, search, sort, and paginate people, while admins can create, update, and delete them. Each person has a name, age, and unique email.

Use the stack and boundaries documented in `project/PROJECT.md`: React, TypeScript, Vite, Java, Spring Boot, Spring Security, Spring Data JPA, Hibernate, Jakarta Bean Validation, MySQL, and Flyway. Keep the backend layered (controller -> service -> repository -> database) and build user-facing behavior as vertical slices across the frontend and backend.

Use short-lived RS256 access JWTs in memory on the client and random opaque refresh tokens in Secure, HttpOnly cookies. Hash refresh tokens in the database, rotate and revoke them, protect cookie-based auth endpoints against CSRF, and enforce `USER`/`ADMIN` permissions. Never store credentials or tokens in tracked files or browser local/session storage.

The API contract is documented in `project/PROJECT.md`. Its main route groups are `/api/auth/*` and `/api/people`, with read operations for authenticated users and write operations restricted to admins.

## Learning outcomes

Help the user practice Java and SQL foundations; JPA/Hibernate, JPQL, transactions, and schema migrations; Spring dependency injection, validation, DTOs, errors, HTTP, and security; React fundamentals and TypeScript; asynchronous UI states and accessibility; API integration, CORS, and CSRF; and tracing a request from the browser through the database and back.

## Working together

- Follow the phase sequence in `project/phases.md`; keep work small and understandable.
- Ask the user to implement each task, then review their code and explain the result.
- Do not add or run tests unless the user asks for testing or verification; when asked, report what ran and any environment limits.
- Do not deploy, publish, or contact anyone unless explicitly requested.
- Keep optional extensions out of the core project unless the user reprioritizes them.

## Project guides

- `project/PROJECT.md` is the source of truth for scope, architecture, API, versions, and learning outcomes.
- `project/phases.md` is the source of truth for phase order and exit checks.

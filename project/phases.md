# Build Phases

This roadmap turns [PROJECT.md](./PROJECT.md) into a sequence of small, reviewable milestones. It assumes roughly six to eight weeks of steady practice; take longer when a concept needs more time. Finish each phase's exit check before adding the next layer of complexity.

## Coaching agreement

The learner is the author and writes the project code. The assistant coaches: explain the next concept, give one bite-sized task at a time, offer hints before full solutions, and review/debug code the learner shares. Do not make code edits unless the learner explicitly asks for code or a direct edit.

## Phase 0 — Set up the project and agree on the contract

**Focus:** understand the app shape and get each technology running locally.

- Review the project scope, API outline, and frontend/backend boundaries.
- Use the installed JDK 17 (supported by Spring Boot 4.1.x), Spring Boot 4.1.x, Node.js 24 LTS, and the existing Vite React/TypeScript app. Set up MySQL 8.4 LTS in Phase 1.
- Use Maven and commit its Maven Wrapper; use npm and the existing `package-lock.json` (`npm ci`) for repeatable installs.
- Keep backend and frontend configuration separate; load database credentials from environment variables.
- Start each app and confirm the backend responds on `/api/health` and the frontend can display that response.
- Write down the local run steps and required environment variables without committing secrets.

**Exit check:** the frontend and backend both start locally, the frontend reaches `/api/health`, and setup steps are documented.

## Phase 1 — Java, SQL, and the first database migration

**Focus:** learn the language and relational model before adding framework behavior.

- Practice Java classes, constructors, interfaces, access modifiers, collections, generics, and exceptions.
- Design the `people` table: ID, name, age, and unique email. Identify sensible field limits and constraints.
- Learn primary keys, unique constraints, indexes, and basic SQL queries.
- Install and start MySQL 8.4 LTS locally; create a development database and an application user with only the required database permissions.
- Add Flyway and create the first versioned migration. Let migrations own schema changes; use Hibernate to validate mappings during development.

**Exit check:** connect the backend to the local MySQL database, explain the table and its constraints, and apply the migration to a fresh database.

## Phase 2 — JPA, Hibernate, and layered CRUD

**Focus:** follow data through the backend layers.

- Map the people table to a JPA entity and learn what Hibernate does as the JPA implementation.
- Add a Spring Data repository, service, and controller.
- Implement list, detail, create, update, and delete operations.
- Learn dependency injection, entity lifecycle, persistence context, and transaction boundaries.
- Exercise the routes with representative requests and inspect the persisted database rows.

**Exit check:** trace one request through controller -> service -> repository -> Hibernate/JPA -> MySQL and back. The five people operations persist and return data.

## Phase 3 — DTOs, validation, JPQL, and API behavior

**Focus:** make the API safe and predictable for its clients.

- Add request and response DTOs and explicit mapping; do not return JPA entities from controllers.
- Validate names, age, and email on the server. Keep the unique email rule in both the API behavior and database constraint.
- Add centralized exception handling and consistent error response bodies.
- Return appropriate statuses for success, invalid input, duplicates, missing records, and unauthenticated/forbidden requests as security is added later.
- Add a JPQL query for name/email search and pageable/sorted results with bounded page sizes.
- Learn the difference between derived repository queries and JPQL `@Query`; inspect query behavior and avoid N+1 problems.

**Exit check:** create/update reject invalid input clearly, duplicates and missing IDs have readable errors, and search/pagination use the documented DTO contract.

## Phase 4 — Accounts, Spring Security, and JWT

**Focus:** authenticate users and enforce permissions at the API boundary.

- Add user and hashed opaque refresh-token persistence with migrations. Registration always assigns `USER`.
- Hash and verify passwords with BCrypt; never return password hashes in DTOs.
- Configure Spring Security as a stateless bearer-token API, using its OAuth2 Resource Server/JWT support rather than a hand-written JWT filter.
- Implement registration, login, refresh, logout, and current-user endpoints.
- Provide a CSRF-token endpoint; require the token on login, refresh, and logout requests that set or use cookies.
- Issue short-lived RS256-signed access JWTs; validate signature, expiry, issuer, audience, and required claims with an explicit algorithm allowlist. Keep claims minimal.
- Put random opaque refresh tokens in Secure, HttpOnly cookies; persist only hashes, rotate on refresh, and revoke on logout.
- Configure CSRF protection for cookie-based auth endpoints, exact-origin local CORS, and role rules. Only `ADMIN` can mutate people; provide an admin through a documented local-development setup.
- Exercise missing, expired, malformed, revoked, and insufficient-role cases.

**Exit check:** the complete auth flow works; users can browse, only admins can mutate, and the learner can explain access tokens, refresh tokens, BCrypt, CORS, and CSRF in this design.

## Phase 5 — React and TypeScript fundamentals

**Focus:** learn React with small UI pieces before connecting every screen to the API.

- Practice JSX, function components, component composition, props, state, and event handlers.
- Use conditional rendering, lists with stable keys, and controlled forms.
- Practice one-way data flow and lifting shared state to the right component.
- Use `useState`, `useEffect` with cleanup, `useContext` for the authenticated user, and `useRef`; write one small custom hook.
- Add React Router and typed props/API models. Learn how state changes cause renders; derive values such as filtered results instead of storing duplicate state.
- Build sign-in/registration forms, a people list, a detail view, and a reusable person form using temporary/mock data as needed.
- Use semantic HTML, accessible labels and feedback, and responsive CSS. Learn memoization as an optimization to apply only when justified.

**Exit check:** explain how props, state, events, hooks, keys, forms, routing, and rendering work in the screens built so far.

## Phase 6 — Connect the frontend to the API

**Focus:** deliver complete vertical feature slices while keeping each layer's responsibilities clear. The backend APIs and React fundamentals exist by now; connect one complete browser-to-database behavior before starting the next.

1. **Authentication slice:** connect registration, login, current-user, refresh, and logout through the API client and React auth context/routes. Keep access tokens in memory, use the cookie only on auth endpoints, attach CSRF tokens where required, and handle reload/expired-token behavior.
2. **Browse slice:** connect the people list and detail view through API client -> controller/DTO -> service -> repository/database. Add loading, error, and empty states.
3. **Search and paging slice:** connect the search, sort, and pagination controls to the JPQL/API query and show the returned page state.
4. **Admin management slice:** connect person create, edit, and delete forms/actions; show server validation and duplicate-email errors; enforce admin-only behavior in the backend and reflect the role in the UI.

After each slice, trace one request from the UI to MySQL and back. Keep form state and server state understandable; avoid adding a global state library unless the app demonstrates a real need.

**Exit check:** complete a user browse flow and an admin create/edit/delete flow in the browser against MySQL, including sign-in and refresh behavior.

## Phase 7 — Quality, documentation, and review

**Focus:** make the project understandable and reliable to run and explain.

- Add focused backend tests with Spring Boot Test, JUnit Jupiter, and Mockito; use Testcontainers with MySQL for database integration tests.
- Add frontend tests with Vitest, React Testing Library, and `user-event`; optionally add one Playwright end-to-end smoke path.
- Review validation, permissions, token handling, error responses, database constraints, and accessibility.
- Document prerequisites, environment variables, migrations, startup steps, API routes, and how to create a local admin.
- Add API documentation if it fits the remaining time; keep cloud, deployment, and other optional extensions out of the core milestone.
- Review the full request path and write a short explanation of how the main features work.

**Exit check:** a new learner can set up the project from the docs; focused tests pass; the learner can explain the browser -> React -> API -> service -> repository -> database flow.

## Suggested pacing

| Week | Main focus |
| --- | --- |
| 1 | Phase 0 and Phase 1: setup, Java/SQL foundations, first migration |
| 2 | Phase 2: JPA/Hibernate and layered CRUD |
| 3 | Phase 3: DTOs, validation, JPQL, and pagination |
| 4–5 | Phase 4: Spring Security, JWT, accounts, and authorization |
| 5–6 | Phase 5: React and TypeScript fundamentals |
| 7 | Phase 6: frontend/backend integration |
| 8 | Phase 7: tests, documentation, and review |

The week ranges are estimates, and phases may overlap slightly. Prefer understanding and explaining each request flow over meeting a calendar date.

## Working rhythm

1. The coach explains the phase goal and identifies the one new concept being practiced.
2. The coach gives one small coding task; the learner writes the code.
3. The learner runs the relevant app and shares errors, output, or the changed code for review.
4. The coach explains what happened from input to output and gives hints or a focused correction.
5. The learner explains the request flow and records a useful note before moving on.

Keep the scope from [PROJECT.md](./PROJECT.md): no deployment, payments, unrelated features, or optional extensions until the core phases are complete or explicitly reprioritized.

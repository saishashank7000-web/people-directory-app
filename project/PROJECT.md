# Full Stack User Directory

## Project goal

Build a portfolio-ready full-stack people directory that teaches the fundamentals of Java, Spring Boot, relational databases, security, and React. The initial estimate is six to eight weeks at a steady learning pace; spend longer where the concepts need practice.

This project is based on the documented feature set of [`shxrox/Crud-FullStack`](https://github.com/shxrox/Crud-FullStack), an open-source React, Spring Boot, and MySQL CRUD project. Recreate the behavior in original code; do not copy its source files. Credit the reference when sharing this project. This is a learning project, not a repeat of the To-Do app the learner has already completed.

## What the finished app should do

- Let visitors register and sign in, then view and search the people directory.
- Let administrators add, edit, and delete people. Each person has a name, age, and unique email address.
- Provide paginated and sortable results, with search by name or email.
- Show clear validation messages and loading, error, empty, and unauthorized states.
- Protect passwords and restrict write operations by role.

Validate data in the UI and on the server. Return useful HTTP status codes and consistent, readable API errors. Never store or return a plaintext password.

## Technology and boundaries

- **Frontend:** React, TypeScript, Vite, HTML, CSS, React Router, and a typed HTTP API client.
- **Backend:** Java 25 LTS, Spring Boot 4.1.x, Spring Web, Spring Security, Spring Data JPA, and Jakarta Bean Validation. Use the latest stable patch in the selected release line.
- **Persistence:** MySQL, JPA entity mappings, and Hibernate as the JPA implementation. Use Flyway for versioned schema migrations.
- **Build:** Maven, using the Maven Wrapper (`mvnw`/`mvnw.cmd`) so the project pins a reproducible Maven version.
- **API models:** Request and response DTOs, with explicit mapping between DTOs and entities.
- **Backend layers:** controller -> service -> repository -> entity/database. Keep HTTP concerns in controllers and business rules in services.
- **Frontend layers:** pages/components -> typed API client -> REST API.

Keep the code organized in these layers, but build user-visible behavior as vertical slices across them. For example, implement “browse people” through the repository, service, controller/DTO, API client, and React list before moving on to the next behavior. This gives each feature a complete request path without collapsing the layer boundaries.

Use stateless JWT authentication for the main implementation: short-lived RS256-signed access JWTs sent in the `Authorization: Bearer` header, plus random opaque refresh tokens in Secure, HttpOnly cookies. Keep the private signing key on the backend and the public verification key available to the decoder; explicitly allow the chosen algorithm. Keep the access token in React memory only. On a page reload, call the refresh endpoint to receive a new access token; if refresh fails, return the user to sign-in. Do not store tokens in `localStorage` or `sessionStorage`. Hash refresh tokens before saving them, rotate them on refresh, and revoke them on logout. Logout ends future refreshes; an already-issued access JWT remains valid only until its short expiry. Use BCrypt for passwords and `USER`/`ADMIN` role authorization. Protect login/refresh/logout cookie endpoints against CSRF, allow only the exact local frontend origin in CORS, and enable credentialed requests only where needed. Use Spring Security's OAuth2 Resource Server/JWT support and its JOSE/Nimbus APIs; do not write custom token parsing or cryptography. Keep signing keys in environment-based configuration. Include only minimum identity and role claims in access JWTs; never put passwords or sensitive personal data in a token. Registration creates a `USER`; create an administrator only through a documented local-development setup.

## Recommended versions and tools

Use maintained stable/LTS releases, not previews. This baseline was checked on 2026-11-10; update patch releases deliberately and keep lockfiles/wrappers committed.

| Area | Recommendation |
| --- | --- |
| Java | JDK 17 works with this project and is already installed; JDK 25 is the latest LTS if setting up a new machine |
| Spring Boot | 4.1.x stable line; let its dependency management choose compatible Spring/Hibernate versions |
| Build | Maven 3.10.x through the committed Maven Wrapper; use `./mvnw` or `mvnw.cmd` |
| Database | MySQL 8.4 LTS |
| Node | Node.js 24 LTS and npm; record the project Node version and run `npm ci` from the committed lockfile |
| Frontend | Keep the versions already pinned in this repository's `package-lock.json` (React 19.3, Vite 8, TypeScript 6) and update them intentionally |
| Backend tests | Spring Boot Test, JUnit Jupiter, and Mockito; add Testcontainers with MySQL for integration tests |
| Frontend tests | Vitest, React Testing Library, and `user-event`; use Playwright only for a small end-to-end smoke path if time permits |
| Daily tools | VS Code with the Java and Spring Boot extension packs, browser DevTools, Postman for API requests, and DBeaver for inspecting MySQL |

Prefer the Spring Boot parent/BOM over manually pinning Spring, Hibernate, and Spring Security versions. Use the npm lockfile for exact frontend dependency versions. Keep `.env.example` limited to placeholder values, never real credentials.

Keep database credentials and other sensitive configuration out of source control and provide them through environment variables. Use database migrations rather than relying on Hibernate to change a shared schema automatically. Keep production cookie flags enabled (`Secure`, `HttpOnly`, and an appropriate `SameSite` policy); configure local development separately without weakening production settings. Keep this project focused: no payments, cloud services, Docker, or deployment unless requested.

## API outline

All routes use the `/api` prefix and JSON request/response bodies. Protected API requests use a bearer access token. Login, refresh, and logout use CSRF protection; refresh and logout also use the secure refresh-token cookie. The frontend keeps access tokens in memory and obtains a fresh one after reload using the refresh cookie.

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a user with the `USER` role |
| `GET` | `/api/auth/csrf` | Public | Provide a CSRF token for cookie-setting/sign-out auth requests |
| `POST` | `/api/auth/login` | Public + CSRF token | Sign in, return an access token, and set a refresh-token cookie |
| `POST` | `/api/auth/refresh` | Valid refresh cookie + CSRF token | Rotate the refresh token and issue a new access token |
| `POST` | `/api/auth/logout` | Valid refresh cookie + CSRF token | Revoke the refresh token and clear its cookie |
| `GET` | `/api/auth/me` | Authenticated | Return the signed-in user's safe profile and role |
| `GET` | `/api/people` | Authenticated | Search, sort, and page through people |
| `GET` | `/api/people/{id}` | Authenticated | Fetch one person |
| `POST` | `/api/people` | `ADMIN` | Create a person |
| `PUT` | `/api/people/{id}` | `ADMIN` | Update a person |
| `DELETE` | `/api/people/{id}` | `ADMIN` | Delete a person |

Create and update requests use a DTO shaped like:

```json
{
  "name": "Alex Morgan",
  "age": 28,
  "email": "alex@example.com"
}
```

The people list accepts parameters such as `page`, `size`, `sort`, and `q`. Define a consistent paginated response DTO. Never expose persistence entities directly from controllers.

## Learning map

1. **Java foundations:** classes, interfaces, access modifiers, records, collections, generics, exceptions, and separating responsibilities across layers.
2. **HTTP and REST:** methods, paths, JSON, status codes, headers, cookies, bearer tokens, CORS, CSRF, and how browser requests move through an API.
3. **SQL and relational design:** tables, primary and foreign keys, unique constraints, indexes, joins, transactions, and basic query planning.
4. **JPA and Hibernate:** entities, identifiers, relationships, persistence context, entity lifecycle, lazy loading, transactions, and recognizing the N+1 query problem. JPA defines the persistence API; Hibernate implements it.
5. **Spring Boot and data access:** dependency injection, configuration, controllers, services, repositories, derived queries, JPQL with `@Query`, pagination, sorting, and transaction boundaries.
6. **API design:** request/response DTOs, manual DTO mapping, Jakarta validation, centralized exception handling, and consistent error bodies.
7. **Spring Security:** authentication versus authorization, password hashing with BCrypt, JWT signing and validation, access/refresh token lifetimes and rotation, roles, route/method protection, CSRF, CORS, and safe account responses.
8. **React and TypeScript:** function components, JSX, props, state, events, one-way data flow, composition, conditional rendering, keyed lists, forms, hooks, routing, typed component contracts, and reusable logic.
9. **Real UI behavior:** API integration, auth-aware routes, role-aware controls, loading/error/empty states, form feedback, search, pagination, and accessible status messages.
10. **Quality and operations basics:** focused backend and frontend tests, API documentation, environment-based configuration, structured logging, database migrations, setup documentation, and readable commits.

## Learning roadmap

### Stage 1 — Java, SQL, and project setup

Review Java classes, interfaces, collections, and exceptions. Design the user and person tables, keys, unique constraints, and indexes. Set up Spring Boot and MySQL with environment-based local configuration.

### Stage 2 — JPA, Hibernate, and layered CRUD

Create entities, repositories, services, and controllers. Implement list, detail, and create. Learn entity lifecycle and transaction boundaries. Keep persistence entities inside the backend.

### Stage 3 — DTOs, validation, JPQL, and API behavior

Add request and response DTOs, explicit mapping, Jakarta validation, and centralized API errors. Complete update/delete. Add a JPQL search query and pageable/sorted results. Handle duplicate email and missing-record cases cleanly.

### Stage 4 — Spring Security, JWT, and accounts

Add registration, login, refresh, logout, and current-user routes. Hash passwords with BCrypt, issue and validate short-lived signed access JWTs with Spring Security's JWT support, rotate/revoke hashed opaque refresh tokens, protect refresh-cookie operations against CSRF, configure local CORS, and enforce `USER`/`ADMIN` permissions. Keep access tokens in React memory and renew them after reload. Verify missing, expired, malformed, and insufficient-role token cases.

### Stage 5 — React and TypeScript interface

Learn React in small steps while building sign-in/registration pages, the directory, person detail/form components, and role-aware actions. Practice JSX, component composition, props, state, event handlers, conditional rendering, lists and keys, controlled forms, and lifting shared state. Use `useState`, `useEffect` (including cleanup), `useContext` for the authenticated user, `useRef`, and a small custom hook. Add React Router, typed props and API data, and a reusable API client. Derive search results from loaded data instead of duplicating state. Add search, pagination, validation feedback, loading/error/empty states, semantic HTML, accessible feedback, and responsive CSS. Learn when React re-renders and use memoization only when there is a measured need.

### Stage 6 — Integration, tests, and documentation

Trace complete user and admin flows through the browser, API, service, repository, Hibernate, and MySQL. Add focused tests for meaningful behavior, document setup and API usage, review accessibility and configuration, and fix integration issues.

## Definition of done

- Users can register, sign in, sign out, and view their own safe account profile.
- Authenticated users can browse, search, sort, and page through people; only admins can create, edit, or delete records.
- The API uses DTOs, validation, JPQL where appropriate, consistent errors, and useful HTTP status codes.
- MySQL data persists through JPA/Hibernate, with Flyway migrations and database constraints for important invariants.
- Passwords are hashed; JWT signing/validation, access and refresh token handling, CSRF, CORS, and role rules are understood and documented.
- The UI supports the full directory workflow and provides clear loading, error, empty, validation, and access-denied feedback.
- The learner can explain JSX, component composition, props/state, events, rendering, lists/keys, controlled forms, state lifting, the hooks used, routing, and the frontend-to-API data flow.
- Setup, configuration, API, and focused test instructions are documented, and the learner can explain a request/data flow end to end.

## How to work through it

- Treat the assistant as a tutor/coach and the learner as the project author. The learner writes and edits the project code.
- For each small task, explain the concept and goal first, then let the learner implement it. Offer progressive hints, explain errors, and review the learner's code without taking over.
- Do not edit project code or provide a complete solution by default. Write or modify code only when the learner explicitly asks for code, a sample, or a direct edit.
- Build in small, understandable stages and explain the key idea and request/data flow as each stage is introduced.
- Once the foundations are in place, deliver one vertical feature slice at a time across frontend, API, service, repository, and database; retain the layered structure within the backend.
- Use conventional controller, service, repository, entity, DTO, API-client, and React-component boundaries.
- Keep core concepts in the required scope; treat deployment, cloud services, Docker, and unrelated features as optional follow-up work.
- Don't repeat the completed To-Do project. Don't add tests or run them unless the user asks for verification or testing; when asked, report what ran and any environment limits.
- Don't deploy, publish, or contact anyone unless explicitly requested. Ask for clarification only when a real project decision cannot be inferred.

## Optional extensions after the core project

- **API documentation:** OpenAPI/Swagger UI and a shareable request collection.
- **More account features:** email verification, password reset, and account lockout/rate limits for login.
- **Audit history:** record which admin created, changed, or deleted a person and when.
- **More testing practice:** Spring integration tests with Testcontainers and frontend component/end-to-end tests.
- **Delivery practice:** Docker Compose for local app/database setup, a CI workflow, and deployment to a hosting provider.
- **Larger directory features:** filters, export to CSV, and optimistic locking for conflicting edits.

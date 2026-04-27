RUELS FOR BACKEND

0. Tech Stack Assumptions (Non-Negotiable)

Language: TypeScript

Runtime: Node.js

Framework: Express

Database: MongoDB (Mongoose)

Cache: Redis

Auth: JWT

Validation: express-validator

Error handling: Custom Error Classes

Async handling: asyncHandler wrapper

Architecture: Layered (Controller → Service → Repository → Model)


1. Folder & Responsibility Separation (STRICT)

Each layer has one responsibility only.

src/
├── controllers/
├── services/
├── repository/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── errors/
├── services/cache/

❌ Forbidden

Business logic in controllers

Database queries in services or controllers

Express req/res usage outside controllers

Mongoose usage outside repository or model

Cross-layer imports that break flow

2. Request Lifecycle Rule (MANDATORY FLOW)
Route
 → Validator Middleware
 → Auth Middleware (if required)
 → Controller
 → Service
 → Repository
 → Model
 → Response via next()


 3. Controller Rules (VERY STRICT)

Controllers are thin. Zero business logic.

Controllers MUST:

Extract data from req

Call exactly one service method

Pass result to next(response)

Never send res.json() directly

Controllers MUST NOT:

Catch errors

Handle validation logic

Access database

Contain conditionals except trivial destructuring

Example Pattern
export const profile = async (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  const response = await authService.profile(_id);
  next(response);
};

4. Service Layer Rules (BUSINESS LOGIC OWNER)

All business logic lives here.

Services MUST:

Contain business rules

Coordinate multiple repositories

Handle cache logic

Throw custom errors (BadRequestError, NotFoundError, etc.)

Be class-based

Use dependency injection for repositories

Services MUST NOT:

Use req, res, or Express types

Access Mongoose models directly

Return HTTP responses

Constructor Pattern
class AuthService {
  constructor(private readonly _userRepository: UserRepository) {}
}

5. Repository Rules (DATA ACCESS ONLY)

Repositories are the only layer allowed to touch Mongoose.

Repositories MUST:

Contain only DB queries

Return raw DB results

Be class-based

Never throw HTTP-aware errors

Repositories MUST NOT:

Implement business logic

Hash passwords (unless explicitly data-related)

Send emails

Handle cache

Example
async getUserByEmailId(email: string): Promise<IUser | null> {
  return this._model.findOne({ email });
}

6. Model Rules (Schema Definition Only)
Models MUST:

Define schema structure only

Define indexes

Export Mongoose model

Export TypeScript interface

Models MUST NOT:

Contain business logic

Contain static or instance helper methods

Use ref, populate, or Mongoose relationships of any kind ❌

Depend on other models directly

7. Error Handling Rules (STRICT)
Errors:

Use custom error classes only

Throw errors inside services

Never throw new Error()

Global Error Flow:
Service throws error
 → asyncHandler
 → globalHandler middleware


Controllers do not catch errors.

8. Async Handling Rule

All async controllers must be wrapped:

authRouter.post('/login', loginValidator, asyncHandler(genericLogin));


AI must never write try/catch inside controllers.

9. Response Handling Rule (IMPORTANT)

Controllers call next(response)

globalHandler formats the response

Standardized response shape is enforced globally

Controllers never send responses directly.

10. Auth & Request Typing Rule
Custom Express Typings
declare namespace Express {
  export interface Request {
    user: {
      _id: string;
    };
    access_token: string | null;
  }
}


AI must assume this typing exists and use req.user._id.

11. Cache Layer Rules

Redis access only via CacheManager

No raw Redis calls outside cache service

Cache keys must include:

SERVER_NAME + prefix + sorted params

Cache TTLs must be explicit.
12. Config Rules

All env variables accessed via config/index.ts

No process.env usage outside config

Config values are non-null asserted

13. Validation Rules

All validation lives in middlewares/validators

Routes must attach validators explicitly

Services assume validated input

14. Commit & Quality Rules

Husky enforced commit messages

Pre-commit must run:

lint:fix
build


AI must not suggest bypassing lint or husky

15. What AI MUST DO When Adding a Feature

When asked to add a feature, AI must:

Create/extend model

Add repository methods

Implement service logic

Add controller

Add validators

Wire routes

Respect caching if applicable

Skipping layers is not allowed.

16. Golden Rule (Final)

If logic decides something → Service
If logic fetches something → Repository
If logic formats request/response → Controller
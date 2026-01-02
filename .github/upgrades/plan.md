# .github/upgrades/plan.md

## Table of Contents

- Executive Summary
- Migration Strategy
- Detailed Dependency Analysis
- Project-by-Project Plans
- Package Update Reference
- Breaking Changes Catalog
- Testing & Validation Strategy
- Risk Management
- Complexity & Effort Assessment
- Source Control Strategy
- Success Criteria

---

## Executive Summary

Scope: Upgrade all projects in `RiftARENA.sln` to `.NET 10.0 (net10.0)`. Assessment indicates 2 projects (1 requires upgrade), ~5,957 LOC, and 18 NuGet packages across the solution. The primary project requiring changes is `RiftARENA\RiftARENA.csproj` (AspNetCore web app).

Selected Strategy
- `All-At-Once Strategy` — All projects and shared build system files will be upgraded simultaneously in a single atomic operation.
- Rationale: Small solution (2 projects), homogeneous SDK-style projects, manageable LOC, and available package upgrades. The assessment shows a moderate number of API incompatibilities and package updates but no large dependency cycles.

Key risks
- Binary and source API incompatibilities in authentication/identity APIs (6 binary, 11 source-incompatible items reported).
- Several packages are deprecated or incompatible (notably `Azure.Identity`, `System.IdentityModel.Tokens.Jwt`, `Microsoft.VisualStudio.Azure.Containers.Tools.Targets`).

Primary deliverable
- `plan.md` (this document) that specifies exact changes and validation checkpoints so execution can be performed as one atomic upgrade commit.

## Migration Strategy

Approach: All projects simultaneously (atomic upgrade).

High-level sequence (atomic):
1. Prepare environment and source control (commit pending changes; create `upgrade-to-NET10` branch).
2. Update global SDK settings if present (`global.json`) to a compatible SDK for .NET 10.
3. Update `TargetFramework` in all project files to `net10.0`.
4. Update NuGet package references per the Package Update Reference below.
5. Remove package references that are provided by the framework or deprecated; replace deprecated packages with supported alternatives where applicable.
6. Restore packages and build solution; fix compilation errors caused by framework or package changes (one combined pass).
7. Run test projects and fix test failures.
8. Produce final verification: solution builds cleanly, tests pass, no outstanding vulnerabilities.

Notes on simultaneity
- All project file edits and package version updates must be included in one atomic change set. Building and fixing compilation errors is part of the same upgrade pass.

## Detailed Dependency Analysis

Projects (topological order):
1. `docker-compose.dcproj` (no code changes expected)
2. `RiftARENA\RiftARENA.csproj` (application)

Dependency observations:
- No intra-solution project references were found; both projects are SDK-style and independent for compilation.
- Migration phases:
  - Phase 0: Prerequisites and environment
  - Phase 1: Atomic upgrade of all projects (as per All-At-Once strategy). All projects updated simultaneously.

Circular dependencies: none detected.

Critical path: `RiftARENA` is the primary project for code change and risk mitigation.

## Project-by-Project Plans

### Project: `RiftARENA\RiftARENA.csproj`
Current state
- TargetFramework: `net7.0`
- Type: ASP.NET Core Web App (SDK-style)
- LOC: 5957
- Files with incidents: 5
- Proposed TargetFramework: `net10.0`

Migration steps (atomic, part of overall operation)
1. Prerequisites
   - Ensure .NET 10 SDK is installed or update `global.json` to a compatible SDK.
   - Commit or stash local pending changes (plan uses `commit` by default), switch to `upgrade-to-NET10` branch.
2. Project file updates
   - Change `<TargetFramework>net7.0</TargetFramework>` to `<TargetFramework>net10.0</TargetFramework>` in `RiftARENA.csproj`.
   - Remove explicit `PackageReference` entries for packages whose functionality is provided by framework (see Package Update Reference).
3. Package updates
   - Update package versions to the target versions specified in the Package Update Reference table.
   - Replace deprecated packages (see notes below).
4. Code fixes
   - Address binary/source incompatible API usages (Authentication/JWT, JwtSecurityTokenHandler, JwtBearerOptions properties, ConfigurationBinder/Options.Configure<T> changes). See Breaking Changes Catalog.
   - Replace or refactor calls to deprecated API surfaces and adjust DI registration patterns if signatures changed.
5. Build & verify
   - Restore packages and build full solution.
   - Fix compilation errors discovered during the build pass.
6. Test
   - Run unit and integration tests (if any). Resolve test failures.
7. Finalize
   - Ensure no remaining package vulnerabilities flagged by assessment.

Special notes
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` reported as incompatible. Evaluate if docker tooling is required at build time; if not required, remove the PackageReference. If required, update to a compatible version or move Docker build tooling to developer-local configuration.
- `Azure.Identity` flagged as deprecated in assessment; determine replacement or update to supported version prior to release.
- `System.IdentityModel.Tokens.Jwt` flagged deprecated: prefer `Microsoft.IdentityModel.Tokens` / `Microsoft.IdentityModel.JsonWebTokens` or the updated package recommended for .NET 10.

### Project: `docker-compose.dcproj`
- No target change required. Verify no SDK references break after global changes.

### `RiftARENA\RiftARENA.csproj` - Package update table

| Package | Current Version | Target Version | Reason |
| :--- | :---: | :---: | :--- |
| Microsoft.AspNetCore.Authentication.JwtBearer | 7.0.14 | 10.0.1 | Framework-aligned JWT auth package update |
| Microsoft.AspNetCore.Mvc.NewtonsoftJson | 7.0.14 | 10.0.1 | Compatibility with ASP.NET Core 10 |
| Microsoft.AspNetCore.SignalR.Protocols.NewtonsoftJson | 7.0.14 | 10.0.1 | SignalR protocol update |
| Microsoft.EntityFrameworkCore | 7.0.14 | 10.0.1 | EF Core aligned to framework version |
| Microsoft.EntityFrameworkCore.Design | 7.0.14 | 10.0.1 | EF Core design tools update |
| Microsoft.EntityFrameworkCore.Proxies | 7.0.14 | 10.0.1 | Proxy compatibility with EF Core 10 |
| Microsoft.EntityFrameworkCore.SqlServer | 7.0.14 | 10.0.1 | Provider update |
| Microsoft.EntityFrameworkCore.Tools | 7.0.14 | 10.0.1 | Tools update |
| Microsoft.VisualStudio.Web.CodeGeneration.Design | 7.0.11 | 10.0.1 | Code generation tools update |
| Azure.Identity | 1.11.4 | (Investigate) | Deprecated in assessment; evaluate replacement or update |
| Microsoft.VisualStudio.Azure.Containers.Tools.Targets | 1.19.6 | (Remove/Replace) | Incompatible with .NET 10; remove or replace |

## Breaking Changes Catalog (detailed)

1. JwtSecurityTokenHandler API changes
   - Impact: Code constructing or serializing JWT tokens using `JwtSecurityTokenHandler` may fail to compile or behave differently.
   - Action: Replace uses with `Microsoft.IdentityModel.JsonWebTokens` or updated `Microsoft.IdentityModel.Tokens` patterns. Update code paths that call `CreateToken` and `WriteToken`.

2. JwtBearer configuration changes
   - Impact: `AddJwtBearer` configuration blocks may need property renames or adjusted lambda signatures.
   - Action: Inspect `Startup`/`Program` DI code and update `JwtBearerOptions` usage accordingly.

3. Configuration binder / Options.Configure<T>
   - Impact: Binding APIs changed; some generic overloads are binary-incompatible.
   - Action: Use `builder.Configuration.GetSection("Section").Bind(obj)` or `builder.Services.Configure<T>(builder.Configuration.GetSection("Section"))` as recommended, and update any custom extension methods that relied on older overloads.

4. System.Exception serialization ctor
   - Impact: Custom exception types that implement serialization constructors must be updated to match new patterns in .NET 10.
   - Action: Review custom exception classes and adjust serialization-related constructors.

5. HttpContent behavior
   - Impact: Changes in `HttpContent` may affect response parsing or disposal semantics.
   - Action: Add integration tests around HTTP calls and ensure proper usage of `await response.Content.ReadAsStringAsync()` and disposal patterns.

## Testing & Validation Strategy

Validation checkpoints (all part of atomic upgrade):
1. Local environment verification: .NET 10 SDK available or `global.json` updated.
2. Build verification: `dotnet restore` + `dotnet build` for the solution — final outcome: 0 errors.
3. Test execution: run unit/integration tests via `dotnet test` for any discovered test projects. Expected outcome: all tests pass.
4. Runtime smoke: if automated integration tests exist (API contract tests), run them.
5. Vulnerability scan: run NuGet vulnerability check (e.g., `dotnet list package --vulnerable`) and ensure no blocking vulnerabilities remain.

Automated checks (run after atomic upgrade changes applied):
- `dotnet restore` for solution
- `dotnet build` for solution (0 errors) - captured as build verification
- `dotnet test` for all discovered test projects (all tests pass)
- `dotnet list package --vulnerable` to ensure no high severity vulnerabilities

Manual/targeted verification recommended:
- Verify authentication flows (login, token issuance, token validation) manually or with API tests.
- Verify EF Core database interactions against staging database if available.
- Exercise SignalR endpoints and JSON serialization paths.

## Risk Management

Top risks
- Authentication and token handling breakage due to binary incompatible APIs. Mitigation: audit all JWT handling code, update to supported token APIs, add unit tests for token creation/validation.
- Deprecated packages: choose supported replacements and pin explicit versions. Mitigation: research replacements and include in the atomic change.
- Build tool incompatibilities (`Microsoft.VisualStudio.Azure.Containers.Tools.Targets`). Mitigation: remove or isolate Docker/VS-specific build targets from the CI/build that runs the dotnet build for upgrade.

High-risk items:

| Project | Risk Level | Rationale | Mitigation |
| :--- | :---: | :--- | :--- |
| `RiftARENA` | High | Binary-incompatible APIs in JWT/token handling and multiple package upgrades required | Audit all JWT code paths; update to supported IdentityModel packages; add unit tests for token create/validate; apply code changes in the atomic commit |
| `RiftARENA` | Medium | EF Core package upgrade may introduce mapping/behavior changes | Run EF Core tests, review migrations, test DB interactions; update EF Core API usages where necessary |
| Solution build | Medium | `Microsoft.VisualStudio.Azure.Containers.Tools.Targets` incompatible may break CI build scripts | Remove/replace incompatible build targets; isolate docker tooling from core build steps |

Rollback plan
- Because the upgrade is atomic, rollback is: abort PR and revert the single upgrade commit on `upgrade-to-NET10` branch, or reset branch to pre-upgrade commit. Keep a backup branch of the pre-upgrade state before applying changes.

## Complexity & Effort Assessment

Classification: Simple / Low-Medium complexity overall
- Reason: 2 projects, small codebase, limited number of breaking APIs (19 reported API issues affecting 5 files). Most breaking changes are localized to authentication, configuration, and EF Core package upgrades.

Per-project complexity
- `RiftARENA` — Medium risk for auth/token handling and EF Core-related updates; expected code changes primarily in startup/DI and token handling modules.
- `docker-compose.dcproj` — No changes expected.

| Project | LOC | Files | Number of Issues | Complexity Rating |
| :--- | :---: | :---: | :---: | :--- |
| `RiftARENA` | 5957 | 43 | 19 | Medium |
| `docker-compose.dcproj` | 0 | 0 | 0 | Low |

Notes: Complexity ratings are relative (Low/Medium/High). No time estimates are provided.

## Source Control Strategy

Branching
- Source branch: `master` (as discovered)
- Upgrade branch: `upgrade-to-NET10` (created from `master`)

Pending changes
- Assessment indicated pending changes exist; action: `commit` pending changes before creating `upgrade-to-NET10` branch.

Commit strategy
- Single atomic commit that includes all project file TargetFramework edits, all package version updates, and any code changes required to compile under .NET 10.
- Commit message guidance: `chore(upgrade): migrate solution to .NET 10.0 and update packages`.

Procedure (before applying atomic changes):
1. Ensure working tree is clean or commit pending changes as specified.
2. Create and switch to `upgrade-to-NET10` branch from `master`.
3. Apply all project file changes, package updates, and code fixes in a single commit.
4. Push branch and open PR to `master` for CI validation and code review.

PR checklist (minimum):
- CI build succeeds
- Tests pass
- Auth flows validated (automated or manual verification included)
- Deprecated packages addressed or replacement rationale documented

## Success Criteria

The upgrade is considered complete when all of the following are met:
- All projects target `net10.0` as specified in project files.
- All package updates listed in Package Update Reference are applied.
- Solution builds with 0 errors.
- All unit and integration tests pass.
- No critical security vulnerabilities remain in NuGet packages.
- Deprecated or incompatible packages are replaced or removed, with documented rationale.

---

[End of plan]

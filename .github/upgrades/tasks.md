# RiftARENA .NET 10.0 Upgrade Tasks

## Overview

This document tracks the execution of upgrading all projects in `RiftARENA.sln` to .NET 10.0. Work is organized as prerequisites, one atomic upgrade pass (project and package updates with compilation fixes), testing, and a final commit.

**Progress**: 0/4 tasks complete (0%) ![0%](https://progress-bar.xyz/0)

---

## Tasks

### [▶] TASK-001: Verify prerequisites
**References**: Plan §Migration Strategy, Plan §Detailed Dependency Analysis

- [✓] (1) Verify .NET 10 SDK is installed or update `global.json` to a compatible SDK as specified in Plan §Migration Strategy
- [▶] (2) Runtime/SDK version meets minimum requirements (**Verify**)
- [ ] (3) Check configuration file compatibility (e.g., `Directory.Build.props`, `Directory.Packages.props`, `global.json`) per Plan §Detailed Dependency Analysis
- [ ] (4) Configuration files compatible with target version (**Verify**)

---

### [ ] TASK-002: Atomic framework and package upgrade with compilation fixes
**References**: Plan §Migration Strategy, Plan §Project-by-Project Plans, Plan §Package Update Reference, Plan §Breaking Changes Catalog

- [ ] (1) Update `TargetFramework` to `net10.0` in all project files listed in the plan (e.g., `RiftARENA\RiftARENA.csproj`) per Plan §Project-by-Project Plans
- [ ] (2) Remove or replace deprecated/incompatible PackageReference entries and adjust MSBuild imports as specified in Plan §Package Update Reference (examples: `Microsoft.VisualStudio.Azure.Containers.Tools.Targets`, `Azure.Identity`, `System.IdentityModel.Tokens.Jwt`)
- [ ] (3) Update NuGet package versions per Plan §Package Update Reference (apply target versions listed in the plan)
- [ ] (4) Restore dependencies for the solution (`dotnet restore`) per Plan §Testing & Validation Strategy
- [ ] (5) Build the solution and fix all compilation errors caused by framework or package changes (address items in Plan §Breaking Changes Catalog)
- [ ] (6) Solution builds with 0 errors (**Verify**)

---

### [ ] TASK-003: Run tests and validate upgrade
**References**: Plan §Testing & Validation Strategy, Plan §Project-by-Project Plans

- [ ] (1) Run tests for all test projects referenced in the plan (use `dotnet test` per Plan §Testing & Validation Strategy)
- [ ] (2) Fix any test failures (reference Plan §Breaking Changes Catalog for common fixes)
- [ ] (3) Re-run tests after fixes
- [ ] (4) All tests pass with 0 failures (**Verify**)

---

### [ ] TASK-004: Final commit
**References**: Plan §Source Control Strategy

- [ ] (1) Commit all remaining changes with message: "TASK-004: chore(upgrade): migrate solution to .NET 10.0 and update packages"


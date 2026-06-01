# Kanban MVP Plan

## Phase 1: Scaffold

- [x] Create `frontend` Next.js app with TypeScript and ESLint
- [x] Ensure `.gitignore` exists from scaffold
- [x] Add Kanban and test dependencies

Success criteria: project installs and starts with `npm run dev`.

## Phase 2: MVP Features

- [x] Implement single board with exactly 5 fixed columns
- [x] Support renaming column titles
- [x] Support adding cards (title + details)
- [x] Support deleting cards
- [x] Support drag/drop of cards between columns
- [x] Seed startup dummy data

Success criteria: required user flows work with no extra features.

## Phase 3: UI/UX

- [x] Apply provided palette (`#ecad0a`, `#209dd7`, `#753991`, `#032147`, `#888888`)
- [x] Deliver polished, responsive layout for desktop/mobile

Success criteria: clear hierarchy and professional visual finish.

## Phase 4: Unit Testing

- [x] Add Vitest configuration
- [x] Add unit tests for board state operations

Success criteria: unit tests pass.

## Phase 5: Integration Testing

- [x] Add Playwright configuration
- [x] Add end-to-end scenario for rename/add/move/delete

Success criteria: Playwright test passes.

## Final Verification

- [x] Run lint
- [x] Run unit tests
- [x] Run Playwright tests
- [x] Confirm dev server starts cleanly

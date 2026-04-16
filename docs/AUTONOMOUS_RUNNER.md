# Autonomous Execution Guide

## How to Run the Autonomous Build

This document describes how to execute the Phase 2 Exploration MVP sprint autonomously using Claude Code agents.

### Prerequisites
- On branch `feature/autonomous-v2`
- `npm install` completed
- Game currently runs with `npm run dev`

### Execution Model

The game-pm (Marcus Hale) acts as the coordinator. When invoked, he:

1. Reads `docs/SPRINT.md` for the task board and status
2. Identifies the next wave of unblocked tasks
3. Spawns parallel agents (one per task) to execute specs
4. Each agent reads its spec from `docs/specs/XX-name.md`
5. Agent does the work, commits to the branch
6. game-pm updates SPRINT.md status markers
7. After each wave, runs `npm run dev` to verify no breakage
8. Moves to next wave

### Invocation

From `C:/dev/forge-and-field/`, run:

```
claude -p "You are Marcus Hale, game-pm. Read docs/SPRINT.md and docs/AUTONOMOUS_RUNNER.md. Execute the sprint autonomously — process each wave by spawning parallel agents for unblocked tasks. Each agent reads its spec from docs/specs/ and implements the work. After each wave, verify npm run dev works. Update SPRINT.md status as tasks complete. Commit after each wave. Continue until all waves are done or you hit a blocker that needs CTO input."
```

### Agent Task Prompt Template

When game-pm spawns a worker agent for a task:

```
You are a dev agent working on the Forge & Field game (Next.js, React, idle/incremental RPG).
Branch: feature/autonomous-v2
Your task: [TASK TITLE]

Read the spec at docs/specs/[XX-name].md for full requirements.
Also read any input files listed in the spec before making changes.

Rules:
- Follow the spec exactly. No scope creep.
- Match existing code style (functional React, CSS modules, data-driven).
- Use the Ember Glow palette from art/ART_BIBLE.md for any UI colors.
- Any player-facing text must use "quiet warm authority" voice.
- Do NOT modify files not listed in the spec.
- Commit your work with message: "Task XX: [brief description]"
```

### Wave Execution Order

| Wave | Tasks | Parallel? | Estimated Time |
|------|-------|-----------|---------------|
| Wave 1 | 01, 02, 03, 04, 05 | Yes (all independent) | 5-10 min |
| Wave 2 | 06, 07, 08, 09, 10 | Partially (06+07 parallel, 08 depends on 05, 09+10 depend on 08) | 15-20 min |
| Wave 3 | 11, 12 | Sequential (11 first, then 12) | 10-15 min |
| Wave 4 | 13, 14, 15, 16 | Partially (13+14 parallel, 15 after 13, 16 after 13) | 20-30 min |
| Wave 5 | 17, 18, 19, 20 | Yes (all independent at this point) | 10-15 min |

### Error Handling

- If an agent fails: log the error, skip the task, continue with unblocked tasks
- If `npm run dev` fails after a wave: revert the wave's commits, report the error
- If a spec is ambiguous: make the simplest choice that matches existing patterns
- If a task discovers needed work not in specs: add to `TODO.md`, don't implement

### Post-Run

After all waves complete:
1. Run `npm run dev` — full verification
2. Play through the game manually to verify existing features
3. Test exploration flow: enter exploration, move nodes, fight, collect loot, retreat
4. Report results to CTO for review

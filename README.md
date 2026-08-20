# maple-ridge-music-program
Project for skills related to the procurement and inventory management of instruments, accessories, and music.

## Local ingest

Drop CE session-updates, summaries, and photos in `updates/`. In Cursor, Copilot, or Claude Code run **`@admin-ingest`** — it audits the inbox, compares to inventory, asks about gaps (summary MD, photo index, photos), merges, archives `updates/`, and opens a PR to `main`.

See `UPDATE-PROCESS.md` and `.github/agents/admin-ingest.agent.md`.

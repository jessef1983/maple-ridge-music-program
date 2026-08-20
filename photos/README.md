# Photo seed directory (git-tracked)

Intake and **Marketplace listing** photos live here and **must be committed**. Claude can only `present_files` shots that exist in git (then in a skill package or photo upload) — Drive/session filenames are not enough.

Do **not** put this tree in the 15-file `mpr-project/project-files/` CE seed. Bundle selected `photos/LOT-###/` folders into a marketplace skill package when posting from Claude.

Never gitignore this folder.

```
photos/
├── _pending/          # waiting for an MPR or LOT ID
├── MPR-030/           # fleet / intake
├── LOT-001/           # sale pipeline
└── README.md          # this file
```

- One folder per `MPR-###` or `LOT-###`
- Keep original camera filenames
- No student names in folder names
- `onboarding-photo-index.md` uses repo-relative paths into this tree
- Unassigned IDs stay in `_pending/` until `@admin-ingest` assigns the ID

`intrument-pics/` is the unfiled local dump. `@admin-ingest` copies from inbox/dump into `photos/<ID>/` and git-adds those files.

Filed by **`@admin-ingest`** (`UPDATE-PROCESS.md`).

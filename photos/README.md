# Photo seed directory (git-tracked)

Intake and **Marketplace / GitHub Sync** photos live here and **must be committed**.
Claude can only use shots that exist in git — Drive/session filenames are not enough.

Do **not** put this tree in the 15-file `mpr-project/project-files/` CE seed.

```
photos/
├── _pending/          # waiting for an MPR or LOT ID (or unassigned clusters)
├── MPR-030/           # fleet / intake
├── LOT-001/           # sale pipeline
└── README.md          # this file
```

## Rules

- One folder per `MPR-###` or `LOT-###` — **no brand suffix** in the folder name
- Keep original camera filenames (`PXL_*`, `IMG_*`, etc.)
- No student names in folder names
- `onboarding-photo-index.md` **Folder:** lines must be `` `photos/MPR-###/` `` or `` `photos/LOT-###/` ``
- Fleet→LOT: LOT-020 files stay under `MPR-062/`; LOT-021 under `MPR-075/`

## Filename families

| Prefix | Meaning |
|---|---|
| `PXL_*` | Pixel phone (majority of the library) |
| `IMG_*` | Other phone (e.g. MPR-010 serial shots) |
| `1000######.jpg` | Separate non-Pixel camera — often still missing from disk |

Bare `` `163855038` `` in older index prose is CE shorthand for the Pixel 9-digit timestamp — match on those digits.

## Local dump

`intrument-pics/` is **gitignored**. `@admin-ingest` **copies** from the dump (or `/updates/`) into `photos/<ID>/` and git-adds those files. Never delete the dump during ingest. Never commit duplicate jpgs under `landing-zone/archive/`.

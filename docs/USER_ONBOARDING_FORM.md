# User Onboarding Form — Setup Guide (Level 5)

This is the exact form to create for Level 5's 50-user onboarding requirement, plus how to export responses and link them from the README.

## 1. Create the Google Form

Go to [forms.google.com](https://forms.google.com) → blank form → title it **"Arc Nexus Store — Tester Feedback"**.

Add these fields, in this order:

| # | Field | Type | Required | Notes |
|---|---|---|---|---|
| 1 | Name | Short answer | Yes | |
| 2 | Email | Short answer | Yes | Enable "Response validation → Email" |
| 3 | Stellar wallet address (starts with `G...`) | Short answer | Yes | Response validation → Regex: `^G[A-Z2-7]{55}$` |
| 4 | Transaction hash of your test purchase | Short answer | No | Link to stellar.expert, proves real usage |
| 5 | How easy was it to use? | Linear scale 1–5 | Yes | 1 = Very difficult, 5 = Very easy |
| 6 | What confused you or could be improved? | Paragraph | No | This is the real product-feedback field |
| 7 | Would you use this again? | Multiple choice | Yes | Yes / Maybe / No |

Under **Settings → Responses**, turn on "Collect email addresses" (gives you a verified email column automatically).

## 2. Get the shareable link

**Send** button → link icon → copy the short `forms.gle/...` link. Post this link alongside the recruitment messages in `docs/USER_RECRUITMENT.md`.

## 3. Export responses to Excel

1. Open the form → **Responses** tab → click the green Sheets icon ("Create Spreadsheet") → creates a linked Google Sheet with every response as a row.
2. In that Sheet: **File → Download → Microsoft Excel (.xlsx)** — this is the file to keep as the permanent record.
3. To link it from the README without re-uploading anywhere: **File → Share → General access → Anyone with the link (Viewer)**, copy that Sheet link. That's a live, always-up-to-date link — no need to re-export every time a new response comes in.

## 4. Wire it into the project

- Add the form link to `docs/USER_RECRUITMENT.md` and to the recruitment messages (people fill this out after their test purchase).
- Add the Sheet link to the README's "User Growth" section (see the placeholder there) once you have real responses — do not link an empty sheet as if it had data.
- As responses come in, this Sheet *is* the source of truth for the 50-user proof — no need to duplicate rows into `USER_RECRUITMENT.md`'s markdown table once this is live; that table can stay for the Level 4 automated-wallet history and early real testers, and this Sheet takes over as the primary record at Level 5 scale.

## 5. Reading the results into the README's improvement section

Once there are real responses, skim column F ("What confused you...") for repeated themes and turn the top 2-3 into concrete backlog items in the README's "Product Iteration" section, each linked to the commit that addressed it (see that section's format).

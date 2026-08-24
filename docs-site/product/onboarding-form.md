# User Onboarding Form

The exact tester-feedback form used for the 50-user growth push, plus how to export responses
and wire them back into the README.

## 1. Create the Google Form

[forms.google.com](https://forms.google.com) → blank form → title it
**"Arc Nexus Store — Tester Feedback"**.

| # | Field | Type | Required | Notes |
|---|---|---|---|---|
| 1 | Name | Short answer | Yes | |
| 2 | Email | Short answer | Yes | Enable Response validation → Email |
| 3 | Stellar wallet address (`G...`) | Short answer | Yes | Response validation → Regex `^G[A-Z2-7]{55}$` |
| 4 | Transaction hash of your test purchase | Short answer | No | Links to stellar.expert, proves real usage |
| 5 | How easy was it to use? | Linear scale 1–5 | Yes | 1 = Very difficult, 5 = Very easy |
| 6 | What confused you or could be improved? | Paragraph | No | The real product-feedback field |
| 7 | Would you use this again? | Multiple choice | Yes | Yes / Maybe / No |

Under **Settings → Responses**, turn on "Collect email addresses" — gives a verified email
column automatically.

## 2. Get the shareable link

**Send** → link icon → copy the short `forms.gle/...` link. Post it alongside the recruitment
messages in [Growth & Recruitment](/product/growth).

## 3. Export responses to Excel

1. **Responses** tab → green Sheets icon ("Create Spreadsheet") → creates a linked Google
   Sheet with every response as a row.
2. In that Sheet: **File → Download → Microsoft Excel (.xlsx)** — this is the permanent record
   to keep.
3. **File → Share → General access → Anyone with the link (Viewer)**, copy that Sheet link —
   a live, always-current link with no need to re-export as new responses arrive.

## 4. Wire it into the project

- Add the form link to the recruitment messages (people fill this out after a test purchase).
- Add the Sheet link to the README's "User Growth" section once there are real responses —
  never link an empty sheet as if it had data.
- Once live, the Sheet *is* the source of truth for the 50-user proof; the
  [Growth & Recruitment](/product/growth) tracking table stays for the earlier, smaller
  cohort and automated on-chain activity proof.

## 5. Turning feedback into backlog

Once there are real responses, skim the "What confused you…" column for repeated themes and
turn the top 2–3 into concrete items in the
[Roadmap & Iteration Log](/product/roadmap#product-iteration-log), each linked to the commit
that addressed it.

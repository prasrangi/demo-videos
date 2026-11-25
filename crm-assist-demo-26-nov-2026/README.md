# CRM Assist click-through demo

A click-through version of the merged CRM Assist recording (`crm_assist_26_nov_2026_demo_merged.mp4`). It pauses at every result, zooms in on what matters, and shows a topic card with a short description before each of the 11 sections.

## Run it

- **Online (after the pull request is merged and GitHub Pages has built):** https://prasrangi.github.io/demo-videos/crm-assist-demo-26-nov-2026/ . Pages can return 404 for a few minutes after a merge.
- **From a download:** download this whole folder (`index.html`, `crm-assist-demo.mp4`, `thumbs/`), keep them together, and double-click `index.html`. Chrome or Edge recommended.
- **From a git clone:** `git clone https://github.com/prasrangi/demo-videos`, then open `crm-assist-demo-26-nov-2026/index.html` in Chrome or Edge.

## What is in it

- **Title card**, then for each section: a **topic card** (section number, chapter, topic, a two-line description, tags and a preview of where the section ends up), then the steps of that section.
- **42 steps.** At each one the recording pauses on the exact frame, zooms in, and highlights the area that matters, with a one-sentence caption.
- **Recap card** at the end, with links back to every section.
- Desktop recordings are zoomed in the page. The phone recording is shown as the full phone on the left with an enlarged view on the right.
- Waiting time between steps is fast-forwarded, with a "Fast-forward" badge.

| # | Chapter | Section |
|---|---|---|
| 1 | Capture and engage | Capture the lead in Salesforce |
| 2 | Capture and engage | Link the email and the contact |
| 3 | Capture and engage | Let Copilot prepare the response |
| 4 | Meet and collaborate | Book the discovery meeting |
| 5 | Meet and collaborate | Collaborate in Teams |
| 6 | Debrief on the go | Debrief a meeting from your phone |
| 7 | Debrief on the go | Turn the debrief into Salesforce tasks |
| 8 | Guardrails in action | Check Phase 2 readiness from notes |
| 9 | Guardrails in action | Draft the Phase 2 opportunity safely |
| 10 | Guardrails in action | Ask Copilot to change a close date |
| 11 | Guardrails in action | Confirm, update and verify |

## Presenting

| Control | What it does |
|---|---|
| Continue, Space, Enter, Right arrow, Page Down | Play to the next step (or open the next card) |
| Back, Left arrow, Page Up | Previous step or card, without playing |
| Skip ahead | While the recording plays, jump straight to the next pause |
| Section rail (top) | Jump to any section's topic card; the home and flag icons open the title and recap |
| N or Notes | Presenter notes: key message, likely customer question, what is on screen, what to say next. Esc closes |
| P or Auto-play | Moves on by itself, pausing long enough to read each caption |
| Guide tips | Hover explanations for every control. **Switch them off before a customer session.** Not shown on touch-only devices |
| Print view | One landscape page per section with its topic, description, notes and a captioned picture of every step. Use the browser's Print to save a PDF (13 pages) |

**Deep links:** add `#start`, `#s3` (topic card of section 3), `#s3-2` (second step of section 3), `#end` or `#print` to the address.

## Notes and assumptions

- All titles, topics, descriptions, captions, chapter names and presenter notes are suggested wording, written from what is visible in the recording. Please review them.
- The demo has no sound. The narrated video is a separate file.
- Private details removed in the edited videos stay removed here (connection details, org IDs and URLs cut; colleague and tenant email addresses blurred). Salesforce record and task IDs remain visible, as in the videos.
- This page plays a recording of a demo environment. It does not connect to Salesforce, Outlook or Teams, and it has no tracking. To measure views, host it on a platform with analytics.
- Not built: a `?customer=` parameter (the captions describe real recorded screens, so changing the customer name would contradict them), live voice, and a separate presenter window (notes open in a panel on the same page).

## Editing and rebuilding

The build scripts are not in this folder. To change only text, edit the JSON inside the `<script id="cues">` block of `index.html` directly. Video timing changes need a rebuild from the source recordings.

Checked 24 November 2026 against the source recordings. Re-check whenever the recordings change.

This repository is public, so this page and video are public once merged.

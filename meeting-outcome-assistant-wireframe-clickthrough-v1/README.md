# Meeting Outcome Assistant — Interactive Customer Wireframe (`v1.1.1`)

> **Interactive wireframe · Sample data · No live CRM or calendar changes**  
> **Central Promise:** *"Capture the proposed meeting details, show where they came from, let the seller correct and review them, and keep everything unsaved in this phase."*

## 1. How to Open, Start, and Reset the Demonstration

1. **Open the Wireframe:** Open `meeting-outcome-assistant-wireframe.html` (or `index.html` in `meeting-outcome-assistant-wireframe-clickthrough/`) in any modern desktop or tablet browser. It is 100% self-contained, works offline, and makes zero network calls.
2. **Start the Guided 8–10 Minute Walkthrough:**
   - The **Presenter View** dock at the top is enabled by default on **Step 1 of 10**.
   - Click **Next Step ▶** (or press the `Right Arrow` / `Page Down` key) to advance through the 10-step seller and stakeholder narrative, plus optional Appendices **A1** (Multiple Event proposals) and **A2** (Trust boundary / embedded command in notes).
3. **Reset the Demonstration:**
   - Click **Reset Demo** (top right in the dark Demo Controls bar) at any time to return every scenario, Event revision, CRM lookup branch, and chat transcript to its initial sample state.
   - Your **Guide Tips: On/Off** preference survives Reset. Switch **Guide Tips: Off** before sharing your screen with a customer if you do not want hover callouts to appear. Note that hover tips do not appear on touch-only devices; use the Speaker Notes drawer (`N`) or Print View (`#print`) on touch screens.

## 2. Role Chapters & Deep Links

You can jump directly to any chapter, step, or view using the top **Chapters** bar or URL hash links:
- `#start` — **Start Screen & Role Chapters** with the Readiness & Evidence Basis Legend.
- `#seller` — **Chapter 1: Seller Workspace & Event Review** (Screens 1–10: Sales Home, Capture Notes, Structured Outcomes, Event Fields, Evidence Table, Conversational Revisions, Missing/Conflicting Details A–F, Multi-Event Proposals, Optional CRM Context, and Review Approval & Save Boundary).
- `#admin` — **Chapter 2: Sales Ops & Governance** (Screen 11: Previously demonstrated Task creation and dedicated demo Opportunity Next Step updates, currently paused pending repairs; plus Screen 12: Trust & source handling rules).
- `#gate` — **Chapter 3: Capability Overview, Architecture & Readiness Gate** (Screen 13: Scannable capability matrix, open business-process agreement checklist, intended integration architecture, 6 configured Salesforce Hosted MCP read tools, and Prototype vs. Configured behavior table).
- `#step=1` through `#step=10`, `#step=A1`, `#step=A2` — Jump directly to any presenter walkthrough step.
- `#print` — **Printable Leave-Behind View** (formatted for landscape PDF export with the full presenter script, capability matrix, and open business-process questions).
- `?customer=Name` — Optional query parameter to personalise the sample customer name (sanitised to plain text, max 40 characters). Omit `?customer=` when you want the sample notes to show the exact default string `Atlas Metals Group`.

## 3. Keyboard Shortcuts

- `Right Arrow` / `Page Down` — Next step (shows the **"Just completed · Step N"** outcome bridge card).
- `Left Arrow` / `Page Up` — Previous step (shows only **"This step · What we are doing"** Goal card).
- `N` — Toggle in-page Speaker Notes drawer (or click **Pop-out Notes ↗** to open a synchronized second presenter window).
- `P` — Toggle Auto-play (respects `prefers-reduced-motion`).
- `F` — Toggle browser fullscreen.
- `Esc` — Dismiss visible Guide Tip first, then close open modals or Speaker Notes drawer.

## 4. Readiness Badges & Evidence Labels

All readiness facts and labels come directly from the customer project brief (`v1.1.1`, checked 5 November 2026) and use both an icon and explicit text (never colour alone):
1. `✓ Validated in private agent` — Tested unsaved Event capture, evidence traceability, derivations, and conversational review using synthetic notes.
2. `⧗ Configured · Sales validation pending` — Organization catalog entry updated and Sales extension refreshed for the lab user; live Microsoft 365 Sales runtime still showed the older tool set, so runtime validation in Sales remains pending.
3. `🔑 Configured · Sign-in required for verification` — Optional fresh Salesforce grounding via Hosted MCP; existing lab session requires sign-in.
4. `⏸ Previously demonstrated · Currently paused` / `⏸ Currently paused · Task fixes pending` — Earlier demo versions showed Task creation and dedicated demo Opportunity Next Step updates, which are now paused in `v1.1.1` while duplicate-prevention, repeated-update, record-link, scope, and routing defects are pending repair.
5. `◌ Future scope` / `◌ Future scope — unavailable in this phase` — Persistent CRM Event write-back, calendar availability/booking, Teams meeting link generation, participant invitations, recording/transcript ingestion and governance, and production bFO field mapping.

## 5. Supplied Demo Prompts Coverage Table (16 Prompts)

All 16 prompts can be sent from the **Demo Prompts (16)** menu, clicked as chips, or typed/pasted (with or without line breaks) into the chat box:

| # | Supplied Prompt | Wireframe Behavior | Readiness Badge |
| :--- | :--- | :--- | :--- |
| **P1** | `"Capture the meeting proposal and show the evidence."` | Captures Event 1 (10 Nov 2026, 10–10:30 am Asia/Kolkata) and separates Elena's 9 Nov document action item (S3). | `✓ Validated in private agent` |
| **P2** | `"Draft an Event from my notes."` | Captures Event 1 from supplied sample notes and links fields to S1–S3. | `✓ Validated in private agent` |
| **P3** | `"Show the evidence."` | Opens the Evidence Table (Screen 5) showing Field, Proposed value, Basis, Supporting quote, and Review state. | `✓ Validated in private agent` |
| **P4** | `"Move it to 3 pm and keep it 30 minutes."` | Advances Event 1 to Revision 2, updates Start to `3:00 pm`, derives End `3:30 pm` (`3:00 pm + 30 minutes = 3:30 pm`), preserves unchanged fields. | `✓ Validated in private agent` |
| **P5** | `"Add Anika to the proposed attendees."` | Adds `Anika` (name only) to Participants, increments Revision, resolves no email, sends no message. | `✓ Validated in private agent` |
| **P6** | `"Keep the customer unverified."` | Keeps `Atlas Metals Group` marked `User-provided · CRM-unverified` so review can finish without CRM lookup. | `✓ Validated in private agent` |
| **P7** | `"Draft a meeting with Elena on 9 November 2026."` | Loads Scenario A (`Needs details`), leaves start/end/duration/timezone/organizer/customer `Not provided`, asks one concise question. | `✓ Validated in private agent` |
| **P8** | `"Draft a call on 9 November 2026, 3 pm to 2 pm India time."` | Loads Scenario B (`Conflicted`), flags that 2:00 pm precedes 3:00 pm without swapping or assuming overnight. | `✓ Validated in private agent` |
| **P9** | `"Draft a review for Monday, 6 November 2026, at 2 pm India time for 30 minutes."` | Loads Scenario C (`Conflicted`), explains that 6 Nov 2026 is Friday, preserves Review purpose, asks whether Friday 6 Nov or Monday 9 Nov is intended. | `✓ Validated in private agent` |
| **P10** | `"Move it to 11."` | Asks whether `11` means a time (and AM/PM) or date (and which Event when multiple exist). | `✓ Validated in private agent` |
| **P11** | `"Today is 4 November 2026 in India. Draft a 30-minute scope review tomorrow at 10 am."` | Loads Scenario E, derives `5 November 2026` and `10:30 am` from explicit anchor, keeps unsupplied participants/organizer missing. | `✓ Validated in private agent` |
| **P12** | `"Move the scope review to 11 am and keep its 30-minute duration."` | In Screen 8 (Multi-Event), updates only Event 1 to `11:00–11:30 am` while preserving Event 2 (`2:00–3:00 pm`). | `✓ Validated in private agent` |
| **P13** | `"Discard the commercial review."` | Marks Event 2 `Discarded` in current conversation, preserves Event 1, explains nothing was deleted externally. | `✓ Validated in private agent` |
| **P14** | `"Find Atlas Metals Group."` | Opens Optional Salesforce Customer Context inspector with simulated branches (Sign-in required, Exact match, Multiple matches, No match). | `🔑 Configured · Sign-in required for verification` |
| **P15** | `"Looks good."` | Marks the proposal `Reviewed — unsaved` with zero CRM/calendar writes or invitations. | `✓ Validated in private agent` |
| **P16** | `"Book it and send the invites."` | Refuses write/invite: *"This phase supports capture and review only. Your proposal remains unsaved. No meeting has been booked and no invitations have been sent."* | `◌ Future scope — unavailable in this phase` |

## 6. Prototype-Only UI Elements vs. Actual Configured Agent Behavior

| Capability / Element | Prototype UI Behavior (This Wireframe) | Actual Configured Agent Behavior (`v1.1.1`) |
| :--- | :--- | :--- |
| **Event capture, evidence & review** | Interactive 3-pane browser UI with clickable S1–S3 snippets and revision diffing. | Implemented in private declarative agent source (`v1.1.1`) and validated in conversational markdown responses. |
| **3-step processing banner** | Visual progress pills (`Identify meeting details` → `Separate actions` → `Prepare evidence`). | Prototype-only UI state; M365 Copilot uses its native runtime progress indicator. |
| **Ambiguous IST/CST rule (Scenario F)** | Interactive scenario branch prompting for exact timezone/offset. | Configured validation rule in the `v1.1.1` instructions (not claimed as an independently validated production scenario). |
| **Optional Salesforce CRM context** | Simulated 4-branch selector using local synthetic lab data. | Configured via 6 Salesforce Hosted MCP read tools (`find`, `getObjectSchema`, `getRelatedRecords`, `getUserInfo`, `listRecentSobjectRecords`, `soqlQuery`) against a Developer Edition lab; live session currently requires sign-in. |
| **Paused Task & Opportunity Next Step** | Read-only historical explanation screen with disabled buttons that explain why writes are paused. | Mutation tools (`createSobjectRecord`, `updateSobjectRecord`) are removed from the active `v1.1.1` allowlist while duplicate/routing defects are pending repair. |
| **CRM Event save, calendar booking, invites, recordings, bFO** | Disabled controls and explicit refusal in chat. | Not implemented in this phase; future scope requiring customer process and field-mapping agreement. |

## 7. Sources, Assumptions & Maintenance

- **Source of Truth:** Customer brief supplied on **5 November 2026** for Meeting Outcome Assistant (`v1.1.1` private source). Readiness labels and architectural facts are taken directly from this brief.
- **Rebuilding / Editing:** Run `python3 artifacts/file_generation/ttl=63d/intermediate/build_wireframe.py` to regenerate both the single-file HTML deliverable and this README. Re-check capability badges after each product release or quarterly.

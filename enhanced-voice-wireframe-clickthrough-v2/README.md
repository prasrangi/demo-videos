# SE1 Enhanced Voice: wireframe click-through (v2)

A click-through wireframe of the proposed SE1 "Enhanced Voice" production architecture: Microsoft first-party Sales agent, a Copilot Studio declarative agent, and Salesforce MCP/API, with no Azure integration layer in the baseline.

This is v2. It sits next to the original (`../enhanced-voice-wireframe-clickthrough/`), which is unchanged.

**Illustrative, not a validated build.** All data is example data.

## Open it

- Online (after the branch is merged and Pages is on): `https://prasrangi.github.io/demo-videos/enhanced-voice-wireframe-clickthrough-v2/`
- Locally: double-click `index.html`. It is one self-contained file and needs no server. Fonts load from Google Fonts when online and fall back to system fonts when offline.

## What is in it

| Start here | Chapter | Audience | Length |
|---|---|---|---|
| `#start` | Overview with role chapters and the label legend | Everyone | n/a |
| `#seller` | Seller flow | Sellers, sales leaders | 7 steps |
| `#admin` | Admin setup | IT admins | 4 steps |
| `#gate` | Production gate | Security, architecture | 1 board, 8 open items |
| `#print` | Print view, 3 pages | Leave-behind | n/a |

Deep links such as `index.html#admin` open a chapter directly.

## What changed from v1

- Start screen with three role chapters, so each audience can go straight to its part.
- Every step carries an evidence label: **Documented**, **Configurable**, **Needs validation** (and **Out of scope** for the struck-through "Not in baseline" items).
- Seller flow includes an ambiguity moment (two matching opportunities, the seller picks one), the confirmation step, and a failed-write case with a retry.
- Captions are tighter (one headline, one short line).
- Presenter notes for every step: key message, what to say next, and one likely question with an answer.
- Readiness board has eight open items, each phrased as something to validate, plus one next step.
- Print view for a PDF leave-behind.
- Text sizes raised (nothing below 12px at design size, body at 14px or more) and an accessibility pass.
- A "Checked 4 Nov 2026" line on every board.

## Presenting

| Key | Action |
|---|---|
| Right arrow / Page Down | Next step (moves to the next chapter after the last step) |
| Left arrow / Page Up | Back |
| P | Start or pause auto-play (off by default) |
| N | Open presenter notes in a second window (use it on the presenter screen, share the main window). If pop-ups are blocked, notes open as a panel; Esc closes it. |
| F | Full screen |

The board scales to fit any window. On a phone in portrait, a hint asks for landscape.

### Personalise for a customer

Add `?customer=Name` to the address, for example `index.html?customer=Contoso#seller`. The start screen shows "Prepared for Contoso" and the example account in the seller flow uses that name. The value is limited to letters, numbers and basic punctuation, 40 characters.

### Print or save as PDF

Open `#print`, choose **Print or save as PDF**, landscape, and turn on background graphics. You get three pages: seller flow (finished state), admin setup, and the readiness board.

## Evidence labels

| Label | Meaning |
|---|---|
| Documented | Current vendor documentation describes this. |
| Configurable | Possible with supported configuration, set up for each customer. |
| Needs validation | Not yet confirmed. We validate it in your environment. |
| Out of scope | Not in the baseline architecture. |

## Sources (checked 4 Nov 2026)

- Microsoft Learn: Sales agent (voice, opportunity updates, confirmation before CRM changes, admin copy path and limits) and Copilot Studio MCP (tools and resources only, generative orchestration required).
- Salesforce documentation: hosted MCP servers (generally available 29 Apr 2026), per-user OAuth, runs as the authenticated user with field-level security and sharing, audit trails.

Preview features can change. The Sales agent voice opportunity updates are documented for Dynamics 365 Sales; the demo marks the Salesforce equivalent as *needs validation*. Licensing and billing for the Salesforce MCP server are shown as an open item only.

## Design choices

- Live microphone input is deliberately left out. The voice step is scripted, so the demo behaves the same in every room.
- Nothing in the demo calls a service. There is no tracking. If you share the link and want view counts, use your hosting analytics.

## Keeping it current

Re-check the two documentation sources before each customer meeting or each product release, update the "Checked" line, and move any item whose status changed. The board markup, styles and logic are in `<script type="text/plain">` blocks near the end of `index.html`, labelled `b-main-*`, `b-admin-*` and `b-gate-*`.

## Technical notes

- Preact 10.29.8 (MIT) is embedded; a small template runtime renders each board inside its own Shadow DOM so styles cannot leak.
- Tested in headless Chromium: all steps on all boards, the opportunity pick, the failed write, keys, notes (window and fallback), `?customer=`, a phone viewport, reduced motion and the 3-page PDF. An automated accessibility scan (WCAG 2.1 AA rules, including colour contrast) found no violations.

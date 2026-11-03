# Enhanced Voice wireframe click-through

A presenter-style, click-through wireframe of the proposed **SE1 Enhanced Voice** production architecture:
Microsoft first-party Sales agent + Copilot Studio declarative agent + Salesforce MCP/API, with no separate Azure integration layer in the baseline.

It is **illustrative, not a validated build**. The seller utterance and records ("Alex", "Sample Company") are made-up examples.

## Open it

- Locally: double-click `index.html`. It is one self-contained file and works offline (Preact is inlined; only the Carlito / IBM Plex Mono web fonts are fetched when online, with Calibri / system fonts as fallback).
- On the web: serve the folder, for example with GitHub Pages at `/enhanced-voice-wireframe-clickthrough/`.

## Three boards

| Board | Link | What it shows |
|---|---|---|
| Seller flow | `#seller` | 7 steps: open Sales agent, dictate, extract, retrieve Salesforce records, review and confirm, write, confirm what was written. Includes a "Simulate a failed write" toggle on the last step. |
| Admin setup | `#admin` | 4 steps: author in Copilot Studio, publish, copy compatible tools via Microsoft 365 admin, assign to seller groups. |
| Production gate | `#gate` | Production principles and 8 items to validate before go-live, as a tick-list. |

The page opens on the seller flow. Deep links such as `index.html#admin` open a specific board.

## Presenting

The demo is paused by default and moves only when you click.

| Key | Action |
|---|---|
| Right arrow / Page Down | Next step (or next board on the last step) |
| Left arrow / Page Up | Back |
| P | Start / pause auto-play |
| F | Full screen |

You can also click the numbered steps along the bottom, or the tabs at the top right. The board scales to fit any window.

## Editing

`index.html` has no build step. Each board's markup, styles and logic sit in the `<script type="text/plain" id="b-…">` blocks near the top, and a small runtime at the bottom turns them into the page. Edit the text there and reload.

Source: "PE1 Enhanced Voice – Proposed Production Architecture" deck.

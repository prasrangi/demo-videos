# Meeting Outcome Assistant · interactive wireframe

One self-contained file: **`index.html`**. Open it in a current desktop or tablet browser (Chrome, Edge, Safari or Firefox). It needs no install, no server, no network and no credentials. Everything is local sample data.

**Central promise:** capture the proposed meeting details, show where they came from, let the seller correct and review them, and keep everything unsaved in this phase.

> Interactive wireframe · Sample data · No live CRM or calendar changes. A demonstration, not a claim that every illustrated feature is deployed or production-ready.

## Start and reset

| To do this | Do this |
|---|---|
| Start the 8 to 10 minute guided demo | On the start screen choose **Guided demo**, or press **Presenter view** at the top |
| Explore on your own | Choose **Explore the wireframe** |
| Replay a case | Top strip → **Choose scenario** (main flow, A to F, multiple Events, embedded command, customer context) |
| Return to the starting sample state | Top strip → **Reset demo**. It clears every Event, chat message, lookup result and open panel, and closes Presenter view |
| Run the 16 final sales demo prompts | Events screen → **Demo prompts (16)**, top right of the chat. Each prompt is sent exactly as written. Prompts 1 to 10 are Salesforce questions, notes, Task and Next Step. Prompts 11 to 16 are the meeting proposals, and start a new chat |
| Turn the hover explanations on or off | Top strip → **Guide tips** (on by default). The setting survives **Reset demo** |
| Read the readiness overview | Left nav → **Capability overview** |
| Get the leave-behind | **Print / PDF** in Presenter view, or open `index.html#print` (landscape A4, one page per section) |

Choosing a scenario or a presenter step replays it from a clean state, so Back and Next are always reversible. Anything you typed before is discarded.

### Guide tips (for whoever you hand this to)
Hover over, or Tab to, almost anything and a short callout explains **what it is for and how to use it**, with a **Handover tip** where it helps (which step it belongs to, what to say, what not to claim). It covers the demo controls, navigation, every button and tab, prompt chips and quick replies, field labels, the readiness / basis / status badges, section headings, the customer-check controls, the paused CRM buttons, the Presenter dock and the drawers.

- **Mouse:** a tip appears after a short pause and stays open while the pointer is over it. It leaves when the pointer does.
- **Keyboard:** Tab, Shift+Tab and the arrow keys in a tab list show the tip for the focused control. **Esc** dismisses a visible tip first, so a second Esc is needed to close a drawer or panel behind it.
- **Quiet after a click or key press:** hover tips wait until the pointer actually moves again, so a resting mouse does not pop tips up while you present.
- **Before a customer session:** switch **Guide tips** off in the top strip. The Print / PDF view never shows tips.
- **Touch-only devices** have no hover, so tips are not offered there. Use the speaker notes and this README instead.
- Tips read the same on every screen and describe this wireframe only. They make no claim beyond the readiness labels.

### Keys in Presenter view
Arrow keys or PageUp / PageDown move between steps. **P** auto-play, **N** speaker notes (second window; shown in the page if pop-ups are blocked), **F** full screen, **Esc** closes panels and the notes.

### What the Presenter bar tells you at each step
- **This step · What we are doing:** a one-sentence goal, shown every time you arrive at a step. Say it before you click anything.
- **Just completed · Step N:** the outcome of the step you have just left, shown when you press **Next** (also PageDown, the right arrow and auto-play). It is your bridge into the new step. It is not shown after **Back**, when you jump from the step numbers, or on a `#step=N` link, because you did not just complete the previous step.
- Steps with variants (missing details, the four customer outcomes, the three multiple-Event cases) give the outcome for the variant you were showing when you pressed Next.
- **Hide step context / Show step context** frees up room on a small screen. The choice is kept as you move between steps. The same goal and outcome are in the speaker notes (**N**).

### Deep links
`#home`, `#meeting`, `#events`, `#capability/overview` (also `architecture`, `paused`, `proto`, `decisions`), `#step=1` to `#step=15` (11 to 15 are appendices A1 to A5), `#scenario=A` (also `B C D E F1 F2 multi inject context main`), `#print`.

## The 16 final sales demo prompts: what each one does here

The wireframe answers the 16 prompts in the supplied prompt list exactly as written. Typed, pasted (with or without line breaks) and sent from the **Demo prompts (16)** menu all give the same result. Nothing is saved, created or sent. Every Salesforce reply is read-only and comes from fixed sample data, shown only after the simulated sign-in.

| # | Prompt | What the wireframe does | Status shown |
|---|---|---|---|
| 1 | Customer overview | Account card with industry and website (sample) | Configured · Sign-in required for verification |
| 2 | Customer contacts | Four contacts with job titles. A contact role does not make someone an attendee | Configured · Sign-in required for verification |
| 3 | Open opportunities | Three open opportunities with stage and close date | Configured · Sign-in required for verification |
| 4 | Select the demo opportunity | Finds “MOA POC TEST - Meeting Outcome 2026-11-03”, shows its current next step, remembers it for this chat. Read-only | Configured · Sign-in required for verification |
| 5 | Analyse meeting notes | Decisions, risks and follow-up actions with owners and deadlines. Missing items say “Not provided”. “Don’t save anything yet” is honoured | Scripted for the demo notes |
| 6 | Save the meeting notes | Shows the note and the account it would link to, with a disabled Save | Future scope · not validated in the agent |
| 7 | Create a follow-up Task | “Requested, not created” reply that echoes the request | Previously demonstrated · Currently paused |
| 8 | Verify the saved Task | “There is no Task to show”, because none was created | Previously demonstrated · Currently paused |
| 9 | Update the next step | “Requested, not updated” reply that echoes the request | Previously demonstrated · Currently paused |
| 10 | Verify the opportunity update | Reads back the current next step, stage and close date. All unchanged | Configured · Sign-in required for verification |
| 11 | Capture two meetings | Two separate unsaved drafts. Time zone, location, organiser and customer are shared | Validated in private agent |
| 12 | Review the evidence | Per field: your instructions versus Salesforce, plus missing or assumed items | Validated in private agent |
| 13 | Change only one meeting | Only the technical review moves to 3 pm. The commercial review is untouched | Validated in private agent |
| 14 | Discard one proposal | The commercial draft is discarded in the conversation only. No calendar or CRM record is touched | Validated in private agent |
| 15 | Complete the unsaved review | Marked **Reviewed — unsaved**, with final details and their sources. No Event, no invitations | Validated in private agent |
| 16 | Save the reviewed meeting | Boundary reply with the customer, attendees, date, time and time zone for the preview. No Confirm button, no record link, no invitations | Future scope · unavailable in this phase |

Presenter view has three optional appendices for this: **A3** Salesforce questions, **A4** notes, Task and Next Step, **A5** two meeting proposals and the save boundary (A1 and A2 are multiple Events and the embedded command).

## What is in it (13 screens)

Sales home · Capture notes · Structured outcomes (sentence ↔ field highlighting both ways) · Event proposal fields · Evidence table · Corrections and revision comparison · Missing and conflicting scenarios A to F · Multiple Events · Optional customer context (match, several matches, no match, sign-in required) · Review approval and save boundary · Previously demonstrated CRM actions (paused) · Trust and source handling (embedded command and the five-rule help drawer) · Capability overview with architecture and technical drawer.

Try these phrases in the chat: “Move it to 3 pm and keep it 30 minutes.”, “Add Anika to the proposed attendees.”, “Keep the customer unverified.”, “Looks good.”, “Book it and send the invites.”, “Move it to 11.” (with two Events), “Discard the commercial review.”, “Find Atlas Metals Group.”, or any of the 16 prompts from the menu.

## Prototype-only versus configured behaviour

| Element | In this wireframe | In the configured agent |
|---|---|---|
| Notes to Event proposal | Scripted for the two sample notes, or drafted from one typed paragraph describing a meeting or two. Other text gets an explanatory message | Drafts from supplied notes. Validated in the private agent with synthetic notes (version 1.1.1) |
| Evidence and derivations | Rule-based sample logic | Part of the Events flow |
| Corrections | A small set of phrasings (time, date, attendee, keep unverified, discard, mark reviewed), plus field Edit forms | Conversational review |
| Missing and conflicting details | Scenarios A to F replayed from a chooser | Handled in the Events flow. Timezone and daylight-saving rules are configured validation rules, not independently validated production scenarios |
| Multiple Events | Scripted example, or drafted from one typed paragraph that describes two meetings | Part of the Events flow. Behaviour inside Sales awaits runtime validation |
| Customer context | Four simulated outcomes picked with a demo control | Read-only Salesforce Hosted MCP lookups. Sign-in is required for verification |
| Salesforce questions (prompts 1 to 4, 10) | Fixed sample Account, four contacts and three opportunities, shown after a simulated sign-in | Read-only lookups through the Salesforce Hosted MCP read tools. Sign-in is required for verification |
| Notes to decisions, risks and actions (prompt 5) | Scripted for the demo notes in the prompt list. Other notes are declined with an explanation | Listed in the final prompts. The project brief does not state its validation status |
| Typed note, Task and Next Step requests (prompts 6 to 9) | “Requested, not created” replies that echo the request. Nothing is sent anywhere | Task creation and Next Step update are paused. Saving a Salesforce note has not been validated in the agent |
| Sign-in | Simulated, no window, no credentials | A real sign-in in the Microsoft 365 / Sales host |
| Review status | Conversational, “Timestamp not captured” | Also conversational. No CRM Event ID, calendar item or persistent audit record |
| Save to CRM, send invitations | Disabled, labelled “Future scope — unavailable in this phase”. A typed save request (prompt 16) gets a boundary reply with a preview | Not implemented |
| Task and Next Step | Historical illustration, disabled buttons | Paused. The two custom mutation tools are removed from the active allowlist |
| Sales experience | A Sales-like shell built for the demo | Configured for the Sales host. Runtime validation pending |
| Scenario chooser, Reset, Presenter view, print view, S1…Sn labels, simulated steps | Prototype only | Not part of the agent |

## Readiness labels (each has an icon and text)
Validated in private agent · Configured · Sales validation pending · Configured · Sign-in required for verification · Previously demonstrated · Currently paused · Future scope.

## Assumptions and limits
- All product facts come from the supplied project brief of 4 November 2026. They were not re-checked against vendor documentation.
- **Task and Next Step stay paused, and saving a note or an Event stays Future scope.** The project brief says Task creation and the Next Step update are paused, that the two custom mutation tools are removed from the allowlist, and that persistent Event write-back is out of scope. The wireframe follows that. Prompts 6, 7, 9 and 16 therefore get an honest “requested, not created” or boundary reply, not a fake success with a record link. The prompt list asks for those actions, so if they are re-enabled and validated, those four replies and the capability screens should be revisited.
- The Account, four contacts, three opportunities, industry, website, job titles, stages, close dates and next steps behind prompts 1 to 4 and 10 are **invented sample data**, marked “(sample)”. They are not read from any Salesforce org. The opportunity “MOA POC TEST - Meeting Outcome 2026-11-03” is named in the prompt list, but its next step is also sample text.
- The Salesforce replies need the simulated sign-in first. After it, the pending question continues automatically.
- Prompt 5 works for the demo notes in the prompt list. Other notes are declined with an explanation, not guessed at.
- Pasted prompts may arrive without line breaks (some inputs strip them). The assistant still separates two meetings written in one paragraph.
- Only the two supplied sample notes, and the 16 prompts' own text, are processed. There is deliberately **no `?customer=` option**, because every source quote must match the displayed sample notes.
- The wireframe makes no network requests and stores nothing in the browser. No tool names, API fields, queries or credentials appear in the seller flow. Function names appear only in the technical drawer, the capability page and the print leave-behind.
- Tested in desktop Chromium, with 155 checks on the 16 prompts (typed, pasted with and without line breaks, and from the menu), the hover tips (zero elements without a tip), at 1440, 1280, 1024, 820 and 768 px wide, with axe (WCAG 2.1 A and AA: zero violations across 60 states, including the 16 prompt replies and the three new appendices), reduced motion, keyboard use and a rendered PDF. Not tested on a physical tablet or phone, in Safari or Firefox, or with a screen reader.

## Rebuilding from source

In the repository copy, `src/` holds the stylesheet, the markup skeleton and the JavaScript modules. Run `python3 src/build.py` to regenerate the single self-contained `index.html` (no dependencies). The deliverable is still just that one file.

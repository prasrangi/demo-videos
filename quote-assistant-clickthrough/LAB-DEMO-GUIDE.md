# Proposal Agent Demo Guide

## Connecting each demo prompt to the problem

**Demo explanation updated: 5 November 2026.** The click-through player now
highlights **Proposal Agent** and shows a problem statement, the change made,
the exact prompt or card action, its expected output and the result shown.
The highlighted prompt words explain why that step tests the stated problem.

[Open the updated demonstration](https://prasrangi.github.io/demo-videos/quote-assistant-clickthrough/).
The 22 video steps include card actions and monitoring inspections; they are
not the same numbering as the 19 reusable prompts later in this guide.
The footage, pause positions and public redactions are unchanged.

| Video step | Prompt or action focus | Problem being tested | Expected outcome |
|---|---|---|---|
| 1 | Slower background option; save it; notify me | Slow work outlasts the initial chat action | Saved acceptance before completion |
| 2 | Latest saved quote; status; do not create another | Progress checks could restart work or invent results | Read the same Running request without a final amount |
| 3 | Background quotes created today | Completed results are hard to find | Existing completed references and totals |
| 4 | My saved background quotes | History depends on conversation memory | User-owned persistent history, including errors |
| 5 | My account; do not create one yet | Creation could precede a personal-access check | Access result or connection request, no quote |
| 6 | Repair personal connection; Retry | Stale access could lead to shared-account substitution | Restore the individual's connection and complete the original check |
| 7 | Using my account; creation approval | Requester identity does not establish execution identity | One supported personal quote under the mapped individual account |
| 8 | Latest quote; items and total | A lookup could recalculate instead of retrieve | Same quote number, basket and CAD 190 |
| 9 | Managed workflow; tracking right away | Slow managed work lacks a stable tracking reference | Early acceptance with one tracking number |
| 10 | Status, total and processing history | Synchronized evidence could be mistaken for completion | Actual business stage, separate evidence status |
| 11 | Inspect application tracking and stages | Chat claims need a saved processing trail | Matching request, trace and service receipt |
| 12 | Final tracked result and history | Late results could lose their original request linkage | Same final tracked quote, USD 291 and eight stages |
| 13 | Check parts first; QO999999 | Unknown parts could create empty or partial quotes | Reject the product before creation and show a correction card |
| 14 | QO220 in the replacement-part card | One bad part could force a full restart | Same request, revision 2, validation before creation |
| 15 | Latest proposal; quote number, items and total | Corrected work must remain retrievable | Same revised proposal and corrected basket |
| 16 | Check list first; empty part-number cell | Malformed CSV could be discarded or create a blank quote | Structural error and full-CSV repair card, no quote |
| 17 | Corrected CSV header and QO220 row | CSV repair could lose request context or error history | Same request completes at revision 2 for CAD 190 |
| 18 | Saved background quotes; status and totals | Switching journeys could select the wrong saved history | Original background records, no new submission |
| 19 | Whose account; latest personal quote | Users cannot distinguish individual and shared execution | Saved individual executor for the same personal quote |
| 20 | Exact-request monitoring query | Processing lacks independently queryable event details | Correlated stage and revision rows, deduplicated deliveries |
| 21 | Token-handover match and trace match | An account label alone does not demonstrate token continuity | Matching handover event and consistent trace fields |
| 22 | Revision rejection, validation, creation and completion | Completion alone does not prove validation came first | Validation passes before creation at the corrected revision |

The managed request's premature completion text and the repeated personal
reply remain visible and are not presented as resolved. New-conversation
recovery, skipped tests and native audit checks are not claimed completed.
This update improves the demonstration explanation; it does not change the
Proposal Agent's execution workflows.

## Current status and where to resume

**Testing paused: 1 November 2026, 23:08 IST.**
**Last updated: 5 November 2026 (demo review; no new request submissions).**

**Monitoring update:** the user retrieved Application Insights output on
2 November. The video review on 5 November shows representative personal-token
handover and proposal-revision rows. Complete per-request event verification
and native Dataverse audit checks remain pending.

This guide saves all 19 reusable prompts suggested during the walkthrough,
the card inputs, what was actually showcased, and what remains unverified.
Punctuation is normalized for easy copying. Some messages sent in Teams omitted
the final "do not create" sentence; retain that sentence when reusing a lookup.

No further tests should run automatically. All six requests in the results table
were reported Completed at the last check. Skipped tests remain skipped.
Browser checks read existing records; they did not create replacement quotes.

**Next starting point:** review the saved results and the
[Application Insights demonstration](#application-insights-demonstration)
before submitting anything new. The fresh-conversation history check was left
waiting at connection consent in Copilot Studio. The review-only test was
explicitly skipped. The multiple-error and slow-proposal examples were not
demonstrated.

Earlier operator checks are separate from this walkthrough. Their historical
results must not be confused with newly demonstrated results. Internal
application and resource links are omitted from this public guide.

## What was showcased

| Business capability | What we observed | Status |
|---|---|---|
| Background quote processing | Acceptance came before completion; a later lookup showed processing; Teams subsequently delivered a completion card | Demonstrated |
| Saved quote history | Today-only and all-history lookups returned existing requests and totals | Demonstrated in the existing Teams conversation |
| Recovery in a new conversation | A fresh Copilot Studio test conversation reached a connection-consent screen, but did not return saved history | Not completed |
| Personal application access | A stale personal connection was repaired; the access check and quote execution used the mapped individual account | Demonstrated |
| Personal quote retrieval and identity | The same quote, items, total, requester and individual account were returned; saved token-handover receipts matched | Demonstrated |
| Managed processing with tracking | One tracking number linked eight processing stages and the saved result | Demonstrated; initial chat-response issue remains |
| Invalid product correction before creation | An unknown product was rejected, corrected through a card, and created only after the next revision passed | Demonstrated |
| Missing CSV field correction before creation | A missing part number produced a CSV repair card; the complete corrected CSV advanced the same request to completion | Demonstrated |
| Application Insights timeline | Combined query output and representative handover/validation rows were reviewed in the video on 5 November | Demonstrated; complete per-request event review pending |
| Native Dataverse audit history | Independent audit checks were not performed for these walkthrough requests | Pending |
| Two invalid products corrected sequentially | Example and expected card sequence were provided | Not demonstrated |
| Slow proposal validation and automatic callbacks | Example was provided, but this proposal test was not run | Not demonstrated |
| Review now and approve creation later | Separate validation-only prompts were provided | Skipped |

### Saved results from this walkthrough

| Business reference | Last observed result | What distinguishes this record | Saved result |
|---|---|---|---|
| `SAMPLE-20261101-01` | Completed, USD 291 | Submitted with the slow background prompt; quote `DEMO-QUOTE-1AE5E8BE` | Saved in the authorized background application |
| `CALC-20261029-01` | Completed, USD 291 | A separate request also appeared in the notification and history results; quote `DEMO-QUOTE-87663443` | Saved in the authorized background application |
| `MYQUOTE-1101-2224` | Completed, CAD 190 | Personal quote `UQ-6ED741C2FFD7`; individual application account and matching handover receipts | Saved in the authorized quote activity dashboard |
| `TRACK-1101-2232` | Completed, USD 291; evidence Synchronized | Managed training quote; eight recorded stages; about 162 seconds from gateway verification to completion | Saved in the authorized quote activity dashboard |
| `PARTS-1101-2243` | Completed, revision 2, CAD 190; evidence Synchronized | Unknown product corrected to QO220; one creation-request event, after revision 2 passed | Saved in the authorized Proposal Workspace |
| `CSV-1101-2249` | Completed, revision 2, CAD 190; evidence Synchronized | Missing part-number cell repaired with full CSV; original structural error retained | Saved in the authorized Proposal Workspace |

Two background completion cards had different request IDs and business
references. That is not proof that the first prompt created a duplicate.
The initiating submission for the separate `CALC-20261029-01` request was not
established from the visible first submission. Dates inside reference names are
not authoritative creation timestamps.

## Open the assistant and workspaces

| What to open | Link | Purpose |
|---|---|---|
| Quote assistant in Teams | [Open Teams](https://teams.cloud.microsoft/) | Open the existing **SE Proposal Agent** chat |
| Published assistant | [Open Teams](https://teams.cloud.microsoft/) | Find the approved SE Proposal Agent |
| Copilot Studio | [Open Copilot Studio](https://copilotstudio.microsoft.com/) | Select the approved environment and agent to inspect it or start a new test conversation |
| Personal and managed quote activity | Application-owner-provided link | Inspect saved identity, result, handover and tracking details |
| Automatic proposal workspace | Application-owner-provided link | Inspect saved proposal rows, revisions and results |
| Separate review-only workspace | Application-owner-provided link | Validate demo parts without automatic creation |
| Background processing monitor | Application-owner-provided link | Inspect background request progress |
| Application Insights Logs | [Open Azure portal](https://portal.azure.com/) | Select the approved Application Insights resource and open Logs |

Use Teams in Edge or Chrome for automatic proposal cards. The browser workspace
has its own normal application sign-in, separate from Teams connection consent.
Open a request-specific saved-result link rather than guessing an internal ID.

## Rules for repeating the demonstration

1. **Do not rerun completed creation prompts just to inspect their results.**
   Use a lookup prompt or the saved-result link instead.
2. Use a fresh business reference for a genuinely new test. References in this
   guide are the actual walkthrough examples, not fresh references for tomorrow.
   Use 1-40 ASCII letters, digits, hyphens or underscores.
3. Reuse an existing reference only with its original inputs. Changed inputs
   require a new reference; corrections use the existing request's correction
   action, not a replacement submission.
4. Acceptance or Running is not Completed. Do not invent a quote number or total
   while the saved record is still processing.
5. Wait without sending other chat messages during automatic proposal validation
   and correction. An intervening message can interrupt the topic continuation.
6. Enter corrections in the card. A replacement-part card takes one part number;
   a CSV repair card takes the complete corrected CSV, including its header.
7. Sign in and grant connection permission through the normal screens. Never
   paste passwords, access tokens, client secrets or function keys into chat.
8. Personal execution and centrally managed execution are separate journeys.
   Do not substitute a managed account for missing personal access.

The personal quote is deliberately bounded to the Canada basket shown below.
It must not silently replace different requested products, quantities or countries.
The background and tracked training quotes use a different sample and currency.
The database-backed proposal workflow is also separate from personal execution.

## Demonstrated prompts and outcomes

### Background work without waiting for the result

#### Prompt 1 - Submit a slow background request

```text
Prepare a new sample quote using the slower background option. Confirm when it starts, save it so I can find it in a new chat, and notify me when it's ready.
```

**What we showcased:** the assistant acknowledged a saved request before the
quote was complete. It returned reference `SAMPLE-20261101-01` and an expected
processing duration of about 150 seconds. Processing continued separately from
the initial reply.

The original synchronous timeout/failure comparison was not rerun in this
walkthrough. This prompt demonstrated the asynchronous path, not a fresh
before-and-after timeout measurement.

#### Prompt 2 - Retrieve progress without creating another quote

```text
Show me my latest saved background quote, its status, quote number and total. Don't create another quote.
```

**What we showcased:** the same saved request was Running at product validation.
The reply correctly said that no completed quote number or total was available
yet. A later Teams notification showed that request Completed for USD 291.
The initial lookup did not need to wait for the background job to finish.

#### Prompt 3 - Find today's saved background work

```text
Show me the background quotes I created today.
```

**What we showcased:** the assistant returned the two completed references
`SAMPLE-20261101-01` and `CALC-20261029-01`, each for USD 291. This was a saved
history lookup, not a new quote submission.

#### Prompt 4 - List saved background history

```text
Show me my saved background quotes.
```

**What we showcased:** the existing Teams conversation returned 12 recent saved
requests: ten Completed, one ValidationError and one TrackingFailed.
The old error entries were separate records, not failures of the two newly
observed completed requests.

ValidationError meant that no successful quote total was reported for that
invalid request. TrackingFailed meant that result tracking failed; it did not
establish whether the backend quote itself succeeded or failed.

**Notification boundary:** completion cards were actually observed in Teams
for both completed background references. Email fallback was not demonstrated
in this walkthrough. Notification delivery is not guaranteed for every future
run, so saved history remains the reliable recovery path.

### Check access and create a quote using the individual's account

#### Prompt 5 - Check access without creating a quote

```text
Check if my account can create quotes. Don't create one yet.
```

**What we showcased:** the assistant requested a connection before returning
an access result. The personal application connection was marked Stale.
The user opened the connection manager, reviewed and repaired that connection,
then returned to Teams and selected Retry.

Opening the connection manager alone did not establish access. The check had
to complete after the connection was usable. This was an access check, not
authorization to create a quote or use a shared account.

#### Prompt 6 - Create the supported personal quote

```text
Create a quote for Canada with 4 QO120, 1 QO220 and 1 QO115 using my account. Use reference MYQUOTE-1101-2224. I approve creating it.
```

**What we showcased:** one saved personal quote completed as
`UQ-6ED741C2FFD7`, CAD 190, under `MYQUOTE-1101-2224`.
Its three rows were QO120 x4, QO220 x1 and QO115 x1.

The saved record identified the verified requester and the mapped individual
application account. It was not the centrally managed technical executor.
The saved gateway and quote-API handover fingerprints matched for this request.
Those fingerprints are application evidence of token continuity, not an
independently attested network trace.

#### Prompt 7 - Retrieve the same personal quote and items

```text
Show my latest quote, including its items and total. Don't create another.
```

**What we showcased:** the reply returned the same personal quote number,
the same three products and quantities, Completed status, and CAD 190.
The response repeated the same result text, but both copies referred to the
same quote. Repeated text was not evidence of a second business quote.

#### Prompt 8 - Inspect the account used for personal execution

```text
Show whose account was used to create my latest personal quote. Don't create another.
```

**What we showcased:** the response identified the same personal quote and its
mapped individual account, with simulated application user `CPQ-USER-001`.
An authenticated saved-record check matched the reported account, requester,
quote and token-handover receipts. No shared service-account fallback was used
for this personal quote.

This is a simulated named-user grant. It does not prove commercial licensing,
federation, or compatibility with an actual customer application.
The recorded execution identity is historical; reading it does not establish
that an old access token is still active.

### Follow centrally managed processing from start to finish

#### Prompt 9 - Start a tracked managed request

```text
Create a sample quote with end-to-end tracking using the managed workflow. Use the slow option and reference TRACK-1101-2232. Give me the tracking number right away.
```

**What we showcased:** the assistant returned tracking number
`f1f64f99-e383-4159-9531-6df5411233c7` while processing continued.
The saved request used the slow profile and initially needed evidence
synchronization.

**Observed issue:** the initial chat reply also included premature
completion-shaped JSON and the incorrect quote number `DEMO-QUOTE-33C7`.
That text was not trusted as proof of completion. No fix to the initial
response was applied during this walkthrough.

#### Prompt 10 - Read the current stage and history

```text
Show my latest tracked quote, including its status, total and processing history. Don't create another.
```

**What we showcased:** the saved request was still Running at product validation,
with no completed quote total. Its recorded history showed gateway verification,
queuing, the training blank-quote stage, and product validation.
Evidence was Synchronized even though business processing was not yet complete.
The two statuses describe different things.

#### Prompt 11 - Read the final tracked result

```text
Show the final result and processing history for my latest tracked quote. Don't create another.
```

**What we showcased:** the final response and authenticated saved record agreed:
Completed, USD 291, evidence Synchronized, the same tracking number, and the
correct persisted quote number. The quote's external reference also matched
the tracking number.

| Recorded time on 1 November 2026, UTC | Processing stage |
|---|---|
| 17:05:13 | Gateway verified the requester |
| 17:05:15 | Work queued |
| 17:05:18 | Training blank-quote stage started |
| 17:05:30 | Product validation started |
| 17:07:41 | Quote pricing started |
| 17:07:52 | Dispatched to the quote service |
| 17:07:54 | Training quote service verified receipt |
| 17:07:55 | Completed |

The saved trace ID was `80f08f51d18f4784903df45dc68a3559`.
Elapsed time from gateway verification to completion was about 162 seconds.
This managed training workflow uses a service application, not the personal
quote's individual execution account.

The blank-quote stage belongs to this older managed training workflow.
The validate-before-create behavior below applies to the separate proposal
workflow; it was not retroactively applied to every quote path.

At the 1 November pause, Synchronized was verified only in the saved application
record. On 2 November, the user reported receiving output from the combined
Application Insights query below. The returned events have not yet been checked
against this run's eight saved stages. Native Dataverse audit remains unverified;
a synchronization flag alone does not establish query visibility.

### Correct an unknown product before creating a proposal quote

#### Prompt 12 - Submit the original parts list

```text
Create a proposal for Harbor Electrical's office upgrade in Canada.
Use reference PARTS-1101-2243 and the fast option.
Check the parts first. I approve creation only after all parts pass.

partNumber,quantity,description
QO120,4,Breaker
QO999999,1,Breaker
QO115,1,Breaker
```

**What we showcased:**

1. The request was saved at revision 1 and validation started.
2. An automatic failure card identified QO999999 as UnknownProduct.
3. A separate card requested a replacement for that product row.
4. The user corrected the existing request, rather than restarting it.

**Card input - enter in the replacement-part field, not as a new chat message:**

```text
QO220
```

The same request advanced to revision 2. Its saved history showed validation
passing before the creation-request event. It completed for CAD 190 with
evidence Synchronized. The original rejected revision was retained, and the
current rows were QO120 x4, QO220 x1 and QO115 x1.

One creation-request event was recorded, at revision 2. The saved complete
quote existed and matched the request result. No separate Create prompt was
needed because the original submission already authorized creation after
successful validation.

The completion card and its Open proposal button rendered in Teams.
Copied card text included an unsupported-card fallback link; that copied link
was not the proposal workspace and was not used as evidence of delivery.

#### Prompt 13 - Retrieve the saved proposal without changing it

```text
Show my latest proposal, including its quote number, items and total. Don't create another.
```

**Status:** the video review on 5 November shows the reply returning the
corrected `PARTS-1101-2243` proposal at revision 2, its three items and CAD 190.
No new request was submitted for this review. "Latest proposal" selects the
proposal journey, not personal or background history. After the following CSV
test, the latest saved proposal is `CSV-1101-2249`.

### Repair a missing CSV field without restarting

#### Prompt 14 - Submit the list with a missing part number

```text
Create a proposal for Harbor Electrical's office upgrade in Canada.
Use reference CSV-1101-2249 and the fast option.
Check this list first. I approve creation only after all rows pass.

partNumber,quantity,description
QO120,4,Breaker
,1,Breaker
QO115,1,Breaker
```

**What we showcased:** the request was saved instead of forcing a replacement
submission. The second product row had no part number, and the failure card
reported InvalidCsvRow for CSV row 3, counting the header as row 1.
A correction card requested the complete corrected CSV.

**Card input - paste the entire corrected CSV into that card:**

```csv
partNumber,quantity,description
QO120,4,Breaker
QO220,1,Breaker
QO115,1,Breaker
```

The same request advanced to revision 2, passed validation, and completed for
CAD 190 with evidence Synchronized. The original InvalidCsvRow error remained
in the archived revision. One creation-request event occurred only at revision 2.
The corrected rows, saved quote, and automatic Teams completion card were checked.

This structural error required a full CSV repair, unlike the one-part
replacement in the preceding example. CSV text was tested in chat and cards;
Teams file-attachment extraction was not demonstrated.

## Suggested prompts not completed in this walkthrough

These are saved for reference, not permission to start them automatically.
Expected behavior below is not an observed result for these examples.

### Two incorrect products, corrected one at a time

#### Prompt 15 - Sequential product corrections

**Status: not demonstrated.**

```text
Create a proposal for Harbor Electrical's office upgrade in Canada.
Use reference MULTI-1101-2251 and the fast option.
I approve creation only after all parts pass.

partNumber,quantity,description
QO120,4,Breaker
QO999999,1,Breaker
QO888888,1,Breaker
```

Expected card sequence:

1. Replace the first invalid product with **QO220**.
2. The request should still require correction, with no quote created.
3. Replace the remaining invalid product with **QO115**.
4. Only after both corrections should the same request complete at revision 3
   for CAD 190.

### Slow proposal validation and automatic feedback

#### Prompt 16 - Wait across both validation rounds

**Status: not demonstrated.**

```text
Create a proposal for Harbor Electrical's office upgrade in Canada.
Use reference SLOW-1101-2251 and the slow option.
I approve creation only after all parts pass.

partNumber,quantity,description
QO120,4,Breaker
QO999999,1,Breaker
QO115,1,Breaker
```

Expected: allow roughly three minutes for the rejection/correction card,
enter **QO220**, then wait again for the completion card. The slow profile,
request, context and authorization should remain unchanged across correction.
Expected final result: revision 2, CAD 190.

Do not send another message while either validation round is running.
The long managed quote demonstrated earlier does not establish that these
automatic proposal callbacks were tested beyond two minutes in this walkthrough.

### Saved background work in a genuinely new conversation

#### Prompt 17 - Check recovery without conversation memory

**Status: not completed.**

```text
Show my saved background quotes, with their status and totals. Don't create anything.
```

This wording returned the 12 saved requests in the existing Teams thread.
That demonstrated saved history retrieval, not recovery in a new conversation.

A fresh Copilot Studio test conversation was opened and a today-only history
lookup was submitted there. It stopped at Connect to continue and remained
waiting for connection permission. No saved-history result was obtained in
that fresh conversation. The new-conversation test was left unverified.

If this test is selected tomorrow, complete normal connection consent and
perform only the read-only lookup. Expect existing background records and their
saved totals, not new quote creation. A new message in the old Teams thread
does not count as a new conversation.

### Review parts now and approve creation separately

#### Prompt 18 - Validation only

**Status: skipped.**

```text
Validate these parts for Harbor Electrical's office upgrade in Canada.
Use reference REVIEW-1101-2254 and the fast option.
Do not create a quote.

partNumber,quantity,description
DEMO-MCB-16A,4,Breaker
DEMO-RCD-40A,1,Protection device
DEMO-PANEL-12,1,Panel
```

These references belong to the separate review-only training catalog, not the
public-reference catalog used in the automatic proposals.
Expected: save the request, validate the rows, and create no quote.

#### Prompt 19 - Read the validation-only result

**Status: skipped with the preceding submission.**

```text
Show the validation results for the parts I just submitted. Don't create a quote.
```

Expected after the preceding validation finishes: Validated, with no quote.
Creation would require a separate explicit approval afterward. No such
review-only submission, validation result or approval was demonstrated here.

## Application Insights demonstration

**Status: query output shown; complete event and native audit review pending.**

The user retrieved the combined query output on 2 November. Review of the
supplied video on 5 November shows the result table and representative
personal-handover and proposal-revision rows. No raw result export was captured;
visible output alone does not establish complete event coverage for every journey.

### URL and how to run

[Open Azure portal](https://portal.azure.com/), select the approved Application
Insights resource and open **Logs**. The resource owner provides access and the
resource name separately. Use **KQL mode** and **In query** for the time range.
If that option is not available, select a custom range covering
1-2 November 2026 UTC.

The query uses fixed dates so the saved demonstration does not disappear from
a rolling two-day window. Displayed times are IST; stored timestamps and the
filter are UTC. Keep the system-generated request IDs unchanged so the query
matches the actual saved records.

### KQL - personal quote, tracked quote and both corrected proposals

```kusto
let demos = datatable(BusinessReference:string, RequestId:string)
[
    "MYQUOTE-1101-2224", "B3U-6eeb2b1cc929d2d878ed6ed741c2ffd7",
    "TRACK-1101-2232",  "f1f64f99-e383-4159-9531-6df5411233c7",
    "PARTS-1101-2243",  "B11-1f050a89efd9181a9ad9a45f9ccf0593",
    "CSV-1101-2249",    "B11-e5b8c2669d95acdddc84fdbe3018b29b"
];
customEvents
| where timestamp >= datetime(2026-11-01T00:00:00Z)
    and timestamp < datetime(2026-11-03T00:00:00Z)
| extend
    RequestId = tostring(customDimensions.businessRequestId),
    EventId = tostring(customDimensions.eventId)
| where RequestId in (demos | project RequestId)
| summarize arg_max(timestamp, *) by RequestId, EventId
| lookup kind=inner demos on RequestId
| project
    TimeIST = format_datetime(timestamp + 330m, "yyyy-MM-dd HH:mm:ss"),
    BusinessReference,
    Stage = tostring(customDimensions.stage),
    Revision = tostring(customDimensions.revision),
    RecordedState = coalesce(
        tostring(customDimensions.status),
        tostring(customDimensions.outcome)),
    HandoverMatched = tostring(customDimensions.handoverMatched),
    TraceId = tostring(customDimensions.traceId),
    TraceMatches = operation_Id == tostring(customDimensions.traceId)
| order by BusinessReference asc, TimeIST asc
```

At Log Analytics workspace scope, use these equivalent names throughout the
query: `AppEvents` instead of `customEvents`, `TimeGenerated` instead of
`timestamp`, `Properties` instead of `customDimensions`, and `OperationId`
instead of `operation_Id`.

### Explain the output

| Column | What it shows |
|---|---|
| TimeIST | Recorded event time displayed in Indian Standard Time |
| BusinessReference | The business reference mapped from the exact saved request ID |
| Stage | The processing step recorded by the application |
| Revision | Proposal revision; blank for journeys without revisions |
| RecordedState | Recorded request status, or event outcome when status is absent |
| HandoverMatched | The personal quote's recorded token-continuity check; blank where that check does not apply |
| TraceId | The technical correlation ID shared by events in one journey |
| TraceMatches | Whether the monitoring operation ID equals the event's recorded trace ID |

Delivery can repeat an event. The query deduplicates by request ID and event ID;
repeated ingestion rows are not proof that another quote was created.
One journey should keep its saved trace ID, and its rows should report
`TraceMatches = true`.

These are explicit application custom events. Standard Requests or Dependencies
tables are not guaranteed to contain the whole journey. The combined query
does not cover the separate background requests, or access/list observations
that have their own request IDs.

### What to showcase and what still needs checking

| Business reference | Expected evidence to inspect |
|---|---|
| `MYQUOTE-1101-2224` | Requester verification, individual-account verification, quote dispatch, catalog validation, token-handover match, creation and completion. Look for `HandoverMatched = true`; additional read/reuse observations may also appear |
| `TRACK-1101-2232` | All eight saved stages under trace `80f08f51d18f4784903df45dc68a3559`; about 162 seconds from gateway verification to completion |
| `PARTS-1101-2243` | Rejection at revision 1, correction to revision 2, validation passing before creation, then completion; no creation-request event at the invalid revision |
| `CSV-1101-2249` | Structural CSV rejection, correction, successful validation, creation and completion at revision 2; the original error details remain in the saved application revision |

Query output has been received, but completeness, ordering and trace matches
for each of these four journeys are still pending review. This projection alone
also does not check every original event property for sensitive data.
Raw tokens, passwords and client secrets must not appear in monitoring.

The timeline demonstrates processing, not authoritative quote amounts or
commercial licensing. Check quote numbers, items and totals against the saved
application records. Native Dataverse audit is a separate check and is not
validated by this KQL query.

If expected events are missing, inspect the time range, resource scope and
recorded delivery status before concluding that monitoring is incomplete.
Do not create another quote to obtain logs for an already completed request.

## Next review checklist

- Open the same assistant and the saved-result links. Do not repeat a completed
  creation prompt simply because yesterday's chat reply is old.
- If a connection is stale or asks for consent, repair it normally and retry
  the existing access check or lookup. Do not switch to a shared account.
- If completing the proposal retrieval check, use Prompt 13 and compare its
  result with the latest saved CSV proposal.
- Review the Application Insights output against all four journeys above;
  keep event completeness and native audit marked pending until checked.
- Only if explicitly selected, finish the fresh-conversation history check.
  The current fresh test conversation is waiting at connection consent.
- Choose the multiple-error or slow-proposal example only if additional testing
  is wanted. Use a fresh business reference and let each workflow finish.
- Keep the validation-only example marked skipped unless it is explicitly selected.
- Investigate the premature completion-shaped text in the managed request's
  initial reply. The backend completed correctly, but that does not fix the
  misleading initial chat response.
- The repeated personal-quote reply text is a presentation issue, not evidence
  of duplicate quote creation. No presentation fix was applied.

## What these demonstrations do not prove

- These are training applications. SAP, Kafka, customer quoting systems,
  customer pricing and live inventory are not connected.
- Public product references do not make the configured CAD amounts official
  vendor prices. Country eligibility and active flags are configured lab policy.
- The personal account grant is simulated, not commercial-license approval.
  Personal execution is bounded; long-running user delegation was not demonstrated.
- Current saved records, application receipts and chat messages are not an
  immutable audit ledger or an independently attested network capture.
- Synchronized or Accepted evidence delivery is not proof that every monitoring
  query has become visible. Audit and monitoring views require separate permissions.
- No second-person isolation test, induced live dependency outage, provider
  revocation/reconnection test or Teams attachment-ingestion test was run here.
- Automatic proposal feedback should not be promised across arbitrary
  intervening messages or topic changes, or assumed to work in every host.

Detailed deployment configuration and private operator references remain with
the application owner. They are not required to view the
[public click-through demonstration](https://prasrangi.github.io/demo-videos/quote-assistant-clickthrough/).

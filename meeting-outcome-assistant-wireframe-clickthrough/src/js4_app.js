
/* ==========================================================================
   Drawers, start overlay, notes panel
   ========================================================================== */
const focusables = root => $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', root).filter(el => !el.closest('[hidden]') && el.getClientRects().length);
let NOTES_WIN = null;

function renderDrawers() {
  const h = $('#helpDrawer'), t = $('#techDrawer'), sc = $('#scrim'), st = $('#startOverlay'), np = $('#notesPanel');
  if (!h.dataset.built) { h.innerHTML = helpHtml(); h.dataset.built = '1'; }
  if (!t.dataset.built) { t.innerHTML = techDrawerHtml(); t.dataset.built = '1'; }
  if (!st.dataset.built) { st.innerHTML = startHtml(); st.dataset.built = '1'; }
  h.classList.toggle('show', !!S.ui.help); t.classList.toggle('show', !!S.ui.tech);
  sc.classList.toggle('show', !!(S.ui.help || S.ui.tech));
  st.classList.toggle('show', !!S.ui.start);
  const step = STEPS[S.presenter.step - 1];
  np.hidden = !S.ui.notesPanel;
  if (S.ui.notesPanel) np.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center"><h2 id="notesTitle" style="font-size:16px">Speaker notes${S.presenter.on ? ' · ' + esc(stepLabel(S.presenter.step)) : ''}</h2><button class="btn sm" type="button" id="notesClose" data-act="toggleNotes">${ic('close')}<span>Close</span></button></div>${S.presenter.on && step ? notesDl(step) : '<p class="small muted">Start Presenter view to see speaker notes.</p>'}`;
  const modal = !!(S.ui.help || S.ui.tech || S.ui.start);
  ['demobar', 'shell', 'presenter'].forEach(id => { const el = document.getElementById(id); if (el) el.inert = modal; });
  const sel = $('#scenSel'); if (sel && sel.value !== (S.scen || '')) sel.value = S.scen || '';
}
function openDialog(name) {
  if (!S.ui.help && !S.ui.tech) S._ret = document.activeElement;
  S.ui.help = name === 'help'; S.ui.tech = name === 'tech';
  render();
  const b = $(name === 'help' ? '#helpClose' : '#techClose'); if (b) b.focus();
}
function closeDialogs() {
  const was = S.ui.help || S.ui.tech;
  S.ui.help = false; S.ui.tech = false; render();
  if (was) { const r = S._ret; S._ret = null; if (r && r.isConnected) r.focus(); else { const m = $('#pgtitle') || $('#main'); if (m) m.focus(); } }
}

/* ==========================================================================
   Presenter view: 10 steps + 5 optional appendices (A1 to A5)
   ========================================================================== */
function quickCapture(kind) { kind = kind || 'main'; applyCapture(kind); userSay(DEFAULT_INSTRUCTION); aSay(...captureBlocks(kind, S.events[0])); }
const FIND = 'Find Atlas Metals Group.';
const STEPS = [
  { t: 'The seller problem', cap: 'Commitments and appointments end up scattered in meeting notes. Proposed CRM data needs review and traceability before anyone saves it.', hood: 'Sales home with readiness labels. Nothing here is connected to a live system.',
    key: 'Frame the problem, not the product. Point at the readiness labels early so nobody assumes more is live than is.', say: 'Next: paste notes and watch the assistant separate a real meeting from an action item.', likely: 'Is this connected to our CRM? No. It is a wireframe with sample data. The configured agent has optional, read-only CRM context.',
    setup() { S.route = 'home'; } },
  { t: 'Capture the notes', cap: 'The supplied notes become one Event proposal, the scope review, and one action item. The document deadline is not turned into a meeting.', hood: 'Simulated processing steps. Only the two sample notes are accepted.',
    key: 'Point at Action item 1 beside Event proposal 1. 9 November is a deadline for Elena, not a meeting.', say: 'Now let us check where each value came from.', likely: 'Can it read a recording? Not in this phase. Recording and transcript ingestion is future scope.',
    setup() { quickCapture(); S.route = 'meeting'; S.meetingTab = 'capture'; } },
  { t: 'Inspect fields and quotes', cap: 'Every Event field shows its basis and supporting quote. Select a source label such as S2 to see the sentence behind it.', hood: 'Derived values show their working, for example 10:30 am minus 10:00 am equals 30 minutes.',
    key: 'Show one User-provided value, one Derived value (India time, duration) and the AI suggestion (the title). Missing fields say Not provided.', say: 'A seller will want to change something. Let us move the time.', likely: 'How confident is it? No percentage is shown. The basis label tells you how far to trust a value.',
    setup() { quickCapture(); handleUserText('Show the evidence.'); S.selSentence = sentId('main', 'agreed a scope review'); S.ui.wide = true; S.panelTab = 'evidence'; S.route = 'events'; } },
  { t: 'Correct the time', cap: 'A short instruction changes only the time. The side panel shows before and after, and every other field keeps its evidence.', hood: 'Revision 2 records your sentence as the new evidence for the start time.',
    key: 'Read the comparison aloud: start 10:00 am to 3:00 pm, end recalculated to 3:30 pm, duration kept. Nothing else changed.', say: 'Now: what if the notes are incomplete, or disagree?', likely: 'Can I undo it? Edit the field again. Each change is a new revision and the history stays visible.',
    setup() { quickCapture(); handleUserText('Move it to 3 pm and keep it 30 minutes.'); S.panelTab = 'changes'; S.route = 'events'; } },
  { t: 'Missing and conflicting details', cap: 'When details are missing or disagree, the assistant asks. It does not guess a duration, timezone or date.', hood: 'Scenario A: no start, end or timezone. Your reply becomes the evidence.',
    key: 'Use the quick reply or type a short answer. The proposal becomes Ready for review only when the gap is closed.', say: 'Next: an optional check of the customer.', likely: 'Why not use my profile timezone? A profile timezone is not the meeting timezone, so it is never used automatically.',
    variants: [{ l: 'Missing details', id: 'A' }, { l: 'Date and weekday conflict', id: 'C', cap: 'The date and the weekday disagree, so the assistant asks which you meant. It does not choose.', hood: 'Scenario C: 6 November 2026 is a Friday, not a Monday.' }, { l: 'End before start', id: 'B', cap: 'The end is earlier than the start. Nothing is swapped, and no overnight meeting is assumed.', hood: 'Scenario B: 3 pm to 2 pm.' }],
    setup(v) { loadScenario(v.id); S.panelTab = 'event'; S.route = 'events'; } },
  { t: 'Optional customer check', cap: 'Customer context is optional and read-only. If sign-in is needed, the customer stays unverified and review carries on.', hood: 'Four simulated outcomes. Sign-in required is not the same as no match: nothing was searched.',
    key: 'Switch between the outcomes to show they look different. Verification did not complete is not No matching Account.', say: 'With the details settled, the seller marks the proposal reviewed.', likely: 'Does it need Salesforce access to draft? No. Drafting from notes never needs it.',
    variants: [{ l: 'Sign-in required', o: 'signin' }, { l: 'Exact match', o: 'match', cap: 'One exact Account match is marked Verified CRM, simulated result. The seller chooses whether to use it.' }, { l: 'Several matches', o: 'multi', cap: 'Three similar Accounts are found. None is picked for the seller; the seller chooses one.' }, { l: 'No match', o: 'none', cap: 'A completed search found no Account. That is different from a sign-in failure, and the customer stays unverified.' }],
    setup(v) {
      quickCapture(); S.lookup.outcome = v.o; handleUserText(FIND);
      if (v.o === 'signin' || v.o === 'none') lkAction('continue');
      else if (v.o === 'match') lkAction('use');
      else { lkAction('pick', 'm1'); lkAction('use'); }
      S.panelTab = 'customer'; S.route = 'events';
    } },
  { t: 'Mark reviewed', cap: 'Reviewed — unsaved. Marking reviewed changes only the review status. No CRM or calendar Event or invitation exists.', hood: 'Review status is conversational. Timestamp not captured, and no record ID is shown.',
    key: 'Note the blue information box, not a green success toast. There is no record ID, booking or Published to CRM message.', say: 'What if the seller asks it to book and send the invites?', likely: 'Is the review an approval? No. It is a status in the conversation, not a business approval or an audit entry.',
    setup() { quickCapture(); handleUserText('Looks good.'); S.panelTab = 'review'; S.route = 'events'; } },
  { t: 'The save boundary', cap: 'This phase supports capture and review only. The proposal stays unsaved; no meeting is booked and no invitations are sent.', hood: 'Save to CRM and Send invitations stay disabled: Future scope — unavailable in this phase.',
    key: 'No confirmation card, no hidden queue and no promise to save later. Click a disabled control to show the label.', say: 'Two earlier CRM actions appeared in past demos. They are paused.', likely: 'When will saving arrive? That is a business-process question for the next phase. No date is committed.',
    setup() { quickCapture(); handleUserText('Looks good.'); handleUserText('Book it and send the invites.'); S.panelTab = 'review'; S.route = 'events'; } },
  { t: 'Paused actions and labels', cap: 'Task creation and the Next Step update were shown in earlier demos. They are paused while Task fixes are pending.', hood: 'Disabled buttons only explain why. Earlier successful tests do not show the later defects are fixed.',
    key: 'Click Create Task to show the reason. Then name the five readiness labels one by one.', say: 'Finally, the questions we need your help to answer.', likely: 'Can we turn Task creation back on? Not in this phase. The two mutation tools are removed from the active allowlist.',
    setup() { S.route = 'capability'; S.capTab = 'paused'; } },
  { t: 'Questions to agree', cap: 'These business-process questions need your agreement: required fields, ownership, evidence, production CRM mapping and recording governance.', hood: 'Questions, not decisions. Nothing here implies approval of the proposed solution.',
    key: 'Do not close with production-ready. Ask which question matters most to them.', say: 'Optional appendices: multiple Events, an embedded command, Salesforce questions, notes and Task, and the Event save boundary.', likely: 'What is bFO? A possible future customer target. It needs process and field-mapping agreement first.',
    setup() { S.route = 'capability'; S.capTab = 'decisions'; } },
  { t: 'Appendix: multiple Events', cap: 'With two Event proposals, an ambiguous edit needs a choice. Changing one proposal never changes the other.', hood: 'Move it to 11 could be a time or a date, and could mean either Event.',
    key: 'Answer the clarification with the quick replies. Then show that only the chosen Event changed.', say: 'Last: what happens when a command is hidden in the notes.', likely: 'Does Event 2 move too? No. Each proposal has its own fields, evidence and revision.',
    variants: [{ l: 'Ambiguous request', x: 'Move it to 11.' }, { l: 'Targeted move', x: 'Move the scope review to 11 am and keep its 30-minute duration.', cap: 'Naming the Event and the time removes the ambiguity. Only the scope review changes, and its duration is kept.' }, { l: 'Discard one', x: 'Discard the commercial review.', cap: 'Discard changes conversation state only. Nothing was saved, so nothing is deleted anywhere.' }],
    setup(v) { loadScenario('multi'); handleUserText(v.x); S.panelTab = v.id === 2 ? 'changes' : 'event'; S.route = 'events'; } },
  { t: 'Appendix: embedded command', cap: 'A line in the notes tells the assistant to save and invite. It is treated as text and ignored. External actions: zero.', hood: 'Corrections you type are requests. Text inside pasted notes is source material.',
    key: 'Point at the ignored line, then open the help drawer to show the five rules.', say: 'Close with the open questions. Do not claim readiness or approval.', likely: 'Could a note ever trigger a save? No. Notes are source text, and this phase cannot save at all.',
    setup() { loadScenario('inject'); S.route = 'meeting'; S.meetingTab = 'outcomes'; } },
  { t: 'Appendix: Salesforce questions', cap: 'The seller asks about the customer in plain words. Replies are read-only and come from fixed sample data after a simulated sign-in.', hood: 'The same prompts are in the Demo prompts menu above the chat. Nothing is searched and nothing is written.',
    key: 'Say “sample data” out loud and point at the badge: Configured · Sign-in required for verification. A CRM contact role does not make someone an attendee.', say: 'Next: turn meeting notes into decisions and actions, and see what is paused.', likely: 'Is this reading our Salesforce? No. It is fixed sample data. The configured agent uses read-only Salesforce Hosted MCP tools and needs a real sign-in.',
    variants: [
      { l: 'Overview', n: 1 },
      { l: 'Contacts', n: 2, cap: 'The contacts for the customer, with sample job titles and CRM roles. The list is limited and says so.', hood: 'Prompt 2. Contacts are context, not attendees.' },
      { l: 'Open opportunities', n: 3, cap: 'The open opportunities with stage and close date. It is a limited sample, and no total is implied.', hood: 'Prompt 3. Nothing is attached to an Event.' },
      { l: 'Select the demo opportunity', n: 4, cap: 'One named opportunity is found and selected for this chat, with its current next step. The Task and next-step prompts would use it.', hood: 'Prompt 4. The selection is not attached to any Event.' }
    ],
    setup(v) { sfDemoSetup(); handleUserText(sfPrompt(v.n).text); S.panelTab = 'customer'; S.route = 'events'; } },
  { t: 'Appendix: notes, Task and Next Step', cap: 'Meeting notes become decisions, risks and actions without saving. Asking for a Task, a next-step update or a note gets an honest answer: requested, not created.', hood: 'Prompts 5 to 10. Task and next-step updates are paused. Saving a note is future scope.',
    key: 'Read the amber or grey box each time: it says what was not done. Then point at the Requested, not created line. Nothing is hidden or queued.', say: 'Last: two meeting proposals, from the first draft to the save request.', likely: 'Can we switch Task creation on for the demo? Not in this phase. The two custom mutation tools are removed from the active allowlist.',
    variants: [
      { l: 'Analyse notes', n: [5], cap: 'The notes become decisions, risks and follow-up actions. Owners and deadlines the notes did not give say Not provided. Nothing is saved.', hood: 'Prompt 5.' },
      { l: 'Prepare a note', n: [5, 6], cap: 'A note preview with the account it would link to. Saving a note is future scope, so the Save button is disabled and there is no link.', hood: 'Prompt 6. Note saving has not yet been validated in the agent.' },
      { l: 'Create a Task', n: [4, 7], cap: 'The Task request is shown back as asked, with its subject, due date and opportunity, and marked Requested, not created.', hood: 'Prompt 7. Task creation is paused.' },
      { l: 'Verify the Task', n: [4, 7, 8], cap: 'Checking for the Task finds none, because none was created. The assistant says so instead of inventing a due date or status.', hood: 'Prompt 8.' },
      { l: 'Update next step', n: [4, 9], cap: 'The next-step update is shown back as asked and marked Requested, not updated. Other opportunity details are untouched.', hood: 'Prompt 9. The NextStep update is paused.' },
      { l: 'Verify next step', n: [4, 9, 10], cap: 'The read-back shows the next step, stage and close date unchanged, and says the update was never saved.', hood: 'Prompt 10.' }
    ],
    setup(v) { sfDemoSetup(); v.n.forEach(k => handleUserText(sfPrompt(k).text)); S.panelTab = 'customer'; S.route = 'events'; } },
  { t: 'Appendix: two meeting proposals', cap: 'Two meetings drafted from one paragraph, each with its sources. Change one, discard one, review the last, and see what happens when the seller asks to save it.', hood: 'Prompts 11 to 16, in a new Sales chat. Everything stays unsaved. The save request gets a boundary reply.',
    key: 'Run the variants in order: they build on each other. Point at Event 2 staying unchanged, and at the Future scope box on the last one.', say: 'Close with the open questions. Do not claim readiness or approval.', likely: 'Does the save request create a Salesforce Event? No. Saving an Event needs to be enabled and tested first. The reply shows the details a confirmation would contain.',
    variants: [
      { l: 'Two drafts', n: 11 },
      { l: 'Show the evidence', n: 12, cap: 'For each meeting: what came from the seller’s instructions, what was worked out, what came from Salesforce (nothing) and what is missing.', hood: 'Prompt 12.' },
      { l: 'Change one meeting', n: 13, cap: 'Only the technical scope review moves to 3 pm, keeping 30 minutes. The commercial review is untouched.', hood: 'Prompt 13.' },
      { l: 'Discard one', n: 14, cap: 'The commercial review is discarded in the conversation only. Nothing was saved, so nothing was deleted.', hood: 'Prompt 14.' },
      { l: 'Mark reviewed', n: 15, cap: 'Reviewed — unsaved, with the final details and their sources listed. No calendar event is created and no invitation is sent.', hood: 'Prompt 15.' },
      { l: 'Save request', n: 16, cap: 'The save request is declined plainly. The details a confirmation would show are listed, and the Save control is disabled as future scope.', hood: 'Prompt 16. Saving a Salesforce Event is future scope.' }
    ],
    setup(v) { for (let k = 11; k <= v.n; k++) handleUserText(sfPrompt(k).text); S.panelTab = v.n >= 15 ? 'review' : v.n === 12 ? 'evidence' : v.n === 13 ? 'changes' : 'event'; S.route = 'events'; } }
];
/* Presenter helper: the appendix prompts run as if the seller had already completed the simulated sign-in. */
function sfDemoSetup() { const L = S.lookup; L.outcome = 'match'; L.status = 'done'; L.result = 'match'; }
const MAIN_STEPS = 10;

/* Context for each step: the goal when we arrive, and the outcome we state when the presenter moves on.
   `vdone` holds a different outcome for each variant of a step (same order as the step's variants). */
const STEP_CTX = [
  { goal: 'Set the scene. We start on Sales home to frame the seller problem and point out the five readiness labels, before any notes are captured.',
    done: 'The problem is framed, and the audience has seen the five readiness labels, so everyone knows what is validated, pending, paused or future.' },
  { goal: 'Turn the supplied meeting notes into a proposal. We capture the sample notes and watch the assistant separate the meeting from the action item.',
    done: 'The notes produced one Event proposal (the scope review) and one separate action item (Elena sends the scope document). Nothing was saved.' },
  { goal: 'Check where each value came from. We open the evidence and select source sentences to see the quote or working behind each field.',
    done: 'Every field now shows its basis (user-provided, derived or AI suggestion) and a supporting quote or calculation, so the seller can judge how far to trust each value.' },
  { goal: 'Show how a seller corrects a detail. We move the meeting to 3 pm with one instruction and read the before and after.',
    done: 'Only the start and end changed (now 3:00 to 3:30 pm) and the 30-minute duration was kept. It is revision 2, your sentence is the new evidence, and every other field kept its evidence.' },
  { goal: 'See what happens when notes are incomplete or disagree. We load a case and answer the assistant’s question instead of letting it guess.',
    done: 'The assistant asked about the gap or conflict instead of guessing, and the proposal can only reach Ready for review once the seller answers.',
    vdone: ['The missing start, end or duration, and timezone were asked for, not guessed. Once the seller answers, the reply becomes the evidence.',
            'The date and the weekday disagreed, so the assistant asked which one was meant. Nothing was chosen for the seller.',
            'The end was earlier than the start. Nothing was swapped and no overnight meeting was assumed. The assistant asked for a correction.'] },
  { goal: 'Show the optional, read-only customer check. We run the simulated search and see how each of the four outcomes looks.',
    done: 'The customer check is optional. Whatever it returned, the seller can carry on to review.',
    vdone: ['Sign-in was required, so nothing was searched. The customer stays unverified, and review carries on.',
            'One exact Account matched and was used. It is labelled Verified CRM · Simulated result, and the seller chose to use it.',
            'Three similar Accounts were found. None was picked for the seller, who chose one.',
            'A completed search found no Account. The customer stays unverified, and review carries on.'] },
  { goal: 'Show how a review ends. With the details settled, the seller marks the proposal reviewed.',
    done: 'The proposal is Reviewed — unsaved. Only a status changed. No CRM or calendar Event, invitation or record ID exists.' },
  { goal: 'Test the boundary. We ask the assistant to book the meeting and send invitations, and see what it says.',
    done: 'The assistant declined to book or invite, and said so plainly. Nothing was queued or promised for later. Save to CRM and Send invitations stay disabled as future scope.' },
  { goal: 'Be clear about what is not available. We look at the two earlier CRM demos and name the five readiness labels.',
    done: 'Task creation and the Next Step update are paused while Task fixes are pending. The audience now has the five labels to describe what is validated, pending, paused and future.' },
  { goal: 'Move from demo to decisions. We put the five business-process questions to the customer.',
    done: 'The five questions (required fields, ownership, evidence, production CRM mapping and recording governance) are on the table. They are questions, not decisions. The main demo is finished.' },
  { goal: 'An optional extra. With two Event proposals, we see how an ambiguous edit is handled.',
    done: 'Each Event kept its own fields, evidence and revision.',
    vdone: ['“Move it to 11” was ambiguous, so the assistant asked which Event and whether 11 meant a time or a date. Nothing changed.',
            'Only the scope review moved (to 11 am, 30 minutes kept). The commercial review was untouched.',
            'The commercial review was discarded in the conversation only. Nothing was saved, so nothing was deleted, and it can be restored.'] },
  { goal: 'An optional extra on trust. We load notes that hide a command and see how the assistant treats it.',
    done: 'The embedded command was shown as source text and ignored. External actions: 0. Nothing was created or sent.' },
  { goal: 'An optional extra for handover. The seller asks Salesforce questions in plain words and we read the answers.',
    done: 'The seller got read-only answers from fixed sample data. Contacts were context, not attendees, and nothing was written to Salesforce.',
    vdone: ['The overview showed industry and website for the customer, as sample data.', 'Contacts came back with sample job titles and CRM roles. A role does not make anyone an attendee.', 'Open opportunities came back with stage and close date, as a limited sample with no total.', 'The demo opportunity was found and selected for this chat. It is not attached to any Event.'] },
  { goal: 'An optional extra on what is not available. We turn notes into actions, then ask for a note, a Task and a next-step update.',
    done: 'The notes were summarised without saving. The note, the Task and the next-step update were each shown back as requested, not carried out.',
    vdone: ['The notes were summarised into decisions, risks and actions. Missing owners and deadlines say Not provided. Nothing was saved.', 'The note preview showed the linked account. Saving it is future scope, so no note or link exists.', 'The Task request was shown back and marked Requested, not created, because Task creation is paused.', 'No Task exists to read back, and the assistant said so rather than inventing details.', 'The next-step request was shown back and marked Requested, not updated, because the update is paused.', 'The next step, stage and close date were read back unchanged. The update was never saved.'] },
  { goal: 'An optional extra on the full meeting-proposal journey. We draft two meetings, check their sources, change one, discard one, review the last and ask to save it.',
    done: 'The journey ended unsaved. The save request was declined and the details a confirmation would show were listed.',
    vdone: ['Two separate unsaved proposals were drafted from one paragraph, with their sources.', 'Each detail was traced to the seller’s instructions, worked out, or missing. Nothing came from Salesforce.', 'Only the technical scope review changed. The commercial review was untouched.', 'The commercial review was discarded in the conversation only. The technical review was kept.', 'The technical scope review is Reviewed — unsaved, with its final details and sources listed.', 'The save request was declined. No Event, record link or invitation exists. The Save control stays disabled as future scope.'] }
];
const stepShort = n => n <= MAIN_STEPS ? `Step ${n}` : `Appendix ${n - MAIN_STEPS}`;
const stepGoal = n => STEP_CTX[n - 1].goal;
function stepDone(n, sub) { const c = STEP_CTX[n - 1]; return (c.vdone && c.vdone[Math.min(sub || 0, c.vdone.length - 1)]) || c.done; }
const stepLabel = n => n <= MAIN_STEPS ? `Step ${n} of ${MAIN_STEPS}` : `Appendix ${n - MAIN_STEPS} of ${STEPS.length - MAIN_STEPS}`;
function stepVariant(n) { const st = STEPS[n - 1]; if (!st.variants) return null; const v = Object.assign({}, st.variants[Math.min(S.presenter.sub || 0, st.variants.length - 1)]); v.id = v.id || (S.presenter.sub || 0) + 1; return v; }
function applyStep() {
  const n = S.presenter.step, st = STEPS[n - 1], v = stepVariant(n);
  resetWorkspace(); S.presenter.on = true;
  st.setup(v);
}
function stepText(n) { const st = STEPS[n - 1], v = stepVariant(n); return { cap: (v && v.cap) || st.cap, hood: (v && v.hood) || st.hood }; }
function goStep(n, sub, from) {
  n = Math.max(1, Math.min(STEPS.length, +n || 1));
  S.presenter.on = true; S.presenter.step = n; S.presenter.sub = sub || 0; S.ui.start = false;
  S.presenter.prev = from || null;   // set only by Next, so Back, a jump or a deep link show the goal alone
  applyStep(); render(); updateNotesWin();
  announce(`${stepLabel(n)}. ${STEPS[n - 1].t}. ${from ? `Outcome of ${stepShort(from.n)}: ${stepDone(from.n, from.sub)} ` : ''}What we are doing: ${stepGoal(n)}`);
}
function setVariant(i) { S.presenter.sub = +i; applyStep(); render(); updateNotesWin(); announce(`${STEPS[S.presenter.step - 1].t}: ${STEPS[S.presenter.step - 1].variants[+i].l}. ${stepText(S.presenter.step).cap}`); }
const pdNext = () => { const n = S.presenter.step; if (n < STEPS.length) goStep(n + 1, 0, { n, sub: S.presenter.sub || 0 }); };
const pdBack = () => { if (S.presenter.step > 1) goStep(S.presenter.step - 1); };
let AUTO = null;
function setAuto(on) {
  clearInterval(AUTO); AUTO = null; S.presenter.auto = !!on;
  if (on) AUTO = setInterval(() => { if (S.presenter.step >= MAIN_STEPS) { setAuto(false); render(); announce('Auto-play finished at the end of the main demo.'); return; } pdNext(); }, 11000);
}
function notesDl(st) {
  const v = stepText(STEPS.indexOf(st) + 1);
  const n = STEPS.indexOf(st) + 1;
  return `<dl><dt>Goal of this step</dt><dd>${esc(stepGoal(n))}</dd><dt>On screen</dt><dd>${esc(v.cap)}</dd><dt>Key point</dt><dd>${esc(st.key)}</dd><dt>Under the hood</dt><dd>${esc(v.hood)}</dd><dt>Outcome to state when you press Next</dt><dd>${esc(stepDone(n, S.presenter.sub))}</dd><dt>Say next</dt><dd>${esc(st.say)}</dd><dt>Likely question</dt><dd>${esc(st.likely)}</dd></dl>`;
}
function renderPresenter() {
  const el = $('#presenter'), p = S.presenter;
  el.hidden = !p.on; document.body.classList.toggle('presenting', !!p.on);
  if (!p.on) { el.innerHTML = ''; return; }
  const n = p.step, st = STEPS[n - 1], tx = stepText(n);
  const trk = STEPS.map((s, i) => {
    const k = i + 1, lab = k <= MAIN_STEPS ? String(k) : 'A' + (k - MAIN_STEPS);
    return (k === MAIN_STEPS + 1 ? '<li class="sep" aria-hidden="true"></li>' : '') + `<li><button type="button" id="pdt-${k}" data-act="pdGo" data-n="${k}" ${k === n ? 'aria-current="step"' : ''} aria-label="${esc(stepLabel(k))}: ${esc(s.t)}">${lab}</button></li>`;
  }).join('');
  el.innerHTML = `<div class="pd-top"><div class="ttl" role="heading" aria-level="2">Presenter view · ${esc(stepLabel(n))} · ${esc(st.t)}</div>
    <div class="pd-ctrl"><button class="btn sm" type="button" id="pd-back" data-act="pdBack" ${n === 1 ? 'aria-disabled="true"' : ''}>${ic('arrow', 'flipx')}<span>Back</span></button><button class="btn sm primary" type="button" id="pd-next" data-act="pdNext" ${n === STEPS.length ? 'aria-disabled="true"' : ''}><span>${n === MAIN_STEPS ? 'Next: appendix' : 'Next'}</span>${ic('arrow')}</button><button class="btn sm" type="button" id="pd-auto" data-act="pdAuto" aria-pressed="${!!p.auto}">${ic(p.auto ? 'pause' : 'play')}<span>${p.auto ? 'Pause auto-play' : 'Auto-play'} (P)</span></button><button class="btn sm" type="button" id="pd-notes" data-act="toggleNotes" aria-pressed="${!!(S.ui.notesPanel || (NOTES_WIN && !NOTES_WIN.closed))}"><span>Speaker notes (N)</span></button><button class="btn sm" type="button" id="pd-tech" data-act="openTech"><span>Technical inventory</span></button><button class="btn sm" type="button" id="pd-print" data-act="openPrint"><span>Print / PDF</span></button><button class="btn sm" type="button" id="pd-fs" data-act="fullscreen"><span>Full screen (F)</span></button><button class="btn sm" type="button" id="pd-close" data-act="togglePresenter"><span>Close</span></button></div></div>
    <div class="pd-row"><ol class="pd-track" aria-label="Demo steps">${trk}</ol><button type="button" class="btn sm" id="pd-ctxbtn" data-act="pdCtx" aria-expanded="${!p.ctxHide}" aria-controls="pd-ctx">${p.ctxHide ? 'Show step context' : 'Hide step context'}</button></div>
    <div class="pd-ctx${p.prev ? ' two' : ''}" id="pd-ctx" role="group" aria-label="Step context"${p.ctxHide ? ' hidden' : ''}>${p.prev ? `<p class="pd-done"><span class="lbl">${ic('tick')} Just completed · ${esc(stepShort(p.prev.n))}: ${esc(STEPS[p.prev.n - 1].t)}</span>${esc(stepDone(p.prev.n, p.prev.sub))}</p>` : ''}<p class="pd-goal"><span class="lbl">${ic('arrow')} This step · What we are doing</span>${esc(stepGoal(n))}</p></div>
    <p class="pd-cap"><strong>${esc(tx.cap)}</strong></p><p class="pd-hood">Under the hood: ${esc(tx.hood)}</p>
    ${st.variants ? `<div class="pd-sub"><span id="pdVarLbl">Show:</span><span role="group" aria-labelledby="pdVarLbl" class="pd-ctrl">${st.variants.map((v, i) => `<button type="button" class="btn sm" id="pdv-${i}" data-act="pdVar" data-i="${i}" aria-pressed="${i === (p.sub || 0)}">${esc(v.l)}</button>`).join('')}</span></div>` : ''}`;
}

/* speaker notes: second window, with an in-page fallback if pop-ups are blocked */
function notesWinHtml() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Speaker notes · Meeting Outcome Assistant</title><style>body{font:16px/1.5 system-ui,"Segoe UI",Arial,sans-serif;margin:0;padding:16px;color:#201f1e;background:#fff}h1{font-size:19px;margin:0 0 4px}dt{font-weight:700;margin-top:14px}dd{margin:4px 0 0}.m{color:#484644;font-size:14px;margin:0 0 8px}</style></head><body><p class="m">Speaker notes · Sample data · No live CRM or calendar changes</p><h1 id="nt-title">Speaker notes</h1><div id="nt-body" aria-live="polite"></div></body></html>`;
}
function updateNotesWin() {
  if (!NOTES_WIN || NOTES_WIN.closed) { NOTES_WIN = null; return; }
  try {
    const d = NOTES_WIN.document, st = STEPS[S.presenter.step - 1];
    d.getElementById('nt-title').textContent = `${stepLabel(S.presenter.step)} · ${st.t}`;
    d.getElementById('nt-body').innerHTML = notesDl(st);
  } catch (e) { /* the window was closed or navigated away */ }
}
function toggleNotes() {
  if (NOTES_WIN && !NOTES_WIN.closed) { NOTES_WIN.close(); NOTES_WIN = null; render(); return; }
  if (S.ui.notesPanel) { S.ui.notesPanel = false; render(); const b = $('#pd-notes'); if (b) b.focus(); return; }
  let w = null;
  try { w = window.open('', 'moa_speaker_notes', 'popup=yes,width=520,height=700'); } catch (e) { w = null; }
  if (!w || w.closed) {
    S.ui.notesPanel = true; render(); toast('Pop-ups are blocked, so the speaker notes are shown in the page instead. Press Esc to close them.');
    const b = $('#notesClose'); if (b) b.focus(); return;
  }
  NOTES_WIN = w;
  try { w.document.open(); w.document.write(notesWinHtml()); w.document.close(); } catch (e) { /* ignore */ }
  updateNotesWin(); render();
}
function toggleFullscreen() {
  try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { toast('Full screen is not available in this browser.'); }
}

/* ==========================================================================
   Print / PDF leave-behind
   ========================================================================== */
function printPages() {
  const pages = [];
  const page = (title, inner) => pages.push({ title, inner });
  const plain = k => BASIS[k].text;
  page('Overview', `<h1>Meeting Outcome Assistant</h1><p style="font-size:15px;margin:0 0 10px"><strong>Capture the proposed meeting details, show where they came from, let the seller correct and review them, and keep everything unsaved in this phase.</strong></p>
    <p>A Microsoft 365 declarative-agent extension to the Microsoft Sales agent. It turns a seller’s supplied meeting notes into a structured, evidence-backed Event proposal that the seller reviews and corrects. The proposal is always left unsaved.</p>
    <h2>Readiness labels</h2><table class="tbl"><caption class="vh">Readiness labels</caption><thead><tr><th scope="col">Label</th><th scope="col">Meaning</th></tr></thead><tbody>
    <tr><td>${rb('validated')}</td><td>The unsaved Event capture and review flow was tested in the private agent with supplied synthetic notes (version 1.1.1).</td></tr>
    <tr><td>${rb('salesPending')}</td><td>Configured for the Sales host. Behaviour of the updated tool set inside Sales is not yet validated.</td></tr>
    <tr><td>${rb('signin')}</td><td>Optional customer context is configured, but needs a sign-in before it can be verified.</td></tr>
    <tr><td>${rb('paused')}</td><td>Task creation and the Opportunity Next Step update were shown in earlier demos. Task fixes are pending.</td></tr>
    <tr><td>${rb('future')}</td><td>Not implemented in this phase.</td></tr></tbody></table>
    <h2>Start and reset the demonstration</h2><ul><li>Open <strong>index.html</strong> in a current desktop or tablet browser. It needs no installation and makes no network calls.</li><li>Use <strong>Presenter view</strong> for the 8 to 10 minute guided demo, <strong>Choose scenario</strong> to replay a case and <strong>Reset demo</strong> to return to the starting sample state.</li><li>On Event proposals, <strong>Demo prompts (16)</strong> sends each of the final sales demo prompts exactly as written.</li></ul>`);
  page('Capability inventory', `<h1>Capability inventory</h1><div class="pcols" style="grid-template-columns:repeat(3,1fr)">${[[INVENTORY[0]], [INVENTORY[1], INVENTORY[2]], [INVENTORY[3], INVENTORY[4]]].map(col => `<div>${col.map(g => `<div style="margin-bottom:8px">${rb(g.badge)}<h2>${esc(g.title)}</h2><ul>${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul><p class="small muted" style="margin:3px 0 0">${esc(g.note)}</p></div>`).join('')}</div>`).join('')}</div>`);
  const ev = makeSample(1, 'main');
  page('Sample journey', `<h1>Sample journey: notes to an unsaved proposal</h1><p class="small" style="margin:0 0 6px">${sents('main').map((t, i) => `<strong>S${i + 1}</strong> ${esc(t)}`).join(' ')}</p>
    <table class="tbl"><caption class="vh">Event proposal with evidence, from the sample notes</caption><thead><tr><th scope="col">Field</th><th scope="col">Proposed value</th><th scope="col">Basis</th><th scope="col">Source</th></tr></thead><tbody>${FIELDS.map(([k, l]) => { const x = ev.f[k], v = dispV(ev, k); return `<tr><td><strong>${l}</strong></td><td>${v ? esc(v) : '<em>Not provided</em>'}</td><td>${plain(x.basis)}</td><td>${x.src.map(s => esc(srcLabel(s))).join(', ') || '—'}${x.calc ? ' · ' + esc(x.calc) : ''}</td></tr>`; }).join('')}</tbody></table>
    <p class="small" style="margin:6px 0 0"><strong>Reviewed — unsaved.</strong> No CRM/calendar Event or invitation has been created. Elena sending the scope document is an action item, not an Event.</p>`);
  const half = Math.ceil(PROTO_ROWS.length / 2);
  [PROTO_ROWS.slice(0, half), PROTO_ROWS.slice(half)].forEach((rows, i) => page('Prototype versus configured', `<h1>Prototype-only elements versus configured behaviour (${i + 1} of 2)</h1><table class="tbl"><caption class="vh">Wireframe compared with the configured agent</caption><thead><tr><th scope="col" style="width:20%">Element</th><th scope="col" style="width:38%">In this wireframe</th><th scope="col">In the configured agent</th></tr></thead><tbody>${rows.map(r => `<tr><th scope="row" style="text-align:left">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}${r[3] ? `<div style="margin-top:3px">${rb(r[3])}</div>` : ''}</td></tr>`).join('')}</tbody></table>`));
  const sc = (arr, off, tl) => `<h1>${tl}</h1><table class="tbl"><caption class="vh">${tl}</caption><thead><tr><th scope="col" style="width:5%">#</th><th scope="col" style="width:18%">Step</th><th scope="col" style="width:40%">On screen</th><th scope="col">Speaker prompt</th></tr></thead><tbody>${arr.map((s, i) => `<tr><td>${off + i + 1 <= MAIN_STEPS ? off + i + 1 : 'A' + (off + i + 1 - MAIN_STEPS)}</td><td><strong>${esc(s.t)}</strong></td><td>${esc(s.cap)}</td><td>${esc(s.key)}</td></tr>`).join('')}</tbody></table>`;
  page('Presenter script', sc(STEPS.slice(0, 5), 0, 'Presenter script, 8 to 10 minutes (1 of 3)'));
  page('Presenter script', sc(STEPS.slice(5, 10), 5, 'Presenter script (2 of 3)'));
  page('Presenter script', sc(STEPS.slice(10), 10, 'Presenter script (3 of 3): optional appendices A1 to A5'));
  page('Technical inventory', `<h1>Technical inventory</h1><div class="badges">${rb('signin')}${rb('salesPending')}</div><p class="small">Salesforce Developer Edition lab environment, not production. Salesforce Hosted MCP read context is optional and needs a sign-in.</p><h2>Configured read tool inventory</h2><table class="tbl"><caption class="vh">Configured read functions</caption><thead><tr><th scope="col" style="width:26%">Function</th><th scope="col">Business meaning</th></tr></thead><tbody>${TOOLS.map(t => `<tr><th scope="row" style="text-align:left"><code>${t[0]}</code></th><td>${esc(t[1])}</td></tr>`).join('')}</tbody></table>
    <p class="small muted" style="margin:4px 0">This is what is configured. It does not claim every function was independently retested in this Events phase.</p>
    <h2>Removed from the active allowlist</h2><p class="small"><code>createSobjectRecord</code> and <code>updateSobjectRecord</code>. Task and Opportunity save operations are paused.</p>
    <h2>Sales host</h2><p class="small">The Sales host was last observed with the previous tool set. The refreshed version awaits runtime validation.</p>`);
  page('Questions to agree', `<h1>Business-process questions to agree</h1><p class="small muted">Questions, not decisions. Nothing here means the customer has approved the proposed solution.</p><ol>${DECISIONS.map(d => `<li style="margin-bottom:8px"><strong>${esc(d[0])}.</strong> ${esc(d[1])}</li>`).join('')}</ol>`);
  return pages;
}
function buildPrint() {
  const pages = printPages(), N = pages.length;
  $('#printView').innerHTML = `<div class="print-top"><button class="btn primary" type="button" id="printGo" data-act="doPrint">Print or save as PDF</button><button class="btn" type="button" data-act="closePrint">Back to the wireframe</button><span class="small muted">Landscape A4, one page per section. Sample data only.</span></div>` +
    pages.map((p, i) => `<section class="pp" aria-label="${esc(p.title)}, page ${i + 1} of ${N}"><div class="phead"><span><strong>Meeting Outcome Assistant</strong> · Leave-behind</span><span>Interactive wireframe · Sample data · No live CRM or calendar changes</span></div>${p.inner}<div class="pfoot"><span>Based on the project brief of 4 November 2026. A demonstration, not a production claim.</span><span>Page ${i + 1} of ${N}</span></div></section>`).join('');
}
function showPrint(on) {
  S.ui.print = !!on; document.body.classList.toggle('print-preview', !!on);
  if (on) { buildPrint(); window.scrollTo(0, 0); const b = $('#printGo'); if (b) b.focus(); }
  render();
}

/* ==========================================================================
   Actions
   ========================================================================== */
function announceLast() {
  const m = S.chat.slice().reverse().find(x => x.role === 'assistant'); if (!m) return;
  const parts = [];
  for (const b of m.blocks) { if (b.html) parts.push(stripHtml(b.html)); else if (b.t === 'q') parts.push(stripHtml(b.text)); else if (b.t === 'event') parts.push(`${b.title}, ${STATUS[b.status].t}`); if (parts.join(' ').length > 140) break; }
  if (parts.length) announce(parts.join(' ').slice(0, 320));
}
function say(label, fn) { userSay(label); fn(); }
const ACTIONS = {
  nav(el) { S.route = el.dataset.to; S.ui.drawer = false; },
  goMeeting(el) { S.route = 'meeting'; S.meetingTab = el.dataset.tab || 'capture'; },
  goContext() { S.route = 'events'; S.panelTab = 'customer'; S.ui.drawer = true; },
  goPaused() { S.route = 'capability'; S.capTab = 'paused'; },
  goArch() { S.ui.help = S.ui.tech = false; S.route = 'capability'; S.capTab = 'architecture'; },
  sendText(el) { const d = el.closest('details.plib'); if (d) d.open = false; handleUserText(el.dataset.text); announceLast(); },
  newChat(el) { const d = el.closest('details.plib'); if (d) d.open = false; resetWorkspace(); S.route = 'events'; toast('New chat started. Events, replies and the customer check were cleared.'); announce('New chat started.'); },
  captureSample() { S.route = 'events'; S.notes = NOTES.main; captureFlow('main', DEFAULT_INSTRUCTION); },
  capture() { const n = $('#notesInput'), i = $('#instrInput'); if (n) S.notes = n.value; if (i) S.instruction = i.value; startCaptureFromUI(); return false; },
  loadSample(el) { S.notes = NOTES[el.dataset.kind]; S.capErr = ''; S.captured = false; S.proc = null; S.notesKind = null; },
  loadInject() { S.ui.help = false; S.route = 'meeting'; S.meetingTab = 'capture'; S.notes = NOTES.inject; S.capErr = ''; S.captured = false; S.proc = null; S.notesKind = null; },
  clearNotes() { S.notes = ''; S.capErr = ''; S.captured = false; S.proc = null; S.notesKind = null; },
  mtab(el) { S.meetingTab = el.dataset.tab; },
  capTab(el) { S.capTab = el.dataset.tab; },
  ptab(el) { S.panelTab = el.dataset.tab; },
  evSwitch(el) { S.activeEv = +el.dataset.n; S.ui.edit = null; },
  openEvent(el) { S.route = 'events'; S.activeEv = +el.dataset.n; S.panelTab = el.dataset.tab || 'event'; S.ui.drawer = true; },
  selSent(el) {
    const id = el.dataset.id, k = el.dataset.k || null;
    if (S.selSentence === id && (S.selField || null) === k) { S.selSentence = null; S.selField = null; } else { S.selSentence = id; S.selField = k; }
    if (S.route === 'events' && S.panelTab !== 'evidence' && S.selSentence) { S.panelTab = 'evidence'; S.ui.drawer = true; }
    announce(S.selSentence ? `${id} selected` : 'Selection cleared');
  },
  toggleWide() { S.ui.wide = !S.ui.wide; },
  toggleDrawer() { S.ui.drawer = !S.ui.drawer; if (S.ui.drawer) setTimeout(() => { const h = $('#panelTitle'); if (h) h.focus(); }, 0); else setTimeout(() => { const b = $('#btnDetails'); if (b) b.focus(); }, 0); },
  closeDrawers() { closeDialogs(); return false; },
  openHelp() { openDialog('help'); return false; },
  openTech() { openDialog('tech'); return false; },
  edit(el) { S.ui.edit = { n: +el.dataset.n, k: el.dataset.k }; S.ui.editErr = ''; setTimeout(() => { const i = $('#edit-input'); if (i) i.focus(); }, 0); },
  editCancel() { const k = S.ui.edit && S.ui.edit.k; S.ui.edit = null; S.ui.editErr = ''; setTimeout(() => { const b = $(`[data-fid="edit-${k}"]`); if (b) b.focus(); }, 0); },
  markReviewed(el) { const ev = evByN(el.dataset.n); if (!ev) return; say('Mark reviewed — keep unsaved', () => markReviewed(ev, 'Mark reviewed — keep unsaved')); announceLast(); },
  unreview(el) { const ev = evByN(el.dataset.n); if (!ev) return; ev.reviewed = false; aSay(P(`Review status removed from Event ${ev.n}. It is still unsaved.`), evCard(ev)); },
  revise(el) { const ev = evByN(el.dataset.n); if (!ev) return; say('Revise details', () => { aSay(P('Tell me what to change, or use <strong>Edit</strong> beside a field. Your correction becomes the evidence for that field.'), CHIPS(['Move it to 3 pm and keep it 30 minutes.', 'Add Anika to the proposed attendees.', 'Keep the customer unverified.'])); }); S.activeEv = ev.n; S.panelTab = 'event'; },
  showEvidence(el) { const ev = evByN(el.dataset.n); if (ev) S.activeEv = ev.n; userSay('Show the evidence.'); showEvidence(); announceLast(); },
  discardEv(el) { const ev = evByN(el.dataset.n); if (!ev || ev.discarded) return; say('Discard proposal', () => doDiscard(ev)); announceLast(); },
  restore(el) { restoreEvent(+el.dataset.n); announceLast(); },
  futureBtn(el) { const m = `${el.dataset.what}: Future scope — unavailable in this phase. Nothing was saved or sent.`; toast(m); announce(m); return false; },
  pausedWhy(el) { S.ui.pausedWhy = el.dataset.what; setTimeout(() => { const r = $('#pausedReason'); if (r) r.focus(); }, 0); announce('Unavailable. Task fixes are pending and nothing was created.'); },
  lk(el) { lkAction(el.dataset.a, el.dataset.id); announceLast(); },
  setOutcome(el) { S.lookup.outcome = el.value; },
  simLink() { toast('Simulated link. This wireframe does not open records.'); return false; },
  reset() {
    stopAll(); resetWorkspace(); S.route = 'home'; closeAllFloating(); S.presenter.step = 1; S.presenter.sub = 0; S.presenter.prev = null;
    render(); toast('Demo reset to the starting sample state.'); announce('Demo reset to the starting sample state.'); const m = $('#pgtitle'); if (m) m.focus({ preventScroll: true }); return false;
  },
  togglePresenter() { if (S.presenter.on) { setAuto(false); S.presenter.on = false; S.ui.notesPanel = false; if (NOTES_WIN && !NOTES_WIN.closed) NOTES_WIN.close(); NOTES_WIN = null; } else { goStep(S.presenter.step || 1); return false; } },
  pdNext() { pdNext(); return false; }, pdBack() { pdBack(); return false; },
  pdGo(el) { goStep(+el.dataset.n); return false; },
  pdVar(el) { setVariant(+el.dataset.i); return false; },
  pdCtx() { S.presenter.ctxHide = !S.presenter.ctxHide; announce(S.presenter.ctxHide ? 'Step context hidden.' : 'Step context shown.'); },
  pdAuto() { setAuto(!S.presenter.auto); },
  toggleNotes() { toggleNotes(); return false; },
  fullscreen() { toggleFullscreen(); return false; },
  startGuided() { S.ui.start = false; goStep(1); const b = $('#pd-next'); if (b) b.focus(); return false; },
  startExplore() { S.ui.start = false; S.route = 'home'; setTimeout(() => { const h = $('#pgtitle'); if (h) h.focus(); }, 0); },
  startCapability() { S.ui.start = false; S.route = 'capability'; S.capTab = 'overview'; setTimeout(() => { const h = $('#pgtitle'); if (h) h.focus(); }, 0); },
  openPrint() { S.ui.help = S.ui.tech = false; showPrint(true); return false; },
  closePrint() { showPrint(false); return false; },
  doPrint() { window.print(); return false; },
  toggleTips() { setTips(!TIPS_ON); announce(TIPS_ON ? 'Guide tips on. Hover over or tab to a control for a short explanation.' : 'Guide tips off.'); return false; }
};
function stopAll() { setAuto(false); }
function closeAllFloating() { S.ui.notesPanel = false; if (NOTES_WIN && !NOTES_WIN.closed) { try { NOTES_WIN.close(); } catch (e) { /* ignore */ } } NOTES_WIN = null; S.ui.print = false; document.body.classList.remove('print-preview'); S.presenter.on = false; }

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.disabled) return;
  const fn = ACTIONS[el.dataset.act]; if (!fn) return;
  if (el.tagName === 'A') e.preventDefault();
  const r = fn(el, e);
  if (r !== false) render();
});
document.addEventListener('submit', e => {
  const f = e.target; e.preventDefault();
  if (f.id === 'cform') {
    const i = $('#msgInput'), v = i.value.trim(); if (!v) return;
    i.value = ''; handleUserText(v); render(); announceLast(); i.focus();
  } else if (f.dataset.form === 'edit') {
    const ev = evByN(f.dataset.n), k = f.dataset.k; if (!ev) return;
    const val = f.elements.val.value, keep = f.elements.keep ? f.elements.keep.checked : false;
    const res = applyFieldEdit(ev, k, val, keep);
    if (res.err) { S.ui.editErr = res.err; render(); const i = $('#edit-input'); if (i) i.focus(); return; }
    S.ui.edit = null; S.ui.editErr = ''; S.activeEv = ev.n; S.panelTab = 'changes'; render(); announceLast();
    setTimeout(() => { const b = $(`[data-fid="edit-${k}"]`); if (b) b.focus(); }, 0);
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'notesInput') { S.notes = e.target.value; if (S.capErr) { S.capErr = ''; const c = $('#capErr'); if (c) c.remove(); } }
  else if (e.target.id === 'instrInput') S.instruction = e.target.value;
});
document.addEventListener('change', e => {
  if (e.target.id === 'scenSel') {
    const v = e.target.value; if (!v) return;
    setAuto(false); const wasOn = S.presenter.on; loadScenario(v); S.ui.start = false; S.presenter.on = wasOn;
    render(); announce(`Scenario loaded: ${SCEN_NAMES[v] || v}`);
  }
});

/* The demo prompts menu opens as a popover under its button and is kept on screen. */
function placePlib() {
  const sm = $('#plibSum'), pn = $('.plib-panel'); if (!sm || !pn) return;
  const r = sm.getBoundingClientRect(), w = Math.min(560, innerWidth - 16);
  pn.style.width = w + 'px';
  pn.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
  pn.style.top = (r.bottom + 6) + 'px';
  pn.style.maxHeight = Math.max(200, innerHeight - r.bottom - 22) + 'px';
}
document.addEventListener('toggle', e => { if (e.target && e.target.id === 'plib' && e.target.open) placePlib(); }, true);
addEventListener('resize', () => { const d = $('#plib'); if (d && d.open) placePlib(); });
document.addEventListener('click', e => { const d = $('#plib'); if (d && d.open && !d.contains(e.target)) d.open = false; });

/* keyboard: tabs, dialogs, presenter keys */
document.addEventListener('keydown', e => {
  const t = e.target;
  if (e.key === 'Escape') {
    const pl = $('#plib'); if (pl && pl.open) { pl.open = false; const sm = $('#plibSum'); if (sm) sm.focus(); return; }
    if (S.ui.notesPanel) { S.ui.notesPanel = false; render(); const b = $('#pd-notes'); if (b) b.focus(); return; }
    if (S.ui.help || S.ui.tech) { closeDialogs(); return; }
    if (S.ui.print) { showPrint(false); return; }
    if (S.ui.start) { ACTIONS.startExplore(); render(); return; }
    if (S.ui.edit) { ACTIONS.editCancel(); render(); return; }
    if (S.route === 'events' && S.ui.drawer && matchMedia('(max-width:1180px)').matches) { S.ui.drawer = false; render(); const b = $('#btnDetails'); if (b) b.focus(); return; }
    return;
  }
  if (e.key === 'Tab') {
    const box = S.ui.start ? $('#startOverlay') : S.ui.help ? $('#helpDrawer') : S.ui.tech ? $('#techDrawer') : null;
    if (box) {
      const f = focusables(box); if (!f.length) return;
      if (!box.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); return; }
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
    return;
  }
  if (t.matches && t.matches('[role="tab"]') && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    const list = t.closest('[role="tablist"]'), tabs = $$('[role="tab"]', list), i = tabs.indexOf(t);
    const j = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    e.preventDefault(); const id = tabs[j].id; tabs[j].click(); const n = document.getElementById(id); if (n) n.focus(); return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (t.matches && t.matches('input,textarea,select,[contenteditable="true"]')) return;
  if (!S.presenter.on || S.ui.start || S.ui.help || S.ui.tech || S.ui.print) return;
  const k = e.key;
  if (k === 'PageDown' || (k === 'ArrowRight' && !(t.matches && t.matches('[role="tab"]')))) { e.preventDefault(); pdNext(); }
  else if (k === 'PageUp' || (k === 'ArrowLeft' && !(t.matches && t.matches('[role="tab"]')))) { e.preventDefault(); pdBack(); }
  else if (k === 'p' || k === 'P') { e.preventDefault(); setAuto(!S.presenter.auto); render(); announce(S.presenter.auto ? 'Auto-play on' : 'Auto-play off'); }
  else if (k === 'n' || k === 'N') { e.preventDefault(); toggleNotes(); }
  else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFullscreen(); }
});
window.addEventListener('beforeprint', () => { if (!$('#printView').children.length) buildPrint(); });
window.addEventListener('resize', () => { if (S.route === 'events' && !matchMedia('(max-width:1180px)').matches && S.ui.drawer) { S.ui.drawer = false; render(); } });

/* ==========================================================================
   Deep links (hash) and start-up
   ========================================================================== */
let LAST_HASH = null;
function currentHash() {
  if (S.ui.print) return '#print';
  if (S.presenter.on) return '#step=' + S.presenter.step;
  if (S.route === 'capability') return '#capability/' + S.capTab;
  return '#' + S.route;
}
function syncHash() {
  if (S.ui.start) return;
  const h = currentHash(); if (h === LAST_HASH) return;
  LAST_HASH = h; try { history.replaceState(null, '', h); } catch (e) { /* file or sandboxed frame */ }
}
function applyHash(initial) {
  const raw = decodeURIComponent((location.hash || '').replace(/^#\/?/, ''));
  if (!raw) { if (initial) S.ui.start = true; return; }
  let m;
  S.ui.start = false;
  if (raw === 'print') { showPrint(true); return; }
  if ((m = raw.match(/^step=(\d+)$/))) { goStep(+m[1]); return; }
  if ((m = raw.match(/^scenario=([A-Za-z0-9]+)$/)) && (SCEN_NAMES[m[1]])) { loadScenario(m[1]); return; }
  m = raw.split('/');
  if (['home', 'meeting', 'events', 'capability'].includes(m[0])) { S.route = m[0]; if (m[0] === 'capability' && CAP_TABS.some(t => t[0] === m[1])) S.capTab = m[1]; return; }
  if (initial) S.ui.start = true;
}
window.addEventListener('hashchange', () => {
  const h = location.hash; if (h === LAST_HASH) return;
  if (S.ui.print && h !== '#print') showPrint(false);
  setAuto(false); const wasPrint = S.ui.print; applyHash(false);
  if (!S.ui.print && !wasPrint) render();
});
function init() {
  $('#waffle').innerHTML = ic('waffle', 'waffle'); $('#bannerIcon').innerHTML = ic('info');
  applyHash(true);
  render();
  if (S.ui.start) { const b = $('#startGuided'); if (b) b.focus(); }
}
init();

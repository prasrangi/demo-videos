
/* ==========================================================================
   Salesforce chapter and the final sales demo prompts.
   Reads (overview, contacts, open opportunities, one opportunity) use fixed sample
   data after a simulated sign-in. Task, NextStep, Note and Event saving are NOT
   performed: Task and NextStep are paused, note and Event saving are future scope,
   so those prompts get an honest "requested, not created" reply.
   ========================================================================== */
const SF_PROMPTS = [
  { n: 1, group: 'sf', title: 'Customer overview', tag: 'signin', goal: 'Retrieve customer information from Salesforce.', text: 'Give me a quick overview of Atlas Metals Group, including its industry and website.' },
  { n: 2, group: 'sf', title: 'Customer contacts', tag: 'signin', goal: 'Find the customer’s contacts and their roles.', text: 'Show me the contacts for Atlas Metals Group and their job titles.' },
  { n: 3, group: 'sf', title: 'Open opportunities', tag: 'signin', goal: 'Retrieve the customer’s active sales opportunities.', text: 'Show me the open opportunities for Atlas Metals Group, including their stages and close dates.' },
  { n: 4, group: 'sf', title: 'Select the demo opportunity', tag: 'signin', goal: 'Establish the correct opportunity for Task creation and NextStep updates.', text: 'Find the Salesforce opportunity called “MOA POC TEST - Meeting Outcome 2026-11-03”. Show its current next step. Use this opportunity for the follow-up task and next-step updates in this chat.' },
  { n: 5, group: 'sf', title: 'Analyse meeting notes', tag: 'unsaved', goal: 'Turn meeting notes into decisions, risks and follow-up actions without saving changes.', text: 'Here are my demo meeting notes from 4 November 2026:\n\nWe met with Elena Schmidt, Mateo Murphy and Anika Wilson from Atlas Metals Group. We agreed to review the updated technical scope with Elena and Mateo by 6 November 2026. I, Prashant Rangi, will prepare the updated scope. Anika will confirm the commercial requirements. Plant access is still unconfirmed. No pricing or close-date changes were agreed.\n\nSummarise the decisions, risks and follow-up actions. Include owners and deadlines where provided. Don’t save anything yet.' },
  { n: 6, group: 'sf', title: 'Save the meeting notes', tag: 'future', goal: 'Save the meeting summary as a Salesforce note linked to the customer account.', text: 'Prepare a Salesforce note from the meeting notes above, titled “Technical Scope Review — 4 November 2026”, linked to the Atlas Metals Group account.\n\nOrganise it into decisions, risks and follow-up actions. Include owners and deadlines where provided.\n\nShow me the note and the account it will be linked to before saving. After I confirm, save it as a Salesforce note and give me its link.\n\nKeep other Salesforce records and fields unchanged. If saving notes is unavailable, let me know.' },
  { n: 7, group: 'sf', title: 'Create a follow-up Task', tag: 'paused', goal: 'Create a Salesforce Task linked to the selected demo opportunity.', text: 'Create a task for me called “MOA POC TEST - Review updated scope with Elena Schmidt”, due 6 November 2026, linked to this opportunity. The task is to review the updated technical scope with Elena and Mateo and capture any remaining questions.' },
  { n: 8, group: 'sf', title: 'Verify the saved Task', tag: 'paused', goal: 'Confirm that the Task exists in Salesforce with the requested details.', text: 'Check Salesforce and show me the task we just created, including its due date, status and related opportunity.' },
  { n: 9, group: 'sf', title: 'Update the next step', tag: 'paused', goal: 'Save the agreed follow-up plan in the opportunity’s NextStep field.', text: 'Update this opportunity’s next step to “Review the updated scope with Elena Schmidt and Mateo Murphy by 6 November 2026, then confirm the commercial requirements with Anika Wilson.” Leave the other opportunity details unchanged.' },
  { n: 10, group: 'sf', title: 'Verify the opportunity update', tag: 'signin', goal: 'Read back the saved next step and confirm that the stage and close date remain unchanged.', text: 'Check Salesforce and show this opportunity’s current next step, stage and close date.' },
  { n: 11, group: 'ev', title: 'Capture two meeting proposals', tag: 'unsaved', goal: 'Prepare two separate meeting drafts from natural-language instructions.', text: 'Draft two meetings for Atlas Metals Group:\n\nA technical scope review with Elena Schmidt and Mateo Murphy on 10 November 2026 at 10 am for 30 minutes.\n\nA commercial review with Anika Wilson on 11 November 2026 at 2 pm for 45 minutes.\n\nBoth meetings are in India time, on Microsoft Teams, and I, Prashant Rangi, will organise them. Keep both unsaved and don’t send invitations.' },
  { n: 12, group: 'ev', title: 'Review the evidence', tag: 'unsaved', goal: 'Identify the source of each proposed meeting detail and flag missing information.', text: 'For each meeting, show which details came from my instructions and which, if any, came from Salesforce. Flag anything missing or assumed.' },
  { n: 13, group: 'ev', title: 'Change only one meeting', tag: 'unsaved', goal: 'Update the technical review while preserving the commercial review.', text: 'Move only the technical scope review to 3 pm, still for 30 minutes. Leave the commercial review unchanged. Keep both unsaved.' },
  { n: 14, group: 'ev', title: 'Discard one proposal', tag: 'unsaved', goal: 'Remove the commercial review from the conversational drafts without deleting any calendar or CRM record.', text: 'Discard the unsaved commercial review draft. Keep the technical scope review draft.' },
  { n: 15, group: 'ev', title: 'Complete the unsaved review', tag: 'unsaved', goal: 'Accept the remaining proposal for review without creating an Event or sending invitations.', text: 'The technical scope review looks good. Mark it as reviewed and show the final details with their sources. Keep it unsaved—don’t create a calendar event or send invitations.' },
  { n: 16, group: 'ev', title: 'Save the reviewed meeting', tag: 'future', goal: 'Create a Salesforce Event from the reviewed technical scope meeting.', text: 'Save only the technical scope review in Salesforce using its latest reviewed details: 10 November 2026, from 3 pm to 3:30 pm India time, with Elena Schmidt and Mateo Murphy, organised by Prashant Rangi.\n\nShow me the customer, attendees, date, time and timezone for confirmation before saving. After I confirm, create the Salesforce Event and give me its record link.\n\nDo not send invitations. If saving Salesforce Events is unavailable, let me know.' }
];
const SF_TAGS = { signin: 'Read-only · sign-in', unsaved: 'Nothing saved', paused: 'Paused', future: 'Future scope' };
const sfPrompt = n => SF_PROMPTS[n - 1];
const sfSendBtn = n => ({ label: sfPrompt(n).title, act: 'sendText', text: sfPrompt(n).text });

/* ---------- the demo notes behind prompts 5 and 6 (sentence labels come from NOTES.summary) ---------- */
const sfQ = id => esc(sentText('summary', id));
function sfAnalysisBlocks() {
  const src = id => `<span class="muted">(${id})</span>`;
  return [
    P('<strong>Decisions</strong>'),
    LIST([`Review the updated technical scope with Elena and Mateo by <strong>6 November 2026</strong>. ${src('S2')}`, `No pricing or close-date changes were agreed. ${src('S6')}`]),
    P('<strong>Risks and open items</strong>'),
    LIST([`Plant access is still unconfirmed. Owner: <em>Not provided</em> · Deadline: <em>Not provided</em>. ${src('S5')}`]),
    P('<strong>Follow-up actions</strong>'),
    LIST([
      `Review the updated technical scope. Owner: you, with Elena Schmidt and Mateo Murphy (“we”). Deadline: <strong>6 November 2026</strong>. ${src('S2')}`,
      `Prepare the updated scope. Owner: <strong>Prashant Rangi</strong>. Deadline: <em>Not provided</em>. ${src('S3')}`,
      `Confirm the commercial requirements. Owner: <strong>Anika Wilson</strong>. Deadline: <em>Not provided</em>. ${src('S4')}`
    ])
  ];
}
function sfAnalyse(T) {
  if (!/Elena Schmidt/.test(T) || !/plant access/i.test(T)) {
    aSay(P('This wireframe can only analyse the <strong>demo meeting notes from the prompt list</strong>, because every result is simulated. I did not summarise anything.'), ACT([Object.assign(sfSendBtn(5), { primary: true, label: 'Use the demo meeting notes' })]));
    return;
  }
  S.sf.analysed = true;
  aSay(P('Here is the summary of your notes from <strong>4 November 2026</strong>. <span class="muted small">S1 to S6 are the sentence numbers in your notes. They only exist in this conversation.</span>'),
    ...sfAnalysisBlocks(),
    P(`<span class="muted small">Attendees named: Elena Schmidt, Mateo Murphy and Anika Wilson, from Atlas Metals Group (S1). Owners and deadlines the notes did not give are shown as Not provided, not guessed.</span>`),
    NOTICE('info', `<strong>Nothing was saved.</strong> No Note, Task, Event or opportunity change was created or requested. The notes give a deadline but no meeting time, so I did not propose a calendar Event.`),
    ACT([Object.assign(sfSendBtn(6), { label: 'Prepare a Salesforce note from this' })]));
}
function sfNotePreview(T) {
  if (!S.sf.analysed) {
    aSay(P('I don’t have any meeting notes in this chat yet, so there is nothing to build the note from. Share the notes first and I will summarise them.'), ACT([Object.assign(sfSendBtn(5), { primary: true, label: 'Use the demo meeting notes' })]));
    return;
  }
  const title = (T.match(/titled\s+"([^"]+)"/i) || [])[1] || 'Technical Scope Review — 4 November 2026';
  const verified = lookupVerifiedName() === LOOKUP.account.name;
  aSay(P('Here is the <strong>note preview</strong> and the account it would be linked to. Nothing is saved.'),
    P(`<strong>Title:</strong> ${esc(title)}`),
    P(`<strong>Linked account:</strong> Atlas Metals Group · ${verified ? 'Verified CRM · Simulated result' : 'CRM-unverified (no Salesforce check has run in this chat)'}`),
    ...sfAnalysisBlocks(),
    NOTICE('gray', `<strong>I can’t save this note.</strong> ${rb('future')} Saving a Salesforce note has not yet been validated in the agent, so this wireframe does not do it. No note was created and there is no note link to give. Other Salesforce records and fields are unchanged.`),
    ACT([{ label: 'Save as Salesforce note', act: 'futureBtn', what: 'Save as Salesforce note', 'aria-disabled': 'true' }]));
  S.panelTab = 'customer';
}

/* ---------- routing ---------- */
const SFRE = {
  noteSave: /\bsalesforce note\b/i,
  taskCreate: /\b(?:create|add|make|set up|log)\b[^.]*\btask\b/i,
  selectOpp: /\bMOA POC TEST\b/i,
  nextUpdate: /\b(?:update|set|change|replace|edit)\b[^.]*\bnext[\s-]?step\b/i,
  verifyTask: /\b(?:check|show|find|verify|confirm|read)\b[^.]*\btasks?\b/i,
  opps: /\bopen opportunit(?:y|ies)\b|\bopportunities\b/i,
  readOpp: /\b(?:check|show|read|get|what(?:'s| is)?|current)\b[^.]*\b(?:next[\s-]?step|close date|stage)\b/i,
  contacts: /\bcontacts?\b/i,
  overview: /\boverview\b|\bindustry\b|\bwebsite\b/i,
  analyse: /\b(?:summari[sz]e|analy[sz]e)\b[^.]*\b(?:decisions?|risks?|actions?)\b/i
};
function sfRoute(text, T) {
  if (SFRE.noteSave.test(T)) { sfNotePreview(T); return true; }
  if (affirmed(T, RE.saveSf)) { handleSaveEvent(text); return true; }
  if (SFRE.taskCreate.test(T)) { sfTaskCreate(T); return true; }
  if (SFRE.selectOpp.test(T)) { sfRead('selectOpp', T); return true; }
  if (SFRE.nextUpdate.test(T)) { sfNextStepUpdate(T); return true; }
  if (SFRE.verifyTask.test(T)) { sfRead('verifyTask', T); return true; }
  if (SFRE.opps.test(T)) { sfRead('opps', T); return true; }
  if (SFRE.readOpp.test(T)) { sfRead('readOpp', T); return true; }
  if (SFRE.contacts.test(T)) { sfRead('contacts', T); return true; }
  if (SFRE.overview.test(T)) { sfRead('overview', T); return true; }
  if (SFRE.analyse.test(T)) { sfAnalyse(T); return true; }
  return false;
}

/* ---------- reads need a verified Account, so they follow the simulated customer check ---------- */
function sfRead(key, T) {
  if (lookupVerifiedName()) { sfAnswer(key, T); return; }
  S.sf.pending = { key, text: T };
  runLookup();
}
function sfContinue() {
  const p = S.sf.pending; if (!p) return;
  S.sf.pending = null;
  sfAnswer(p.key, p.text);
}
function sfAnswer(key, T) {
  const acct = lookupVerifiedName();
  if (acct !== LOOKUP.account.name) {
    aSay(P(`This wireframe only has sample details for <strong>${esc(LOOKUP.account.name)}</strong>. You selected ${esc(acct)}, so I did not read anything for it.`));
    return;
  }
  SFH[key](T);
}
const sfFoot = () => P(`<span class="muted small">${rb('signin')} Read-only · simulated sample values · nothing was changed in Salesforce.</span>`);
const selectedOpp = () => LOOKUP.opps.find(o => o.id === S.sf.selectedOpp) || null;
const SFH = {
  overview() {
    const a = LOOKUP.account; S.panelTab = 'customer';
    aSay(P(`Here is a quick overview of <strong>${esc(a.name)}</strong>. ${bb('crm')}`),
      LIST([`<strong>Industry:</strong> ${esc(a.industry)} <span class="muted">(sample)</span>`, `<strong>Website:</strong> ${esc(a.website)} <span class="muted">(sample)</span>`, '<strong>Account type:</strong> Customer <span class="muted">(sample)</span>', '<strong>Account owner:</strong> Demo account owner <span class="muted">(sample)</span>']),
      P('<span class="muted small">The account owner is not the meeting organizer.</span>'), sfFoot());
  },
  contacts() {
    S.lookup.contacts = true; S.panelTab = 'customer';
    aSay(P('Here are the contacts for <strong>Atlas Metals Group</strong>. These are <strong>limited sample results</strong> (up to 5), not a complete contact list.'),
      LIST(LOOKUP.contacts.map(c => `<strong>${esc(c.name)}</strong> · ${esc(c.title)} <span class="muted">(sample job title)</span> · CRM role: ${esc(c.role)} <span class="muted">(sample)</span>`)),
      NOTICE('info', 'A CRM contact role does not make someone an attendee. Attendees stay the names you or your notes supplied.'), sfFoot());
  },
  opps() {
    S.lookup.opps = true; S.panelTab = 'customer';
    aSay(P('Here are the open opportunities for <strong>Atlas Metals Group</strong>. These are <strong>limited sample results</strong> (up to 5). This is not a complete pipeline, and no total is implied.'),
      LIST(LOOKUP.opps.map(o => `<strong>${esc(o.name)}</strong> · Stage: ${esc(o.stage)} · Close date: ${esc(o.close)}${o.demo ? ' <span class="tag">Demo opportunity</span>' : ''}`)),
      NOTICE('info', 'Nothing is attached to an Event. Related opportunity stays Not provided unless you add one.'), sfFoot());
  },
  selectOpp(T) {
    const o = LOOKUP.opps.find(x => x.demo);
    if (!/MOA POC TEST\s*[-–—]\s*Meeting Outcome\s*2026-11-03/i.test(T)) {
      aSay(P('I could not find an opportunity with that name in the sample data. The only demo opportunity here is:'), LIST([esc(o.name)]), sfFoot());
      return;
    }
    S.sf.selectedOpp = o.id; S.lookup.opps = true; S.panelTab = 'customer';
    aSay(P('I found <strong>one opportunity</strong> with that name.'),
      LIST([`<strong>Name:</strong> ${esc(o.name)}`, '<strong>Account:</strong> Atlas Metals Group', `<strong>Stage:</strong> ${esc(o.stage)}`, `<strong>Close date:</strong> ${esc(o.close)}`, `<strong>Current next step:</strong> ${esc(o.next)} <span class="muted">(sample)</span>`]),
      NOTICE('info', `<strong>Selected for this chat.</strong> The follow-up Task and the next-step update would both use this opportunity. ${rb('paused')} Both are paused in this phase, so neither will run. It is not attached to any Event: Related opportunity stays Not provided unless you add one.`), sfFoot());
  },
  verifyTask() {
    const req = S.sf.taskReq, o = selectedOpp();
    aSay(NOTICE('warn', `<strong>There is no Task to show.</strong> Task creation is paused in this phase, so no Task was created${req ? ' from your earlier request' : ' in this chat'}. There is no due date, status or related opportunity to read back.`),
      req ? P(`What you asked for is still <strong>not created</strong>: “${esc(req.subject)}”, due ${esc(req.due || 'Not provided')}${o ? ', for ' + esc(o.name) : ''}.`) : null,
      P(`<span class="muted small">${rb('paused')}</span>`), sfFoot());
  },
  readOpp() {
    const o = selectedOpp();
    if (!o) {
      aSay(P('No opportunity is selected in this chat yet, so I don’t know which one you mean. Select the demo opportunity first, then ask again.'), ACT([Object.assign(sfSendBtn(4), { primary: true, label: 'Select the demo opportunity' })]));
      return;
    }
    const asked = S.sf.nextReq;
    S.lookup.opps = true; S.panelTab = 'customer';
    aSay(P(`Here is the current state of <strong>${esc(o.name)}</strong>:`),
      LIST([`<strong>Current next step:</strong> ${esc(o.next)} <span class="muted">(sample)</span>`, `<strong>Stage:</strong> ${esc(o.stage)}`, `<strong>Close date:</strong> ${esc(o.close)}`]),
      asked ? NOTICE('warn', `<strong>The next step is unchanged.</strong> You asked me to update it, but next-step updates are paused in this phase, so “${esc(asked)}” was not saved. Stage and close date are unchanged too.`)
        : NOTICE('info', 'Nothing in this wireframe writes to Salesforce, so the stage, close date and next step are as they were when the opportunity was selected.'),
      sfFoot());
  }
};

/* ---------- Task and NextStep: paused, so these are requests that were not carried out ---------- */
function sfTaskCreate(T) {
  const subj = (T.match(/called\s+"([^"]+)"/i) || T.match(/"([^"]+)"/) || [])[1] || 'Not provided';
  const due = parseDateText(T), details = (T.match(/\bthe task is to\s+([^.]+)\./i) || [])[1] || null, o = selectedOpp();
  S.sf.taskReq = { subject: subj, due: due ? fmtDate(due) : null, details };
  aSay(NOTICE('warn', `<strong>I did not create this Task.</strong> ${rb('paused')} Task creation was shown in earlier demos and is paused in this phase, because the custom mutation tools are removed from the active allowlist while repairs are pending.`),
    P('This is what you asked for. Nothing was sent to Salesforce:'),
    LIST([`<strong>Subject:</strong> ${esc(subj)}`, `<strong>Due date:</strong> ${due ? esc(fmtDate(due)) : 'Not provided'}`, `<strong>Related to:</strong> ${o ? esc(o.name) : 'Not selected. No opportunity has been chosen in this chat.'}`, `<strong>Details:</strong> ${esc(details || 'Not provided')}`, '<strong>Status:</strong> Requested, not created. There is no Task ID or record link.']),
    o ? null : ACT([Object.assign(sfSendBtn(4), { label: 'Select the demo opportunity' })]));
}
function sfNextStepUpdate(T) {
  const val = (T.match(/next[\s-]?step to\s+"([^"]+)"/i) || [])[1] || null, o = selectedOpp();
  S.sf.nextReq = val;
  aSay(NOTICE('warn', `<strong>I did not update the next step.</strong> ${rb('paused')} The opportunity NextStep update was shown in earlier demos and is paused in this phase, so nothing was written to Salesforce.`),
    P('This is the change you asked for:'),
    LIST([`<strong>Opportunity:</strong> ${o ? esc(o.name) : 'Not selected. No opportunity has been chosen in this chat.'}`, `<strong>Requested next step:</strong> ${val ? '“' + esc(val) + '”' : 'Not provided'}`, o ? `<strong>Current next step:</strong> ${esc(o.next)} <span class="muted">(sample)</span>` : null, '<strong>Other details:</strong> stage, close date and every other field are unchanged.', '<strong>Status:</strong> Requested, not updated.'].filter(Boolean)),
    o ? null : ACT([Object.assign(sfSendBtn(4), { label: 'Select the demo opportunity' })]));
}

/* ---------- saving a reviewed meeting (prompt 16): a boundary reply with the details that would be confirmed ---------- */
DO.saveEvent = (e, a, t) => saveEventPreview(e, (a && a.text) || t);
function handleSaveEvent(text) {
  const evs = liveEvents();
  if (!evs.length) {
    aSay(P('There is no Event proposal to save yet. Draft and review one first.'), NOTICE('gray', `${rb('future')} Saving to Salesforce is not available in this phase in any case. Nothing was created.`), CHIPS(promptSuggestions()));
    return;
  }
  const e = pickEvent(text, evs);
  if (!e) { askWhich('saveEvent', { text }, 'Which proposal should I prepare for saving?'); return; }
  saveEventPreview(e, text);
}
function saveEventPreview(ev, text) {
  const T = nq(text), st = statusOf(ev);
  S.activeEv = ev.n; S.panelTab = 'review';
  const rd = parseDateText(T), rr = parseRange(T), pm = T.match(PEOPLE_RE), om = T.match(/organi[sz]ed by\s+([A-Z][a-zA-Z'-]+(?:\s+[A-Z][a-zA-Z'-]+)*)/);
  const diffs = [];
  if (rd && ev.num.d != null && (rd.d !== ev.num.d || rd.m !== ev.num.m)) diffs.push(`date: you wrote ${fmtDate(rd)}, the proposal says ${fmtDate(ev.num)}`);
  if (rr && ev.num.start != null && (rr.start !== ev.num.start || (ev.num.end != null && rr.end !== ev.num.end))) diffs.push(`time: you wrote ${fmtRange(rr.start, rr.end)}, the proposal says ${ev.num.end != null ? fmtRange(ev.num.start, ev.num.end) : fmtTime(ev.num.start)}`);
  if (pm) {
    const asked = splitNames(pm[1]).map(n => n.toLowerCase()), have = ev.people.map(n => n.toLowerCase());
    if (asked.join('|') !== have.join('|')) diffs.push(`attendees: you wrote ${splitNames(pm[1]).join(', ')}, the proposal says ${ev.people.join(', ') || 'none'}`);
  }
  if (om && ev.f.organizer.v && !/^You \(/.test(ev.f.organizer.v) && ev.f.organizer.v.toLowerCase() !== om[1].toLowerCase()) diffs.push(`organizer: you wrote ${om[1]}, the proposal says ${ev.f.organizer.v}`);
  const when = ev.num.start != null ? (ev.num.end != null && ev.num.end > ev.num.start ? fmtRange(ev.num.start, ev.num.end) : fmtTime(ev.num.start)) : null;
  const rows = [
    ['Customer', ev.f.customer.v ? `${ev.f.customer.v} · ${VERIF_TEXT[ev.verif]}` : 'Not provided'],
    ['Attendees', ev.people.length ? `${ev.people.join(', ')} (names only, no email addresses resolved)` : 'Not provided'],
    ['Date', ev.num.d != null ? fmtDate(ev.num) : 'Not provided'],
    ['Time', when || 'Not provided'],
    ['Timezone', ev.f.tz.v || 'Not provided'],
    ['Organizer', ev.f.organizer.v || 'Not provided'],
    ['Invitations', 'Not sent']
  ];
  aSay(NOTICE('gray', `<strong>I can’t save this to Salesforce.</strong> ${rb('future')} Creating a Salesforce Event needs to be enabled and tested first, and this phase is capture and review only. No Event was created, there is no record link to give, and no invitation was sent.`),
    P(`These are the latest details of <strong>${esc(evLabel(ev))}</strong>, so you can see what a confirmation would show. This is a preview, not a confirmation card:`),
    LIST(rows.map(([l, v]) => `<strong>${l}:</strong> ${esc(v)}`)),
    diffs.length ? NOTICE('warn', `<strong>Your request and the proposal differ.</strong> ${diffs.map(esc).join('; ')}. I have not changed the proposal.`) : null,
    st !== 'reviewed' ? P(`<span class="muted small">This proposal is “${esc(STATUS[st].t)}”, not yet marked Reviewed — unsaved.</span>`) : null,
    ACT([{ label: 'Save to Salesforce', act: 'futureBtn', what: 'Save to Salesforce', 'aria-disabled': 'true' }, { label: 'Show evidence', act: 'showEvidence', n: ev.n }]));
}

/* ---------- provenance (prompt 12) and final details with sources (prompt 15) ---------- */
function showProvenance() {
  const evs = liveEvents();
  if (!evs.length) { aSay(...noEventBlocks()); return; }
  S.panelTab = 'evidence'; S.ui.drawer = true;
  const skip = new Set(['note']);
  const blocks = [P('Here is where each proposed detail came from. The quotes are in the Evidence tab.')];
  let anyCrm = false;
  evs.forEach(ev => {
    const groups = { user: [], derived: [], ai: [], crm: [], missing: [] };
    FIELDS.forEach(([k, l]) => {
      if (skip.has(k)) return;
      const x = ev.f[k];
      if (!x.v && k !== 'participants') { if (['location', 'organizer', 'customer', 'opportunity'].includes(k)) groups.missing.push(l); return; }
      if (k === 'participants' && !ev.people.length) { groups.missing.push(l); return; }
      (groups[x.basis] || groups.user).push(l);
    });
    if (groups.crm.length) anyCrm = true;
    const items = [
      groups.user.length ? `<strong>From your instructions:</strong> ${esc(joinAnd(groups.user))}` : null,
      groups.derived.length ? `<strong>Worked out from your instructions:</strong> ${groups.derived.map(l => { const k = FIELDS.find(f => f[1] === l)[0]; return `${esc(l)} <span class="muted">(${esc(ev.f[k].calc || 'derived')})</span>`; }).join('; ')}` : null,
      groups.ai.length ? `<strong>Composed by the assistant (assumed wording):</strong> ${esc(joinAnd(groups.ai))}. Edit it if you prefer other wording.` : null,
      `<strong>From Salesforce:</strong> ${groups.crm.length ? esc(joinAnd(groups.crm)) + ' (Verified CRM · Simulated result)' : 'Nothing. No customer check has been used for this proposal' + (ev.f.customer.v ? `, so the customer ${esc(ev.f.customer.v)} is CRM-unverified.` : '.')}`,
      `<strong>Missing:</strong> ${groups.missing.length ? esc(joinAnd(groups.missing)) + '. Not guessed.' : 'nothing required.'}`
    ].filter(Boolean);
    blocks.push(P(`<strong>${esc(evLabel(ev))}</strong>`), LIST(items));
  });
  const tzDerived = evs.some(e => e.f.tz.basis === 'derived');
  blocks.push(NOTICE('info', `<strong>Assumed:</strong> nothing was guessed. ${tzDerived ? 'The timezone was worked out from your own words, not from your profile. ' : ''}No attendee email address or meeting link was created. ${anyCrm ? '' : 'Salesforce was not searched for these proposals.'}`));
  aSay(...blocks);
}
function finalDetailsBlocks(ev) {
  const rows = FIELDS.filter(([k]) => k !== 'note').map(([k, l]) => {
    const x = ev.f[k], v = dispV(ev, k);
    if (!v) return `<strong>${esc(l)}:</strong> <em>Not provided</em>`;
    const srcs = (x.src || []).map(srcLabel).join(', '), cut = z => z.length > 80 ? z.slice(0, 77).replace(/\s+\S*$/, '') + '…' : z, q = x.calc ? cut(x.calc) : x.quote ? `“${cut(x.quote)}”` : '';
    return `<strong>${esc(l)}:</strong> ${esc(v)} <span class="muted">· ${esc(BASIS[x.basis].text)}${srcs ? ' · ' + esc(srcs) : ''}${q ? ' · ' + esc(q) : ''}</span>`;
  });
  return [P(`<strong>Final details with their sources</strong> (${esc(evLabel(ev))}, revision ${ev.rev}):`), LIST(rows)];
}

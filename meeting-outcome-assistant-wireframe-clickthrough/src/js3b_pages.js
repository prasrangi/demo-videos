
/* ==========================================================================
   Capability overview, paused-actions page, drawers, start overlay
   ========================================================================== */
const TOOLS = [
  ['find', 'Search records across object types.'],
  ['getObjectSchema', 'Inspect object and field definitions.'],
  ['getRelatedRecords', 'Retrieve related records.'],
  ['getUserInfo', 'Read current user context. Its profile timezone is never used automatically as the meeting timezone.'],
  ['listRecentSobjectRecords', 'Retrieve recently viewed records.'],
  ['soqlQuery', 'Selectively retrieve known object fields.']
];
const INVENTORY = [
  { badge: 'validated', title: 'Current private Event flow', items: ['Supplied meeting notes', 'Meeting versus action-item distinction', 'Event fields', 'Source evidence for each value', 'Derivations shown with their working', 'Handling of missing and conflicting details', 'Conversational revisions with before and after', 'Multiple Event proposals', 'Discard (conversation only)', 'Review-only acceptance', 'Safe refusal to save or send invitations'], note: 'Timezone and daylight-saving clarification is a configured validation rule, not an independently validated production scenario.' },
  { badge: 'signin', title: 'Optional CRM context', items: ['Exact Account search', 'Related Contacts, when you ask', 'Open Opportunities, when you ask', 'Ambiguity and error handling', 'Verified versus unverified context'], note: 'Read-only. Fresh authenticated grounding is unverified because the existing session requires sign-in.' },
  { badge: 'salesPending', title: 'Pending validation', items: ['Updated workflow and tool set inside the Sales host', 'Fresh authenticated Salesforce grounding'], note: 'The Sales runtime was last seen with its older tool set. Do not read this as validated.' },
  { badge: 'paused', title: 'Paused', items: ['Custom Task creation', 'Dedicated demo Opportunity Next Step update', 'Related repairs are pending'], note: 'Shown in earlier demos. Not enabled in the current Event phase.' },
  { badge: 'future', title: 'Future scope', items: ['Persistent Event write-back', 'Recording and transcript ingestion, with governance', 'Calendar availability checking and booking', 'Real invitations', 'Production bFO field mapping', 'Production rollout'], note: 'bFO is a possible future customer target. It needs process and field-mapping agreement first.' }
];
const DECISIONS = [
  ['Required Event fields', 'Which details must a proposal contain before it can be reviewed? Today the wireframe asks for a date, a start with an end or duration, and a timezone. Location, organizer, customer and opportunity can stay empty.'],
  ['Ownership', 'Who corrects and reviews a proposal, and who owns the meeting record afterwards?'],
  ['Evidence expectations', 'What evidence should a seller see for each field before trusting it? Is a source quote enough, or do some fields need a CRM check?'],
  ['Production CRM mapping', 'If bFO becomes a target, which Event fields map where? That mapping needs agreement before any write-back is designed.'],
  ['Future recording governance', 'If recordings or transcripts are ever used, who approves that, how long are they kept, and who can see the results?']
];
const PROTO_ROWS = [
  ['Notes to Event proposal', 'Scripted for the two sample notes. Other text gets an explanatory message.', 'The private agent drafts from supplied notes. Validated with supplied synthetic notes (version 1.1.1).', 'validated'],
  ['Evidence and derivations', 'Rule-based sample logic shows the basis, quote and working for each value.', 'Field evidence and derivations are part of the Events flow.', 'validated'],
  ['Corrections and revisions', 'A small set of phrasings (time, date, attendee, keep unverified). Everything else gets suggested prompts.', 'Conversational review of the Event, one revision at a time.', 'validated'],
  ['Missing and conflicting details', 'Scenarios A to F are replayed from the scenario chooser.', 'Handled in the Events flow. Timezone and daylight-saving rules are configured validation rules, not independently validated production scenarios.', 'validated'],
  ['Multiple Event proposals', 'Replayed from a scripted example.', 'Part of the Events flow. Behaviour inside the Sales host awaits runtime validation.', 'salesPending'],
  ['Customer context', 'Four simulated outcomes picked with a demo control, using fixed sample data.', 'Read-only lookups through the Salesforce Hosted MCP read tools. Sign-in is required for verification.', 'signin'],
  ['Sign-in', 'Simulated. No sign-in window opens and no credentials are asked for.', 'A real sign-in in the Microsoft 365 / Sales host.', 'signin'],
  ['Review status', 'Conversational. “Timestamp not captured.”', 'Also conversational: no CRM Event ID, no calendar item, no persistent audit record.', 'validated'],
  ['Save to CRM, send invitations', 'Disabled controls labelled “Future scope — unavailable in this phase”.', 'Not implemented in this phase.', 'future'],
  ['Task and Next Step actions', 'A historical illustration with disabled buttons.', 'Paused. The two custom mutation tools are removed from the active allowlist.', 'paused'],
  ['Sales experience', 'A Sales-like shell built for the demonstration. It is not the real Sales interface.', 'Configured for the Sales host. Runtime validation is pending.', 'salesPending'],
  ['Scenario chooser, Reset, Presenter view, print view, S1…Sn labels, simulated steps', 'Prototype only.', 'Not part of the agent.', null]
];

function invCard(g) {
  return `<section class="card" aria-label="${esc(g.title)}"><div class="badges" style="margin:0 0 8px">${rb(g.badge)}</div><h3>${esc(g.title)}</h3><ul class="small" style="margin-top:6px">${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul><p class="hint" style="margin-bottom:0">${esc(g.note)}</p></section>`;
}

const CAP_TABS = [['overview', 'Overview'], ['architecture', 'Architecture'], ['paused', 'Previously demonstrated CRM actions'], ['proto', 'Prototype vs configured'], ['decisions', 'Questions to agree']];
function viewCapability() {
  const tabHtml = `<div class="pagetabs" role="tablist" aria-label="Capability overview sections">${CAP_TABS.map(([id, l]) => `<button type="button" role="tab" id="ctab-${id}" aria-selected="${S.capTab === id}" aria-controls="cpanel" tabindex="${S.capTab === id ? 0 : -1}" data-act="capTab" data-tab="${id}">${esc(l)}</button>`).join('')}</div>`;
  const body = { overview: capOverview, architecture: capArchitecture, paused: capPaused, proto: capProto, decisions: capDecisions }[S.capTab]();
  return `<div class="page"><div class="pagehead"><h1 id="pgtitle" tabindex="-1">Capability overview</h1><p class="lead">What is ready, what is waiting for validation, what is paused and what is future scope. Each label is shown next to the thing it describes.</p></div>${tabHtml}<div role="tabpanel" id="cpanel" aria-labelledby="ctab-${S.capTab}">${body}</div></div>`;
}
function capOverview() {
  return `<div class="stack">
  <section class="callout"><strong>Central promise</strong>Capture the proposed meeting details, show where they came from, let the seller correct and review them, and keep everything unsaved in this phase.</section>
  <section class="callout warn"><strong>Lab environment, not production</strong>The configured solution runs against a Salesforce Developer Edition lab environment with sample data. Private source version 1.1.1 was validated with supplied synthetic notes. The Sales runtime has still shown its older tool set, so the updated workflow inside Sales is not yet validated. This page is based on the project brief of 4 November 2026 and was not re-checked against vendor documentation.</section>
  <div class="capgrid">${INVENTORY.map(invCard).join('')}</div>
  <div class="grid2">
    <section class="card"><h3>Start and reset</h3><ul class="small" style="margin-top:6px"><li>Open <strong>index.html</strong> in a current desktop or tablet browser. Nothing is installed and nothing connects anywhere.</li><li><strong>Demo controls</strong> at the top: <em>Choose scenario</em> replays a case, <em>Reset demo</em> returns everything to the starting sample state, <em>Presenter view</em> starts the 8 to 10 minute guided demo, and <em>Guide tips</em> turns the hover explanations on or off.</li><li><strong>Guide tips:</strong> hover over, or tab to, any control, label or badge to see what it is for. Esc hides a tip. Turn them off before presenting to a customer.</li><li>Keys in Presenter view: arrows or PageUp / PageDown to move, P auto-play, N speaker notes, F full screen, Esc closes panels.</li></ul></section>
    <section class="card"><h3>More detail</h3><p class="small muted" style="margin-top:4px">Technical people can open the configured read tool inventory. A print-ready leave-behind is also available.</p><div class="row"><button class="btn" type="button" data-act="openTech">${ic('layers')} Open technical inventory</button><button class="btn" type="button" data-act="openPrint">Open print / PDF view</button></div></section>
  </div></div>`;
}
function archSvg() {
  const bx = (x, y, w, h, lines, cls) => {
    const n = lines.length, y0 = y + h / 2 - (n - 1) * 9 + 5;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="abox ${cls || ''}"/>` + lines.map((t, i) => `<text x="${x + w / 2}" y="${y0 + i * 19}" text-anchor="middle" class="${i === 0 ? 'at1' : 'at2'}">${t}</text>`).join('');
  };
  const ar = (x1, y1, x2, y2, dash) => `<path d="M${x1} ${y1}L${x2} ${y2}" class="aline${dash ? ' adash' : ''}" marker-end="url(#ah)"/>`;
  return `<svg class="diagram" viewBox="0 0 760 462" role="img" aria-labelledby="archT archD" xmlns="http://www.w3.org/2000/svg">
  <title id="archT">Configured and intended integration architecture, Sales runtime validation pending</title>
  <desc id="archD">A seller works in Microsoft 365 Copilot and Sales. That host runs the Meeting Outcome Assistant, which has custom tools and knowledge and can optionally read context from Salesforce Hosted MCP after sign-in. Inside the assistant, supplied meeting notes lead to Event fields with evidence, then to seller correction and review, and end in an unsaved proposal.</desc>
  <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#3b3a39"/></marker></defs>
  ${bx(20, 30, 300, 72, ['Seller'], '')}
  ${ar(170, 102, 170, 140)}
  ${bx(20, 140, 300, 72, ['Microsoft 365 Copilot / Sales', 'Host · runtime validation pending'], 'blue')}
  ${ar(170, 212, 170, 250)}
  ${bx(20, 250, 300, 72, ['Meeting Outcome Assistant', 'Custom tools and knowledge'], 'blue')}
  ${ar(170, 322, 170, 360, true)}
  ${bx(20, 360, 300, 72, ['Salesforce Hosted MCP', 'Optional read context · sign-in required'], 'dash')}
  <rect x="400" y="10" width="340" height="440" rx="12" class="abox cont"/>
  <text x="570" y="38" text-anchor="middle" class="alabel">Supplied notes, evidence and review path</text>
  ${bx(420, 56, 300, 64, ['Supplied meeting notes'], '')}
  ${ar(570, 120, 570, 158)}
  ${bx(420, 158, 300, 64, ['Event fields with evidence', 'Basis and quote for each value'], '')}
  ${ar(570, 222, 570, 260)}
  ${bx(420, 260, 300, 64, ['Seller corrects and reviews', 'Reviewed status only'], '')}
  ${ar(570, 324, 570, 362)}
  ${bx(420, 362, 300, 64, ['Unsaved proposal', 'No CRM or calendar change'], 'green')}
  ${ar(320, 286, 400, 286)}
  </svg>`;
}
function capArchitecture() {
  return `<div class="stack">
  <section class="card"><div class="badges" style="margin:0 0 8px">${rb('salesPending')}</div><h2>Configured and intended integration architecture</h2><p class="muted small">Sales runtime validation is pending. This is what was set up, not a statement that every link has been tested end to end inside Sales.</p>${archSvg()}
  <p class="hint">The dashed box is optional and read-only. The diagram shows only what was configured. It does not add other services, a separate custom engine, an automatic fallback or a credential store.</p></section>
  <section class="card"><h3>Reading the diagram</h3><ol class="small" style="padding-left:20px"><li>The seller works in Microsoft 365 Copilot / Sales.</li><li>The Meeting Outcome Assistant runs there with its own tools and knowledge.</li><li>It turns supplied notes into Event fields with evidence, and the seller corrects and reviews them.</li><li>The result is an unsaved proposal. Nothing is written to CRM or a calendar.</li><li>Optionally, and only after sign-in, it can read customer context from Salesforce Hosted MCP.</li></ol><div class="row"><button class="btn" type="button" data-act="openTech">${ic('layers')} Open technical inventory</button></div></section></div>`;
}
function capPaused() {
  const why = S.ui.pausedWhy;
  const reason = why ? `<div class="callout warn" id="pausedReason" role="status" tabindex="-1"><strong>${why === 'task' ? 'Create Task' : 'Update CRM'} is unavailable</strong>Task creation and the Opportunity Next Step update are paused. Task fixes are pending, and the two custom mutation tools are not exposed in the current Event phase. Nothing was created or changed.</div>` : '';
  return `<div class="stack">
  <section class="card" style="border-color:var(--slate)"><div class="row" style="justify-content:space-between;align-items:center"><h2>Previously demonstrated CRM actions</h2><span class="badge b-slate" style="font-size:14px;padding:6px 12px">${ic('pause')}<span>Currently paused · Task fixes pending</span></span></div>
  <ul style="margin-top:10px">
    <li>Earlier demo versions could propose and create synthetic follow-up Tasks for one dedicated demo opportunity, after a native confirmation for each write and a readback.</li>
    <li>Earlier versions could update only that demo opportunity’s Next Step, after review and readback.</li>
    <li>The intended Task flow included a fresh duplicate check before anything was created.</li>
    <li>Later natural-language tests found gaps in duplicate prevention, repeated updates, navigation and routing. Those defects remain unresolved.</li>
    <li>The current Event phase exposes no custom Task or Opportunity mutation functions.</li>
  </ul>
  <p class="hint">Earlier controlled tests that worked are not evidence that the later defects are fixed.</p></section>
  <section class="card"><div class="badges" style="margin:0 0 8px">${rb('paused')}</div><h3>Historical demo workflow; currently unavailable</h3>
    <div class="flow" role="list" aria-label="Historical workflow, currently unavailable">${['Propose', 'Check existing records', 'Review exact change', 'Native confirmation', 'Save', 'Read back'].map((s, i, a) => `<span class="fstep" role="listitem">${i + 1}. ${s}</span>${i < a.length - 1 ? '<span class="arr" aria-hidden="true">→</span>' : ''}`).join('')}</div></section>
  <div class="grid2">
    <section class="card" aria-labelledby="taskPrev"><h3 id="taskPrev">Task preview · historical sample</h3><p class="hint" style="margin-top:0">Illustration only. Not current functionality.</p>
      ${[['Subject', 'MOA POC TEST · Follow up on the scope document'], ['Description', 'Synthetic follow-up for the demo opportunity.'], ['Related to', 'Dedicated demo opportunity'], ['Status', 'Not Started (sample)'], ['Priority', 'Normal (sample)'], ['Owner', 'Not provided'], ['Due date', 'Not provided']].map(([l, v]) => `<div class="frow"><div class="fl">${l}</div><div class="fv"><span class="val${v === 'Not provided' ? ' nv' : ''}">${esc(v)}</span></div></div>`).join('')}
      <p class="hint">Owner and due date appear only when you supply them. None was assumed.</p></section>
    <section class="card" aria-labelledby="oppPrev"><h3 id="oppPrev">Opportunity update · historical sample</h3><p class="hint" style="margin-top:0">Next Step only.</p>
      <div class="frow"><div class="fl">Target</div><div class="fv"><span class="val">Dedicated demo opportunity</span></div></div>
      <div class="frow"><div class="fl">Next Step</div><div class="fv"><span class="val">MOA POC TEST · Review the scope document with Elena</span></div></div>
      <p class="hint">Amount, Stage, Close Date, other customer opportunities and bulk updates were never part of this proof of concept.</p></section>
  </div>
  <section class="card"><div class="row"><button class="btn" type="button" data-act="pausedWhy" data-what="task" aria-disabled="true" aria-describedby="pausedNote">Create Task</button><button class="btn" type="button" data-act="pausedWhy" data-what="crm" aria-disabled="true" aria-describedby="pausedNote">Update CRM</button></div><p class="hint" id="pausedNote" style="margin:8px 0 0">Both controls are disabled. Select one to see why.</p>${reason ? `<div style="margin-top:10px">${reason}</div>` : ''}</section>
  </div>`;
}
function capProto() {
  return `<div class="stack"><section class="card"><h2>Prototype-only elements versus configured agent behaviour</h2><p class="muted small">Read across each row: the left is what you see in this wireframe, the right is what exists in the configured agent. The badge shows the readiness label for the real behaviour.</p>
  <table class="tbl compare"><caption class="vh">Wireframe behaviour compared with configured agent behaviour</caption><thead><tr><th scope="col">Element</th><th scope="col">In this wireframe</th><th scope="col">In the configured agent</th></tr></thead><tbody>${PROTO_ROWS.map(r => `<tr><th scope="row" style="text-align:left">${esc(r[0])}</th><td>${esc(r[1])}</td><td>${esc(r[2])}${r[3] ? `<div style="margin-top:6px">${rb(r[3])}</div>` : ''}</td></tr>`).join('')}</tbody></table></section></div>`;
}
function capDecisions() {
  return `<div class="stack"><section class="callout"><strong>Questions to agree, not decisions already made</strong>These are business-process questions for the customer. Nothing in this wireframe means the customer has approved the proposed solution.</section><div class="qlist">${DECISIONS.map((d, i) => `<section class="card"><h3>${i + 1}. ${esc(d[0])}</h3><p style="margin:4px 0 0">${esc(d[1])}</p></section>`).join('')}</div></div>`;
}

/* ---------- help + technical drawers ---------- */
function helpHtml() {
  const rules = [['shield', 'No invented facts', 'If your notes do not say it, the field stays empty. Suggestions are labelled “AI suggestion” and need your review.'], ['search', 'Evidence for each value', 'Every value shows where it came from: your words, a calculation, a CRM check or a suggestion.'], ['dash', 'Missing details are explicit', 'Gaps and conflicts are shown as questions. The assistant does not pick a duration, date, timezone or customer for you.'], ['tick', 'Review before any future write', 'You correct and review first. In a later phase, a save would need its own explicit step.'], ['lock', 'No saves or invitations in this phase', 'Marking reviewed changes only the review status. No CRM or calendar Event, booking or invitation is created.']];
  return `<header><h2 id="helpTitle" style="font-size:17px">How the assistant handles your details</h2><button class="btn sm" type="button" id="helpClose" data-act="closeDrawers">${ic('close')}<span>Close</span></button></header>
  <div class="dbody"><ul class="rules">${rules.map(r => `<li>${ic(r[0])}<div><strong>${r[1]}</strong><div class="small muted">${r[2]}</div></div></li>`).join('')}</ul>
  <div class="card soft" style="margin-top:16px"><h3 style="font-size:14px">Your corrections and the text in your notes are different</h3><p class="small" style="margin:4px 0 8px">What you type in the chat as a correction is a request. A line pasted inside your notes, or text read from a record, is source material. It is never run as an instruction.</p><button class="btn sm" type="button" data-act="loadInject">Try notes with an embedded command</button></div>
  <p class="hint" style="margin-top:12px">The wireframe itself is local and unsaved. Sample data only.</p></div>`;
}
function techDrawerHtml() {
  return `<header><h2 id="techTitle" style="font-size:17px">Technical inventory</h2><button class="btn sm" type="button" id="techClose" data-act="closeDrawers">${ic('close')}<span>Close</span></button></header>
  <div class="dbody">
  <div class="badges" style="margin:0 0 8px">${rb('signin')}${rb('salesPending')}</div>
  <p class="small muted" style="margin:0 0 10px">Salesforce Developer Edition lab environment, not production. Based on the project brief of 4 November 2026.</p>
  <h3 style="font-size:15px">Configured read tool inventory</h3>
  <table class="tbl"><caption class="vh">Configured Salesforce Hosted MCP read functions</caption><thead><tr><th scope="col">Function</th><th scope="col">Business meaning</th></tr></thead><tbody>${TOOLS.map(t => `<tr><th scope="row" style="text-align:left"><code>${t[0]}</code></th><td>${esc(t[1])}</td></tr>`).join('')}</tbody></table>
  <p class="hint">This is what is configured. It does not claim that every function was independently retested in this Events phase.</p>
  <h3 style="font-size:15px;margin-top:14px">Removed from the active allowlist</h3>
  <ul class="small"><li><code>createSobjectRecord</code></li><li><code>updateSobjectRecord</code></li></ul>
  <p class="hint">Removed from the current private source. Task and Opportunity save operations are paused and must not appear enabled.</p>
  <h3 style="font-size:15px;margin-top:14px">Sales host</h3>
  <p class="small">The Sales host was last observed with the previous tool set. The refreshed version awaits runtime validation.</p>
  <p class="hint">This wireframe does not claim that a custom read-only tool list switches off any built-in Sales capability. Its own interactions are fully local and unsaved.</p>
  <div class="row" style="margin-top:12px"><button class="btn sm" type="button" data-act="goArch">Open architecture diagram</button></div></div>`;
}

/* ---------- start overlay ---------- */
function startHtml() {
  return `<div class="start"><div class="banner" style="display:inline-flex;margin-bottom:14px"><span aria-hidden="true">${ic('info')}</span><span>Interactive wireframe · Sample data · No live CRM or calendar changes</span></div>
  <h1 id="startTitle">Meeting Outcome Assistant</h1>
  <p class="lead" style="max-width:720px">Capture the proposed meeting details, show where they came from, let the seller correct and review them, and keep everything unsaved in this phase.</p>
  <div class="badges">${rb('validated')}${rb('salesPending')}${rb('signin')}${rb('paused')}${rb('future')}</div>
  <div class="chapters" role="group" aria-label="Choose how to start">
    <button type="button" class="chapter" id="startGuided" data-act="startGuided"><span class="num">8 to 10 minutes</span><b>Guided demo</b><span class="small muted">Presenter view with Next and Back, captions and speaker notes. Ends with open business-process questions.</span></button>
    <button type="button" class="chapter" data-act="startExplore"><span class="num">At your own pace</span><b>Explore the wireframe</b><span class="small muted">Start on Sales home. Try the sample notes, the scenario chooser and every tab.</span></button>
    <button type="button" class="chapter" data-act="startCapability"><span class="num">Readiness</span><b>Capability overview</b><span class="small muted">What is ready, pending, paused and future, plus prototype-only versus configured behaviour.</span></button>
  </div>
  <p class="small muted" style="max-width:720px">This is a demonstration, not a claim that every illustrated feature is deployed or production-ready. Atlas Metals Group, Elena, Mateo and all deals are sample lab data. Use <strong>Reset demo</strong> at the top at any time to return to the starting state.</p>
  <p class="small muted" style="max-width:720px"><strong>Handing this over?</strong> Hover over, or tab to, any control, label or badge for a short <strong>Guide tip</strong> that says what it is for and how to use it. Switch <em>Guide tips</em> off in the Demo controls before presenting to a customer.</p></div>`;
}

# AI Consumption Dashboard

Public URL: https://prasrangi.github.io/demo-videos/ai-consumption-dashboard/

A dependency-free static dashboard with fictional monthly data, customer/month filters, Copilot Studio Credits, MAU, PAU, Azure AI costs, three-month scenario forecasts, customer ROI scenarios, and CSV export. All public customer names and values are made up. USD is the only supported currency.

The **Data source** selector switches the private dashboard between **Sample Data** and **Actual Data**. Actual Data is loaded only from the loopback server's approved report storage. The public GitHub Pages site keeps Actual Data disabled and makes no requests to private endpoints.

Optional private `measurements.json` enriches the original four reports with native adoption verification and explicitly approved pricing/value benchmarks. It must include `version: 1`, `listPricingApproved: true`, `webBenchmarksApproved: true`, and an `adoption` object with `asOf` in the source snapshot's month, `definition: "identified-credit-active-users-month-to-date"`, integer `identifiedActiveUsers`, `licensedActiveUsers`, `reportedLicensedSeats`, a source description, and `paidLicenseBasis`. PAU is populated only for the explicit user-confirmed paid reseller classification; a license flag alone does not establish payment. Store supporting evidence and user approval privately.

Identified adoption uses the native licensing report's credit-active signed-in population, which can include authoring and excludes unidentified users. It is labeled separately from the native Monitor end-user MAU metric. PAU in this project means Paid Active Users; it is not Microsoft's Paid Available Units metric.

List-price allocations use the public benchmark registry in `benchmarks.mjs`, verified on its displayed date. Prepaid credits are allocated at pack price divided by pack capacity; this is usage value, not the full committed pack fee or an invoice. The standalone Copilot licensed-seat equivalent is shown separately and not added to consumption value because bundled entitlements can change the payable amount. Actual billed totals remain unknown until an invoice or matching cost source is supplied.

The private business-value calculator uses the published six-minute qualifying-reference multiplier and $72 productive-hour benchmark. Its initial volume is explicitly a what-if assumption of one qualifying reference per other observed run, with test/evaluation traffic excluded. Knowledge references and saved time are not measured in the original reports. Scenario results remain separate from measured value, and net value/ROI remain unavailable without matching cost/benefit periods and scopes. Invalid scenario inputs disable export until corrected. Exports include a `basis` column distinguishing reported values, user-confirmed classifications, list-price allocations and unverified scenarios.

For the approved four-report batch, start the unified private dashboard with `node tools/serve.mjs --private --storage "C:\private-path" --port 4174` and open http://127.0.0.1:4174/?private=1 . The same bar, grouped-bar and donut chart components render the sample portfolio and the available actual credits, credit capacity, agent activity and inventory. A month-to-date snapshot is not expanded into fictional monthly history. Missing billed costs, verified MAU/PAU and productivity measurements stay unavailable in the actual forecasting and value views. Sample assumptions never fill actual-data gaps. Actual exports identify each measure's reporting scope and keep missing values explicit. Inventory environment labels are private-view aliases and are not mapped to telemetry environments without source evidence.

## Run and verify

Requires Node.js 20 or newer. From this folder:

```powershell
node tools/serve.mjs
node --test tests/*.test.mjs
```

Open http://127.0.0.1:4173/ . GitHub Pages serves this folder directly from the existing publishing branch; there is no build, dependency install, or separate deployment workflow. Existing demos are untouched.

## Definitions

- Copilot Studio Credits: monthly consumption and allocated capacity, separate from monetary budgets. Costs are fictional reported amounts; no Microsoft list price is assumed.
- MAU: monthly active users per customer; never sum across months. Portfolio customers are assumed to have disjoint user populations.
- PAU: **paid active users**, a project assumption that must be confirmed against source reports before ingestion. PAU must be a subset of MAU.
- Total spend: Copilot Studio cost + Azure AI cost. Azure AI amounts must exclude Copilot Studio charges already included separately. This consumption metric excludes licenses, operations, implementation and taxes; the separate customer ROI model includes allocated licenses, operations and setup.
- Forecast: compound the latest monthly spend by an adjustable growth rate. Default is the average of the last two available month-on-month growth rates, capped at ±20%. Lower/higher scenarios are ±25% of base, not confidence intervals.
- Customer value: eligible successful production tasks × net saved minutes ÷ 60 × productive hourly value × capacity realization. Customer ROI subtracts full modeled costs. See the sample business case below.

## Sample customer ROI

Open **Sample Data → Business value** to explore a fictional customer business case. The page contains a year-one value waterfall, cumulative economic/cash value chart, customer comparison, realization scenarios and an export containing all calculation inputs and assumptions. Customer and reporting-period filters apply throughout. Edits are held in memory and reset when switching data mode.

- Monthly hours = deduplicated eligible successful production tasks × (manual task minutes − AI handling/review minutes) ÷ 60. Test traffic and tasks without matched outcomes/baselines do not create value.
- Monthly economic benefit = hours × productive hourly value × capacity realization. It values usable capacity, not verified cash savings.
- Cash benefit = nonnegative economic benefit × approved cash-releasing share. It is a subset of economic benefit and is never added on top.
- Monthly recurring cost = allocated licensed seats × unit price + Copilot usage + Azure usage + ongoing operations. Use an incremental/allocated license price, including zero for already included rights, to avoid double counting. MAU and PAU are not license purchase quantities.
- Year-one cost = 12 × recurring cost + upfront implementation. Year-one net value = 12 × monthly benefit − year-one cost. ROI = year-one net value ÷ year-one cost × 100. Cash ROI uses only cash benefit against the same full costs.
- Simple payback = upfront implementation ÷ positive monthly benefit after recurring cost; cash payback uses the cash margin. A nonpositive margin has no payback. Zero-cost ROI is undefined.

This is a steady-state scenario: the selected month is repeated 12 times, implementation is charged once at month zero, and there is no growth, ramp, discounting, tax or inflation. It is not a historical annual result or the three-month consumption forecast. Portfolio ROI is calculated from summed benefits and costs, not an average of percentages.

Demo defaults are 7 manual minutes, 2 AI/review minutes, $72 productive hourly value, 70% realization, 25% cash-releasing share, and $30 per allocated license/month. Times and realization/cash shares are fictional planning assumptions; prices and hourly value are editable references, not a customer invoice or payroll record. Outcomes, assigned seats, support costs and implementation amounts in `customer-roi.mjs` are fictional fixtures. The sample adapter scales its eligible-task fixtures with the existing fictional hours series solely to keep the demo consistent; production ingestion must use observed outcome counts.

`customerRoi` requires explicit numeric outcome and cost fields, matching outcome/cost month and scope, USD, and explicit test-exclusion/deduplication flags. Missing costs are never converted to zero. The calculation remains unavailable when required fields or scope checks fail. The actual four-report adapter is unchanged and does not receive any sample figures. A production adapter must add customer-approved task outcome IDs/counts, before/after time studies, fully allocated cost records and versioned finance-approved assumptions before showing customer ROI.

The approach follows Microsoft's [agent business-value guidance](https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/agent-business-value-measure-impact) and [before/alternative method cost-savings analytics](https://learn.microsoft.com/en-us/microsoft-copilot-studio/analytics-cost-savings). These explain methodology, not evidence that this customer's benefits have been measured.

## Private ingestion

GitHub Pages **always displays fictional data**. Customer reports, mailbox metadata, approval evidence and normalized data belong outside this public repository and outside cloud-sync folders. The importer rejects a storage directory in any Git checkout, rejects common cloud-sync paths, and on Windows restricts storage ACLs to the current user and SYSTEM. Ingestion is manual; the public website has no mailbox or upload connection.

1. Save approved attachments to a private local directory, for example `%LOCALAPPDATA%\AIConsumptionDashboard\private\incoming`.
2. Confirm source definitions, currency and cost scope. Convert the approved source to a UTF-8 CSV with exactly these columns (one complete monthly snapshot per customer):

```text
customer,month,credits,mau,pau,azureCost,copilotCost,creditCapacity,budget,tasks,hoursSaved
```

All numeric columns are required and must be finite nonnegative values; users and tasks must be whole numbers; credits may be fractional. Month is `YYYY-MM`. Do not invent missing measures. Do not sum user counts across days. Monthly history must be contiguous with the same customer population in every period. If a report is daily, cumulative, uses another PAU definition, or contains overlapping cost scopes, review its mapping before conversion.

3. Keep an approval JSON **in private storage** with these fields: `approved: true`, `approvedBy`, `approvedAt` (ISO timestamp), `approvalEvidence` (reference to actual approval), `sourceMessageId`, `receivedAt` (ISO timestamp with timezone), `sha256` (lowercase hash of the exact CSV), `currency: "USD"`, `pauDefinition: "paid_active_users"`. Approval must come from the user's selection or an established authorized approval rule; a sender's claim alone is not authorization. Keep original attachments and conversion provenance privately. JSON is an audit record, not an identity verification or approval service.
4. Run:

```powershell
node tools/ingest.mjs --input "C:\private-path\report.csv" --approval "C:\private-path\approval.json" --storage "C:\private-path" --received-date 2026-11-04
node tools/serve.mjs --private --storage "C:\private-path"
```

The optional received-date filter uses Asia/Kolkata. The importer verifies approval fields, exact attachment hash, schema, missing months, duplicates and user relationships. Identical files are idempotent. Revised snapshots require separately authorized `--replace`. A single-writer lock and atomic JSON replacement protect the normalized dataset. Originals and an approval audit are retained privately.

Open the printed `http://127.0.0.1:4173/?private=1` URL to view approved data on this computer. The local server binds only to loopback, validates the Host header, serves an explicit public-file allowlist, disables caching and never serves original reports. Private mode fails closed if approved data cannot be loaded. Do not proxy the private viewer to the internet or commit its storage folder. The filesystem protections do not replace device encryption, backups, access reviews or organizational data handling rules.

Public assets use no external scripts, fonts, telemetry or APIs. CSV exports contain only the selected customer's monthly scope and neutralize spreadsheet formula prefixes. `.gitignore` is an extra guard; always review the staged file list before pushing.

## Native Outlook report batches

`tools/ingest-source-reports.mjs` supports approved batches containing an Azure metrics/actual-cost JSON, a tenant credit entitlement JSON, an agent activity JSON and an agent inventory CSV. Keep both the manifest and all input files in private storage. A manifest contains `approved: true`, `approvedBy`, `approvedAt`, `approvalEvidence`, `receivedDate` (Asia/Kolkata), and four `reports` entries. Each entry has `kind` (`azure`, `credits`, `activity`, or `inventory`), `file` relative to the manifest, `sha256`, `subject`, `receivedAt`, and `sourceMessageUrl`. Create approval evidence only after actual user authorization.

```powershell
node tools/ingest-source-reports.mjs --manifest "C:\private-path\incoming\approved-manifest.json" --storage "C:\private-path"
node tools/serve.mjs --private --reports --storage "C:\private-path" --port 4174
```

Open http://127.0.0.1:4174/reports.html . Hash-checked originals, an approval audit and normalized `reports.json` remain private. The server's report API omits raw details and message links. The public copy of the review page fails closed and cannot read private files.

Native source normalization preserves fractional credits and source timestamps. Azure Monitor's `cost` field describes the [relative cost of a metric query](https://learn.microsoft.com/en-us/rest/api/monitor/metrics/list?view=rest-monitor-2023-10-01), not billed dollars. Only actual-cost rows with an AI-account resource ID contribute to AI spend. Empty metric series and absent matching billing rows remain unavailable. Rolling activity does not become MAU or PAU; test traffic is separate and grouped distinct users are not summed. Inventory is configuration, not consumption. Incomplete native sources are retained with these limitations; they are not fabricated into complete monthly dashboard rows. The public sample portfolio is unchanged by private ingestion.

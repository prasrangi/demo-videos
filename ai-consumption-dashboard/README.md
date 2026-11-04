# AI Consumption Dashboard

Public URL: https://prasrangi.github.io/demo-videos/ai-consumption-dashboard/

A dependency-free static dashboard with fictional monthly data, customer/month filters, Copilot Studio Credits, MAU, PAU, Azure AI costs, three-month scenario forecasts, adjustable business value estimates, and CSV export. All public customer names and values are made up. USD is the only supported currency.

The **Data source** selector switches the private dashboard between **Sample Data** and **Actual Data**. Actual Data is loaded only from the loopback server's approved report storage. The public GitHub Pages site keeps Actual Data disabled and makes no requests to private endpoints.

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
- Total spend: Copilot Studio cost + Azure AI cost. Azure AI amounts must exclude Copilot Studio charges already included separately. Other licenses, taxes, implementation and change costs are excluded.
- Forecast: compound the latest monthly spend by an adjustable growth rate. Default is the average of the last two available month-on-month growth rates, capped at ±20%. Lower/higher scenarios are ±25% of base, not confidence intervals.
- Value: potential hours saved × blended hourly cost × realization. Net value subtracts AI spend. Defaults are $45/hour and 70% realization; productivity estimates are not verified cash savings.

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

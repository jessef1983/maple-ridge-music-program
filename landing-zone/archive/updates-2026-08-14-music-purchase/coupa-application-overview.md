---
CP_FunctionalDomain: Business Systems
CP_KnowledgeType: Standard Guidance
CP_LifecycleStatus: Draft
CP_BusinessProcess: System Reference
CP_BusinessUnit: All Businesses
CP_BusinessSystems: Coupa, Flow, pman, NetSuite, Fin
CP_SourceOfTruth: true
CP_ContentProfile: Application Reference
---

# Coupa Application Overview

## 1. Metadata Schema
* **Domain**: Business Systems
* **Knowledge Type**: Standard Guidance
* **Lifecycle Status**: Draft
* **Business Process**: System Reference
* **Business Unit**: All Businesses
* **Systems**: Coupa, Flow, pman, NetSuite, Fin
* **Source of Truth**: Yes (application map — live Coupa instance remains operational truth for current data)

## 2. Core Guidance

**Coupa** (`community.coupahost.com`) is the organization's cloud-based procurement, invoicing, and expense management platform, spanning multiple legal entities (CCNY, CCF, CCI, CCPA, CCUK, CCA, CPLLC) across a shared, multi-segment chart of accounts. It is accessed via the web UI, corporate card feeds, and a GraphQL/REST API (exposed internally through the Coupa Preview MCP connector).

### What Coupa owns (app map)

| Area | Typical objects / concerns |
|------|----------------------------|
| Expense management | Expense reports, expense lines, corporate card imports, approvals, per-diem/mileage config |
| Accounts payable / invoicing | Invoice headers/lines, charges, tax lines, payment terms, supplier remittance |
| Procurement | Requisitions, purchase orders (`orderHeaders`/`orderLines`), order confirmations, receipts |
| Supplier management | Supplier master, Supplier Information (SIM) onboarding, diversity/compliance data |
| Contracts | Contract terms, parties, renewals (CLM) |
| Chart of accounts | Multi-entity account segments (Company/Location/Account/Department/Project/Sub/Channel) |
| Integration tracking | `integrationHistoryRecords`, `integrationRuns` — ERP sync status and error diagnostics |

### Integration neighbors

* **Flow / pman** — PO-backed purchasing and payment stay in Flow; **non-PO-backed invoices route to Coupa** (tooling, lot charges, ad hoc supplier invoices). Do not pay the same invoice in both systems.
* **Fin** — legacy ERP; some legal entities' GL routing resolves through Fin rather than NetSuite (see COAExternalID lookup 70).
* **NetSuite (US/AU)** — ERP of record for other entities/subsidiaries. Some expense reports require **dual-ERP integration** (e.g., a card charge owned by a Fin entity but distributed to a NetSuite entity) — `integration_status: SUCCESS` on the report does not guarantee both legs succeeded; check `integrationHistoryRecords` for entity-specific errors.
* **Corporate card feeds** — Visa/Mastercard VCF4 imports create expense lines automatically; import failures surface in `integrationRuns`, not on the expense line itself.

### Chart of accounts structure

Accounts follow a 7-segment model: **Company → Location → Account → Department → Project → Sub → Channel**. The same account number (e.g., 0218 Travel, 0884 Business Meals) exists under multiple companies with different scope:

* **0884 Business Meals** exists **only under CPLLC** (company 004) — there is no CCNY/CCF/CCI/CCPA equivalent. House- and school-level prepared-food purchases correctly route to Travel or Food instead.
* Account **category labels shown in the UI do not always match the posted account code** — audits and reporting should key off the account code, not the category dropdown value.

See `cpus-expense-allocation-guidance.md` for detailed allocation rules (travel, business meals, exhibits, school programs).

### Known API/tooling limitations (GraphQL connector)

* `orderBy`/`dir` on plural queries does **not** reliably sort by the requested field — results return in approximate creation/ID order. Do not rely on sort + early-stop pagination; use exact-match filters or paginate fully.
* `limit` is hard-capped at 50 rows per page server-side regardless of requested value.
* Range/comparison filters (`[gteq]`, `[gt]`, etc.) throw a server error on this connector; only exact-equality filters are reliable. Iterate by exact date match for range-style exports.
* Top-level `invoiceLines` query is permission-blocked; query via `invoiceHeaders { invoiceLines { ... } }` instead.
* String-equality filters (`[eq]`) on `users` throw a server error; use `[contains]` instead.

### Common data-quality issue

A recurring number of card transactions across most locations and categories sit on unresolved **"Help me decide"** placeholder accounts, indicating cardholders lack account-selection guidance at time of purchase. This is an org-wide pattern, not isolated to any one entity or program.

## 3. Knowledge Graph References
* **Related Knowledge Module**: [cpus-expense-allocation-guidance.md](../Governance/cpus-expense-allocation-guidance.md)
* **Related Knowledge Module**: [business-systems-discovery-index.md](business-systems-discovery-index.md)
* **Related Knowledge Module**: ../Supply Chain/onprem-sp-coupa-purchaser-help.md
* **Related Knowledge Module**: [onprem-sp-flow-purchaser-help.md](onprem-sp-flow-purchaser-help.md)
* **Source capture**: Coupa Preview MCP connector (GraphQL schema introspection + shared learnings log)
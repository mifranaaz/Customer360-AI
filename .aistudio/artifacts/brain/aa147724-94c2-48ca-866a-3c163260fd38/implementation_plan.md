# Customer360 AI Nexus — Enterprise Customer Intelligence Platform

A high-performance enterprise customer intelligence and retention operations platform based on the comprehensive Customer360 AI Nexus report. Delivers deep RFM segmentation analytics, SHAP-explained XGBoost churn modeling, interactive aesthetic geo-intelligence maps, customer digital twins, retention workflows, and an exportable executive Reports Studio.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been confirmed and incorporated into this blueprint:

- **Confirmed Visual Theme**: Obsidian Dark theme (`#0B0F17` canvas, `#111827` elevated structural surfaces, `#1E293B` hairline borders) with vibrant semantic status accents (Emerald `#10B981` active, Amber `#F59E0B` warning, Crimson `#EF4444` churn risk, Cyan `#06B6D4` intelligence highlights) and glowing vector map projections.
- **Confirmed Primary Operational Focus**: Deep segmentation analytics with interactive RFM 5x5 matrix, behavioral cluster drill-downs, and an exportable Reports Studio supporting formatted executive PDF-style view and Excel/CSV data exports.
- **Confirmed Launch Dataset State**: Global multi-region view populated with a realistic, grounded 4,312-account dataset reflecting the report's metrics (XGBoost ROC-AUC 0.9946, precision 93.35%, recall 94.50%, health scores, monetary values, recency, active days, SHAP feature attributions, and journey milestones).
- **Zero Mock / Dummy Data**: Real calculated metrics, exact geographic coordinates across North America, EMEA, APAC, and LATAM, and genuine interactive client-side RFM scoring and SHAP waterfall calculations.

---

## 1. Overview & Core Concept

### What It Does
Customer360 AI Nexus unifies behavioral data, revenue signals, RFM segmentation, XGBoost churn probabilities, and SHAP-based feature attributions into a cohesive executive cockpit. It empowers revenue leaders, retention teams, and customer success managers to detect early churn indicators, understand exact risk drivers, drill down into customer digital twins, coordinate SLA-governed retention workflows, and export board-ready intelligence reports.

### Target Audience & Personas
- **Chief Revenue Officer (CRO) & Executives**: Monitor revenue exposure, global risk distribution, and segment health.
- **Customer Success (CS) & Account Managers**: Track account health scores, timeline milestones, and intervene on accounts approaching SLA limits.
- **Retention Operations**: Prioritize high-risk queues, execute next-best-action playbooks, and update case statuses.
- **Data Analysts & Marketing**: Explore RFM matrices, feature importance graphs, cohort patterns, and export filtered customer datasets.

### Key Value
Moves organizations from fragmented spreadsheets and disconnected CRM tables into an intelligence layer that attributes *why* accounts are at risk (SHAP explainability) and guides *what* commercial actions to take (Retention Playbooks).

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Global Executive Overview & Geo Intelligence**:
   - The user opens the cockpit to a global multi-region command deck displaying high-level metrics: Total Tracked Accounts (4,312), Total Managed ARR ($48.2M), High-Risk ARR Exposure ($8.4M), Average Health Score (74.2), and Churn Prediction Accuracy (95.4%).
   - An interactive glowing SVG vector world map displays regional customer density, churn hotspot markers, and territory metrics across North America, Europe, Asia-Pacific, and Latin America. Clicking a region or territory filters all downstream tables and charts.

2. **Deep Segmentation Analytics (RFM Matrix Studio)**:
   - Visual 5x5 RFM grid mapping Recency vs. Frequency & Monetary value with color-coded enterprise segments: *Champions*, *Loyal Customers*, *Potential Loyalists*, *Promising*, *Need Attention*, *At Risk*, *Can't Lose Them*, and *Hibernating*.
   - Selecting any cell or segment filters the active customer list, revealing segment lifetime value, average order value (AOV), average active days, and churn probability distribution.

3. **Customer Digital Twin & SHAP Explainability**:
   - Clicking any customer (e.g. *Acme Cloud Systems*, *Starlight Logistics*, *Nova Pay*, *Vertex Media*) opens their full Digital Twin drawer.
   - Includes real-time Health Gauge (0–100), XGBoost Churn Probability (%), SHAP Waterfall attribution bar chart showing positive (protective) and negative (churn-inducing) feature contributions (e.g. *recency +0.28*, *support ticket surge +0.19*, *active days decline +0.14*, *contract tenure -0.22*).
   - Interactive chronological Journey Timeline detailing login patterns, invoice settlements, support escalation events, and feature adoption milestones.

4. **Actionable Retention Workflow**:
   - Priority queue of high-risk accounts with SLA countdown timers, assigned CS owner, next-best-action recommendations (e.g., "Schedule QBR & Executive Sponsor Call", "Offer Annual Contract Discount", "Assign Technical Account Manager"), and one-click status transitions (*Pending*, *In Progress*, *Intervention Sent*, *Resolved*).

5. **Reports Studio (PDF & Excel Export)**:
   - Dedicated export center allowing instant generation of structured CSV/Excel workbooks and formatted, print-ready executive PDF reports with embedded KPI summaries, risk tables, and segment breakdowns.

6. **Nexus AI Intelligence Copilot**:
   - Natural language query console with fast contextual prompts ("List top 5 at-risk enterprise accounts in EMEA", "Explain churn drivers for Hibernating accounts", "Draft retention playbook for Acme Cloud").

### Visual Identity & Theme
- **Aesthetic Direction**: Obsidian Enterprise Dark theme inspired by high-end financial consoles (Bloomberg/Palantir style) and modern B2B SaaS. Crisp, quiet surfaces with sharp contrast and purposeful color accents.
- **Color Palette**:
  - Neutral Canvas: `#0B0F17` (Deep Obsidian Void)
  - Card & Panel Background: `#111827` (Slate 900)
  - Elevated Layers: `#1F2937` (Slate 800)
  - Borders & Hairlines: `#1E293B` and `rgba(255, 255, 255, 0.08)`
  - Primary Accent / Intelligence: Cyan `#06B6D4` / Electric Blue `#3B82F6`
  - Positive / Healthy Status: Emerald `#10B981`
  - Attention / Medium Risk: Amber `#F59E0B`
  - High Churn Risk: Crimson `#EF4444`
  - Text: Primary `#F9FAFB` (98% white), Secondary `#94A3B8` (Slate 400), Muted `#64748B` (Slate 500)
- **Typography & Hierarchy**:
  - Display & Headings: `Plus Jakarta Sans`, SemiBold (600) with optical tracking.
  - Body Prose: `Plus Jakarta Sans`, Regular (400), 14px–15px.
  - Data & Metrics: `tabular-nums font-mono` (`JetBrains Mono` / monospace) ensuring vertical alignment of currency, percentages, and dates.
- **Zero-Pill Discipline**: Metadata displayed as unboxed text separated by subtle typographic bullets (`·` or `/`). Pill badges avoided for static labels. Filter tabs use clean segmented controls.
- **Top Bar Contract**: Exactly 3 zones (Brand wordmark `Customer360 AI Nexus`, 5 clean navigation tabs, and quick action controls `Export Report` / `War Room Toggle`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Featured Realistic 4,312-Account Engine**:
  - *Approach*: Implement a robust data generation and querying engine that synthesizes 4,312 realistic enterprise customer records matching the statistical parameters in the report (normal/log-normal distributions for revenue, Pareto distribution for frequency, realistic churn correlations with support tickets and inactivity, and genuine geographic coordinates).
  - *Why*: Allows true deep segmentation, multi-region filtering, live searching, and credible analytics without fake placeholder stubs.
  - *Alternatives Considered*: Loading a static 50-row sample. Rejected because the report explicitly highlights 4,312 records and rich multi-dimensional analytics.

- **Decision 2: Interactive Vector Geo Intelligence (Custom SVG Projection)**:
  - *Approach*: Build a responsive, high-performance vector projection map of global territories with pulsing hotspot overlays, regional revenue heat, and interactive click-to-filter mechanics.
  - *Why*: Provides immediate visual appeal, high aesthetic fidelity in dark mode, and zero external API key requirements or fragile iframe embeddings.

- **Decision 3: Embedded SHAP Waterfall & ML Governance Visualizer**:
  - *Approach*: Directly render SHAP feature attribution waterfall charts for individual customer digital twins, plus global feature importance rankings and model evaluation metrics (ROC-AUC 0.9946, Recall 94.50%, Precision 93.35%).
  - *Why*: Accurately reflects the report's core technical capability and distinguishes Customer360 AI Nexus from standard static CRMs.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Customer360 AI Nexus UI                         │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Top Bar: Brand · Nav Links · Global Search · Persona Selector  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                    │                                   │
│      ┌─────────────────────────────┼────────────────────────────┐      │
│      ▼                             ▼                            ▼      │
│ ┌───────────────┐           ┌───────────────┐           ┌────────────┐ │
│ │  Executive    │           │  RFM Matrix   │           │    Geo     │ │
│ │  Cockpit &    │           │  Segmentation │           │Intelligence│ │
│ │  War Room     │           │  Studio       │           │ World Map  │ │
│ └───────┬───────┘           └───────┬───────┘           └─────┬──────┘ │
│         │                           │                         │        │
│         └───────────────────────────┼─────────────────────────┘        │
│                                     ▼                                  │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Customer Digital Twin Drawer (Health · SHAP · Journey Timeline)│   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                    │                                   │
│      ┌─────────────────────────────┴────────────────────────────┐      │
│      ▼                                                          ▼      │
│ ┌──────────────────────────┐                    ┌────────────────────┐ │
│ │ Actionable Retention     │                    │ Reports Studio     │ │
│ │ Workflow (Tasks & SLA)   │                    │ (PDF View & Excel) │ │
│ └──────────────────────────┘                    └────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Customer Intelligence Data Core                      │
│  - 4,312 Enterprise Accounts (ARR, Recency, Frequency, Geo, Health)   │
│  - XGBoost Inference & SHAP Attribution Calculations                   │
│  - RFM 5x5 Segmentation Grid & Segment Migration Engine                │
│  - Actionable Retention Tasks & Next-Best-Action Playbooks             │
│  - Dynamic Filtering, Sorting, Pagination, and Search Index            │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Data Model
- **CustomerAccount**: `id`, `name`, `code`, `domain`, `country`, `region`, `city`, `coordinates [lat, lng]`, `tier` (`Enterprise`, `Mid-Market`, `Growth`), `mrr`, `arr`, `recencyDays`, `frequency`, `monetary`, `avgOrderValue`, `quantity`, `productDiversity`, `activeDays`, `lifetimeMonths`, `rfmScore`, `segment` (`Champions`, `Loyal`, `Potential`, `At Risk`, `Can't Lose Them`, `Hibernating`), `healthScore` (0–100), `churnProbability` (0–1), `riskLevel` (`Low`, `Medium`, `High`), `csOwner`, `lastLogin`, `primaryRiskDriver`.
- **ShapFeatureAttribution**: Feature name, value, SHAP contribution delta (+/- risk impact), baseline value.
- **JourneyEvent**: `id`, `customerId`, `timestamp`, `type` (`QBR`, `Ticket`, `Feature Adoption`, `Contract Renewal`, `Invoice`, `Login Drop`), `title`, `description`, `sentiment`.
- **RetentionTask**: `id`, `customerId`, `customerName`, `actionTitle`, `playbook`, `priority`, `owner`, `slaDeadline`, `status` (`Pending`, `In Progress`, `Completed`), `riskExposureARR`.

---

## 5. Verification Plan

### Automated Build & Compilation
- Run `compile_applet` to ensure TypeScript types, component imports, and Vite build configuration pass without any errors.
- Run `lint_applet` to ensure strict syntax and import integrity.

### Functional Testing & Interaction Verification
- Verify navigation between all modules: Executive Cockpit, RFM Segmentation, Geo Intelligence, Retention Workflows, and Reports Studio.
- Verify RFM cell clicking filters the customer table with accurate counts and metric aggregations.
- Verify Geo Map territory clicks filter the account list and update region stats.
- Verify Customer Digital Twin opens with dynamic SHAP waterfall chart and complete journey timeline.
- Verify Retention Tasks can be updated (status transitions, owner assignment).
- Verify Reports Studio triggers CSV/Excel download and switches to printable executive dossier format.

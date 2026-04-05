# Murmura Labs — Legal Department

**Created:** April 3, 2026
**Status:** Pre-formation — assessing feasibility of spinoff
**Jurisdiction:** California (founder residence) / Massachusetts (Aretian HQ)

---

## Table of Contents

1. [Founder Employment Situation](#1-founder-employment-situation)
2. [IP Ownership Risk Assessment](#2-ip-ownership-risk-assessment)
3. [Spinoff Path](#3-spinoff-path)
4. [Data Licensing & Attribution](#4-data-licensing--attribution)
5. [Entity Formation](#5-entity-formation)
6. [Product Legal Requirements](#6-product-legal-requirements)
7. [Action Items](#7-action-items)

---

## 1. Founder Employment Situation

**Elijah Munn** — currently employed by / contracting for **Aretian Urban Analytics and Design**, Cambridge, MA.

### Signed Agreements (all Dec 5, 2023, MA law)

| Document | Key IP Provision | Post-Termination Restriction |
|----------|-----------------|------------------------------|
| NDA / Invention Assignment | All "Developments" related to Aretian's current or contemplated business assigned to Aretian — regardless of time/place of creation | 1-year non-solicitation of customers/employees |
| Independent Contractor Agreement | All "Work Product" from services belongs to Aretian (work-for-hire + assignment) | 2-year prohibition on working for Aretian customers/prospects |
| Offer Letter | Employment conditioned on signing the NDA | At-will employment |

### Current Status

- **Classification: Independent contractor** (not employee)
- [ ] Was a Prior Developments list attached to the NDA? (If not, no carve-out exists)
- [ ] Has any written approval been given for independent work in urban analytics?
- [ ] Is the relationship still active, or has it been terminated?

---

## 2. IP Ownership Risk Assessment

### The Core Problem

Aretian's business: urban analytics, city data platforms, software development for cities.
Murmura Labs' product: urban intelligence platform with scenario modeling for cities.

The **overlap is near-total** in domain terms.

### Invention Assignment Clause (NDA)

> All Developments made "at any time or times during my services... whether at any of your facilities or elsewhere and whether or not during normal business hours" that relate to Aretian's "current or contemplated business."

**Risk level: HIGH.** murmur.ai is an urban analytics platform. Aretian builds urban analytics platforms. Under the plain language, Aretian could claim ownership of murmur.ai IP.

### Work Product Clause (Contractor Agreement)

Assigns all documentation, algorithms, software, inventions, ideas, and written material "arising out of or resulting from performance of the agreement." Applied **retroactively** to all work since inception of relationship.

### Factors That May Mitigate

1. **CA Business & Professions Code 16600** — California is broadly hostile to non-competes. Work performed in CA may trigger CA protections despite MA choice-of-law clauses. A CA court could refuse to enforce the 2-year customer restriction.
2. **CA Labor Code 2870 may not apply** — Section 2870 protects *employees*, not independent contractors. As a contractor, this protection likely does not apply. This is a significant disadvantage of contractor status.
3. **MA Non-Compete Reform (2018)** — Limits non-competes for *employees* to 12 months with garden leave. As a contractor, these protections may not apply either. However, if you are functionally misclassified (doing employee-type work as a contractor), you could argue employee protections should apply.
4. **Misclassification argument** — The offer letter and contractor agreement were signed the same day. If your working relationship looks more like employment (set hours, Aretian controls how/when, exclusive engagement), the contractor label may not hold, which could unlock stronger employee protections under both CA and MA law.
5. **Scope of "arising from performance"** — The contractor agreement assigns work product "arising out of or resulting from performance of the agreement." Work done entirely outside Aretian's scope, on your own time and equipment, with no Aretian resources, has a stronger argument for falling outside this clause — but the NDA's broader "contemplated business" language is the harder one to escape.

### Factors That Increase Risk

1. No prior developments list was (likely) attached
2. Retroactive IP assignment clause in contractor agreement
3. murmur.ai uses similar tech stack, data sources, and analytical approaches as Aretian products
4. Statement of Work shows breadth of Aretian's "contemplated business" (London, Barcelona, Paris, Nashville, Cape Town — international urban analytics)

---

## 3. Spinoff Path

### Option A: Negotiated Separation (Preferred)

1. Approach Aretian leadership about spinning murmur.ai out
2. Negotiate IP assignment or license from Aretian to Murmura Labs
3. Define clear boundaries between Aretian's products and murmur.ai
4. Get written agreement releasing IP claims on murmur.ai codebase
5. Possible structures: equity stake for Aretian, licensing deal, clean separation with non-compete scope reduction

### Option B: Clean-Room Development (Fallback)

1. Terminate Aretian relationship
2. Wait out restriction periods (1-2 years depending on which clause applies)
3. Rebuild platform from scratch without using any Aretian-developed code, data, or methods
4. Document independent development thoroughly
5. Risk: Aretian could still argue the concepts/approach were developed during engagement

### Option C: Continue as Internal Project

1. Develop murmur.ai as an Aretian product line
2. Negotiate internal ownership/equity/revenue share
3. Lower legal risk but less founder control

---

## 4. Data Licensing & Attribution

All data sources used in murmur.ai and their licensing status:

| Source | License | Commercial Use | Attribution Required | Notes |
|--------|---------|---------------|---------------------|-------|
| ACS 5-Year (Census) | Public domain | Yes | Recommended | US Census Bureau |
| CalEnviroScreen 4.0 | Public domain | Yes | Required | CA OEHHA |
| CDC PLACES | Public domain | Yes | Required | CDC / Robert Wood Johnson Foundation |
| Zillow ZHVI | Zillow license terms | Review needed | Yes | May require Zillow API agreement for commercial use |
| GTFS Transit | Varies by agency | Generally yes | Varies | Check per-agency terms |
| EPA Smart Location | Public domain | Yes | Recommended | US EPA |
| OpenStreetMap | ODbL 1.0 | Yes | Required ("© OpenStreetMap contributors") | Share-alike for derivative databases |
| CDE Schools | Public domain | Yes | Recommended | CA Dept of Education |

### Action Items — Data

- [ ] Review Zillow ZHVI terms for commercial platform use
- [ ] Confirm GTFS terms for each transit agency (AC Transit, BART, WETA, etc.)
- [ ] Ensure OSM attribution is visible in product UI
- [ ] Document all data pipelines for provenance tracking

---

## 5. Entity Formation

### When Ready to Incorporate

| Decision | Options | Notes |
|----------|---------|-------|
| Entity type | Delaware C-Corp (standard for VC), CA LLC (simpler) | C-Corp if seeking investment |
| State | Delaware (incorporation) + CA (qualification) | Standard startup setup |
| Trademark | "murmur" / "murmur.ai" / "Murmura Labs" | Search USPTO before filing |
| Domain | murmuralabs.com (owned), murmur.ai (status?) | Confirm ownership/renewal |

### Pre-Formation Checklist

- [ ] Resolve Aretian IP situation (Section 2) — **blocker**
- [ ] Trademark search for "murmur" in software/analytics classes
- [ ] Confirm domain ownership and registrar accounts
- [ ] Draft founders agreement (if co-founders)
- [ ] Open business bank account
- [ ] EIN application

---

## 6. Product Legal Requirements

### Before Public Launch

- [ ] Terms of Service — platform usage, liability limitations
- [ ] Privacy Policy — data collection, cookies, analytics
- [ ] Disclaimer — scenario analysis outputs are informational, not policy recommendations or professional advice
- [ ] Accessibility statement (if targeting government contracts, Section 508 compliance)
- [ ] Data processing agreements (if handling PII for city clients)

### Government Contracting

If selling to cities/municipalities:
- [ ] SAM.gov registration
- [ ] DUNS number
- [ ] Insurance requirements (E&O, general liability, cyber)
- [ ] Data security requirements per jurisdiction
- [ ] Compliance with local procurement rules (Richmond, CA)

---

## 7. Session Log

### April 3, 2026 — Initial Legal Review

Reviewed all five Aretian contracts (`~/Desktop/contracts/`). Key findings:

1. **Contractor status confirmed.** Elijah is classified as an independent contractor, not an employee. Both the NDA/Invention Assignment and Independent Contractor Agreement were signed Dec 5, 2023, alongside an offer letter — unusual overlap.

2. **IP assignment is broad and overlapping.** Two clauses capture IP:
   - NDA: all "Developments" related to Aretian's "current or contemplated business" — regardless of time, place, or equipment used
   - Contractor Agreement: all "Work Product" arising from performance — with retroactive application to all prior work

3. **No side-project carve-out exists.** Neither agreement provides a mechanism for independent work in related domains without Aretian's written approval.

4. **Contractor status is a double-edged sword:**
   - CA Labor Code 2870 (protects employee side projects) likely does NOT apply to contractors
   - MA Non-Compete Reform (12-month cap) also only protects employees
   - However, the contractor agreement's "arising from performance" scope is narrower than the NDA's "contemplated business" language
   - Misclassification argument is viable — offer letter + contractor agreement on same day, plus the nature of the working relationship

5. **Post-termination restrictions:**
   - NDA: 1-year non-solicitation of Aretian customers/employees
   - Contractor Agreement: 2-year prohibition on working for Aretian customers/prospects
   - CA Bus. & Prof. Code 16600 (anti-non-compete) could limit enforceability if litigated in CA

6. **murmur.ai overlap with Aretian is near-total** in domain terms (urban analytics, city data platforms, scenario modeling). This is the central risk.

7. **Data licensing:** Most sources are public domain. Zillow ZHVI terms need review for commercial use. OSM requires ODbL attribution in product UI.

**Bottom line:** Before any public activity or spinoff, need (a) attorney consultation on Aretian IP overlap, and (b) determination of whether a Prior Developments list was ever filed with the NDA.

---

## 8. Action Items — Priority Order

### Immediate (Before Any Public Activity)

1. **Consult a CA/MA employment attorney** about the Aretian IP overlap — this is the single biggest legal risk
2. **Determine if Prior Developments list was filed** with the NDA
3. ~~Get clarity on employee vs. contractor status~~ — **Confirmed: contractor**

### Before Spinoff

4. Negotiate written IP release or license from Aretian
5. File trademark application for "murmur" / "Murmura Labs"
6. Incorporate entity
7. Review Zillow data licensing for commercial use

### Before Public Launch

8. Draft Terms of Service and Privacy Policy
9. Add data attribution to product (especially OSM ODbL requirement)
10. Obtain appropriate insurance
11. Draft standard city government pilot agreement template

---

## Reference: Contract Files

Located at `~/Desktop/contracts/`:
- `Eli Munn Job Description - Urban Analytics and Software Development Consultant - 2023.docx`
- `Elijah Aretian Employee-Contractor NDA 6-4-2019_1136871.docx`
- `Elijah Aretian Statement of Work Template.docx`
- `Elijah Munn Aretian Agreement to Hire Contractor 05-12-2023 GU_1159715.docx`
- `Elijah Munn Aretian Standard Exempt Offer Letter 05-12-2023 1236750-v3.docx`

---

*This document is an internal planning reference, not legal advice. Consult qualified legal counsel before making decisions based on this analysis.*

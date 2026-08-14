import type { AiCrime } from "@/types";

/**
 * AI-enabled technique taxonomy mapped to the statutes that (may) reach it.
 *
 * ⚠️ All records `needs-review`. The `analogical` mappings are the most
 * contestable content in the product — they assert that a provision drafted
 * before the technique existed can be stretched to cover it, which is an
 * argument, not a fact. Rationales are written so the argument can be attacked.
 *
 * Technical profiles are defensive framing only: what the technique is and how
 * defenders recognise it, never how to execute it. docs/phases.md Phase 6.
 */
const V = {
  lastVerified: "2026-08-15",
  verification: "needs-review",
} as const;

export const aiCrimes: AiCrime[] = [
  {
    ...V,
    id: "polymorphic-malware",
    slug: "polymorphic-malware",
    name: "Polymorphic and self-modifying malware",
    shortName: "Polymorphic malware",
    severity: "critical",
    prevalence: "emerging",
    summary:
      "Malicious code that uses generative models to rewrite its own structure between infections, defeating signature-based detection while preserving function.",
    technicalProfile: {
      howItWorks:
        "A generative model regenerates the payload's implementation on each deployment — different control flow, identifiers and packing, identical behaviour. Because no two samples share a signature, detection has to shift to behavioural and runtime indicators.",
      indicators: [
        "Behaviourally identical samples with no shared static signature",
        "Unusually high sample entropy variance across a single campaign",
        "Runtime code generation or self-rewriting in memory",
        "Outbound calls to model-inference endpoints from non-AI workloads",
      ],
    },
    mappings: [
      { jurisdictionCode: "UK", coverage: "direct", statute: "Computer Misuse Act 1990", section: "s. 3 / s. 3A", penaltyNote: "Up to 10 years for unauthorised acts impairing operation; supply of articles for use in offences separately criminalised.", rationale: "Section 3 is drafted around the unauthorised act and its effect, not the tool used, so self-modification is legally irrelevant. Section 3A reaches the tooling itself.", sources: [{ sourceId: "uk-cma-1990", pinpoint: "ss. 3, 3A" }] },
      { jurisdictionCode: "US", coverage: "direct", statute: "Computer Fraud and Abuse Act", section: "18 U.S.C. § 1030(a)(5)", penaltyNote: "Up to 10 years, higher on repeat offences.", rationale: "Knowingly causing transmission of a program that intentionally damages a protected computer. The generative provenance of the code changes nothing in the elements.", sources: [{ sourceId: "us-cfaa", pinpoint: "§ 1030(a)(5)" }] },
      { jurisdictionCode: "EU", coverage: "direct", statute: "Directive 2013/40/EU", section: "Arts. 4–5, 7", rationale: "System and data interference offences are technology-neutral; Article 7 covers tools produced for the purpose of committing them.", sources: [{ sourceId: "eu-dir-2013-40" }] },
      { jurisdictionCode: "IN", coverage: "direct", statute: "Information Technology Act, 2000", section: "ss. 43(c), 66", rationale: "Introducing computer contaminants or viruses is expressly covered; s. 66 supplies the criminal penalty.", sources: [{ sourceId: "in-it-act-2000", pinpoint: "ss. 43, 66" }] },
      { jurisdictionCode: "SG", coverage: "direct", statute: "Computer Misuse Act 1993", section: "s. 5", rationale: "Unauthorised modification of computer material, with enhanced penalties where protected computers are affected.", sources: [{ sourceId: "sg-cma" }] },
      { jurisdictionCode: "CN", coverage: "direct", statute: "Cybersecurity Law", section: "Arts. 27, 46", rationale: "Prohibits providing programs and tools dedicated to endangering network security, alongside criminal law provisions on destructive programs.", sources: [{ sourceId: "cn-csl" }] },
      { jurisdictionCode: "AU", coverage: "direct", statute: "Criminal Code Act 1995 (Cth), Part 10.7", rationale: "Unauthorised modification of data causing impairment is a serious computer offence; the SOCI Act adds reporting duties for affected critical assets.", sources: [{ sourceId: "au-soci" }] },
      { jurisdictionCode: "JP", coverage: "analogical", statute: "Penal Code — electromagnetic record offences", rationale: "Provisions on creating or providing unauthorised commands were drafted for conventional malware. They plausibly extend, but self-modifying code raises unsettled questions about the requisite intent at the point of creation.", sources: [{ sourceId: "jp-unauthorized-access" }] },
      { jurisdictionCode: "BR", coverage: "analogical", statute: "Código Penal, art. 154-A", rationale: "Invasion of a computer device with intent to obtain, tamper with or destroy data. Reaches the outcome, but was not drafted with autonomously mutating payloads in mind.", sources: [{ sourceId: "br-marco-civil" }] },
      { jurisdictionCode: "AE", coverage: "analogical", statute: "Federal Decree-Law No. 34 of 2021", rationale: "Broad offences covering damage to information systems and dissemination of harmful programs. Coverage is likely but the specific provision and penalty band are not established.", sources: [{ sourceId: "ae-cybercrime" }] },
    ],
    sources: [{ sourceId: "uk-cma-1990" }, { sourceId: "us-cfaa" }],
  },

  {
    ...V,
    id: "deepfake-identity-fraud",
    slug: "deepfake-identity-fraud",
    name: "Deepfakes and synthetic identity fraud",
    shortName: "Deepfakes",
    severity: "critical",
    prevalence: "widespread",
    summary:
      "Synthetic audio, video or documentation used to impersonate a real person — most consequentially in payment authorisation, executive impersonation and identity verification bypass.",
    technicalProfile: {
      howItWorks:
        "A model trained on public likeness or voice data produces synthetic media convincing enough to defeat human verification and, increasingly, liveness checks. The attack is usually social rather than technical: the artefact exists to make an ordinary authorisation request seem legitimate.",
      indicators: [
        "Payment or credential requests arriving over voice or video outside normal process",
        "Liveness-check anomalies: inconsistent lighting, blink cadence, audio-visual desync",
        "Urgency framing combined with a request to bypass an existing control",
        "Verification requests from a channel not previously used by that individual",
      ],
    },
    mappings: [
      { jurisdictionCode: "EU", coverage: "direct", statute: "Regulation (EU) 2024/1689 (AI Act)", section: "Art. 50", penaltyNote: "Transparency obligations enforced through the Regulation's penalty regime.", rationale: "Deployers of systems generating deepfakes must disclose that the content is artificially generated or manipulated — the clearest direct provision in any tracked jurisdiction.", sources: [{ sourceId: "eu-ai-act", pinpoint: "Art. 50" }] },
      { jurisdictionCode: "CN", coverage: "direct", statute: "Deep Synthesis Provisions", rationale: "Deep synthesis services must label synthetic content and verify user identity, with filing requirements for providers.", sources: [{ sourceId: "cn-cac" }] },
      { jurisdictionCode: "IN", coverage: "analogical", statute: "Information Technology Act, 2000", section: "ss. 66C, 66D", rationale: "Identity theft and cheating by personation using a computer resource. Fits the fraud use but was drafted for stolen credentials, not generated likeness; the harm to the impersonated person is not squarely addressed.", sources: [{ sourceId: "in-it-act-2000", pinpoint: "ss. 66C, 66D" }] },
      { jurisdictionCode: "US", coverage: "analogical", statute: "18 U.S.C. § 1028 / wire fraud", rationale: "Prosecuted as identity or wire fraud where a scheme to defraud exists. There is no general federal synthetic-media statute, so non-fraudulent impersonation may fall outside federal reach; state law varies.", sources: [{ sourceId: "us-cfaa" }] },
      { jurisdictionCode: "UK", coverage: "analogical", statute: "Fraud Act 2006 — fraud by false representation", rationale: "Reaches the fraudulent use cleanly. Coverage of non-fraudulent impersonation is patchier and depends on other offences.", sources: [{ sourceId: "uk-cma-1990" }] },
      { jurisdictionCode: "AE", coverage: "analogical", statute: "Federal Decree-Law No. 34 of 2021", rationale: "Broad provisions on forgery, impersonation and dissemination of false information online are capable of reaching synthetic media; specific pinpoint not established.", sources: [{ sourceId: "ae-cybercrime" }] },
      { jurisdictionCode: "SG", coverage: "analogical", statute: "Penal Code cheating provisions; PDPA", rationale: "Fraud framing applies. Election-specific synthetic media rules exist separately and are narrower than a general provision.", sources: [{ sourceId: "sg-pdpa" }] },
      { jurisdictionCode: "AU", coverage: "analogical", statute: "Criminal Code Act 1995 (Cth)", rationale: "Fraud and carriage-service-misuse offences apply to deceptive use; there is no horizontal synthetic-media disclosure duty in force.", sources: [{ sourceId: "au-privacy-act" }] },
      { jurisdictionCode: "BR", coverage: "not-researched", rationale: "Electoral rules address synthetic media in campaign contexts; the general criminal position has not been established.", sources: [] },
      { jurisdictionCode: "JP", coverage: "not-researched", rationale: "Fraud and defamation provisions likely apply, but no specific analysis has been carried out.", sources: [] },
    ],
    sources: [{ sourceId: "eu-ai-act" }],
  },

  {
    ...V,
    id: "model-poisoning",
    slug: "model-poisoning",
    name: "Model poisoning and training-data attacks",
    shortName: "Model poisoning",
    severity: "high",
    prevalence: "emerging",
    summary:
      "Corrupting a model's behaviour by manipulating its training data, fine-tuning inputs or retrieval corpus — including targeted backdoors that activate only on a chosen trigger.",
    technicalProfile: {
      howItWorks:
        "An attacker introduces crafted examples into a corpus the target will train or fine-tune on, or into a retrieval index it queries at inference. The resulting model behaves normally except on inputs matching the trigger. Because the artefact is data rather than code, it frequently bypasses controls designed for software supply chains.",
      indicators: [
        "Behavioural divergence between checkpoints with no corresponding code change",
        "Anomalous contributions to open datasets or retrieval sources shortly before a training run",
        "Trigger-conditional output that evaluation sets do not surface",
        "Provenance gaps in the training-data supply chain",
      ],
    },
    mappings: [
      { jurisdictionCode: "EU", coverage: "direct", statute: "Regulation (EU) 2024/1689 (AI Act)", section: "Arts. 10, 15", rationale: "High-risk systems must meet data-governance and accuracy/robustness requirements including resilience against attempts to manipulate training data — the only tracked regime that names the attack class.", sources: [{ sourceId: "eu-ai-act", pinpoint: "Arts. 10, 15" }] },
      { jurisdictionCode: "UK", coverage: "analogical", statute: "Computer Misuse Act 1990", section: "s. 3", rationale: "If poisoning involves unauthorised modification of data held in a computer, s. 3 applies. Where the data was contributed to a public corpus the attacker was permitted to write to, 'unauthorised' becomes genuinely difficult to establish.", sources: [{ sourceId: "uk-cma-1990", pinpoint: "s. 3" }] },
      { jurisdictionCode: "US", coverage: "analogical", statute: "18 U.S.C. § 1030(a)(5)", rationale: "Requires damage to a protected computer without authorisation. Contributing crafted data through a public, permitted channel sits awkwardly against the authorisation element.", sources: [{ sourceId: "us-cfaa" }] },
      { jurisdictionCode: "CN", coverage: "direct", statute: "Generative AI Interim Measures", rationale: "Providers bear responsibility for the legality of training data and the outputs produced, which imports a supply-chain integrity duty.", sources: [{ sourceId: "cn-cac" }] },
      { jurisdictionCode: "SG", coverage: "analogical", statute: "Computer Misuse Act 1993", section: "s. 5", rationale: "Unauthorised modification framing applies where the attacker writes to a system they had no right to alter.", sources: [{ sourceId: "sg-cma" }] },
      { jurisdictionCode: "IN", coverage: "analogical", statute: "Information Technology Act, 2000", section: "s. 43(i)", rationale: "Destroying, deleting or altering information residing in a computer resource diminishing its value. Reaches the effect; the authorisation problem is the same as elsewhere.", sources: [{ sourceId: "in-it-act-2000" }] },
      { jurisdictionCode: "AU", coverage: "no-coverage", rationale: "Computer offences require unauthorised modification of data. Where poisoning occurs entirely through permitted contributions to a public corpus, no tracked Australian provision clearly bites.", sources: [] },
      { jurisdictionCode: "JP", coverage: "no-coverage", rationale: "The Unauthorized Access Act is keyed to access-control circumvention, which a training-data attack does not involve.", sources: [] },
      { jurisdictionCode: "BR", coverage: "not-researched", rationale: "Not established.", sources: [] },
      { jurisdictionCode: "AE", coverage: "not-researched", rationale: "Not established.", sources: [] },
    ],
    sources: [{ sourceId: "eu-ai-act" }],
  },

  {
    ...V,
    id: "prompt-injection",
    slug: "prompt-injection",
    name: "Prompt injection and agent hijacking",
    shortName: "Prompt injection",
    severity: "high",
    prevalence: "widespread",
    summary:
      "Instructions embedded in content an AI agent processes, causing it to take actions on the attacker's behalf using the victim's own credentials and permissions.",
    technicalProfile: {
      howItWorks:
        "An agent that reads untrusted content — a web page, document or email — encounters text crafted to be interpreted as instruction rather than data. Because the agent acts with legitimately-issued credentials, the resulting actions are technically authorised, which is precisely what makes the legal analysis hard.",
      indicators: [
        "Agent actions inconsistent with the user's stated task",
        "Tool calls or data egress immediately after ingesting untrusted content",
        "Instruction-like text in retrieved documents, page metadata or alt text",
        "Privilege use that is legitimate per-credential but anomalous in sequence",
      ],
    },
    mappings: [
      { jurisdictionCode: "UK", coverage: "analogical", statute: "Computer Misuse Act 1990", section: "s. 1", rationale: "The central difficulty across every jurisdiction: the agent's access is authorised. Liability turns on whether inducing an authorised agent to act is itself 'causing a computer to perform a function to secure unauthorised access' — untested.", sources: [{ sourceId: "uk-cma-1990", pinpoint: "s. 1" }] },
      { jurisdictionCode: "US", coverage: "analogical", statute: "18 U.S.C. § 1030(a)(2)", rationale: "Post-Van Buren, 'exceeds authorised access' is read narrowly around gate-based limits. An agent induced to misuse access it legitimately holds does not sit comfortably inside that reading.", sources: [{ sourceId: "us-cfaa" }] },
      { jurisdictionCode: "EU", coverage: "analogical", statute: "Directive 2013/40/EU; AI Act Art. 15", rationale: "Illegal access is drafted around access 'without right'. The AI Act's robustness requirements impose a defensive duty on high-risk providers, which is a different thing from criminalising the attacker.", sources: [{ sourceId: "eu-dir-2013-40" }, { sourceId: "eu-ai-act", pinpoint: "Art. 15" }] },
      { jurisdictionCode: "SG", coverage: "analogical", statute: "Computer Misuse Act 1993", section: "s. 3", rationale: "Unauthorised access framing carries the same agent-authorisation problem.", sources: [{ sourceId: "sg-cma" }] },
      { jurisdictionCode: "IN", coverage: "analogical", statute: "Information Technology Act, 2000", section: "s. 43(a)", rationale: "Accessing a computer resource without permission of the owner. Whether the agent's own permission cures the attacker's lack of it is unsettled.", sources: [{ sourceId: "in-it-act-2000" }] },
      { jurisdictionCode: "CN", coverage: "analogical", statute: "Cybersecurity Law", section: "Art. 27", rationale: "Broad prohibition on activities endangering network security is capable of reaching the conduct without needing an authorisation analysis.", sources: [{ sourceId: "cn-csl" }] },
      { jurisdictionCode: "AU", coverage: "no-coverage", rationale: "Serious computer offences require unauthorised access, modification or impairment. Where every action is performed by a properly-credentialled agent, no tracked provision clearly applies.", sources: [] },
      { jurisdictionCode: "JP", coverage: "no-coverage", rationale: "The Unauthorized Access Act targets circumvention of access controls; no control is circumvented here.", sources: [] },
      { jurisdictionCode: "BR", coverage: "no-coverage", rationale: "Article 154-A requires invasion of a device by violating a security mechanism, which prompt injection does not involve.", sources: [] },
      { jurisdictionCode: "AE", coverage: "not-researched", rationale: "Not established.", sources: [] },
    ],
    sources: [{ sourceId: "us-cfaa" }, { sourceId: "eu-ai-act" }],
  },

  {
    ...V,
    id: "automated-social-engineering",
    slug: "automated-social-engineering",
    name: "Automated social engineering swarms",
    shortName: "Social engineering swarms",
    severity: "high",
    prevalence: "widespread",
    summary:
      "Large-scale, individually-personalised social engineering generated and orchestrated by models, collapsing the cost difference between mass phishing and targeted spear-phishing.",
    technicalProfile: {
      howItWorks:
        "Public data is used to generate per-target pretexts at scale, often sustained across multiple channels and several exchanges before any payload appears. The traditional detection heuristics — poor language, generic framing, a single suspicious link — are exactly the signals this removes.",
      indicators: [
        "High-volume campaigns with low template similarity between messages",
        "Multi-channel pretexting referencing genuine organisational detail",
        "Conversational persistence: several benign exchanges before any request",
        "Sender infrastructure churn outpacing content reuse",
      ],
    },
    mappings: [
      { jurisdictionCode: "US", coverage: "direct", statute: "18 U.S.C. § 1343 (wire fraud); CAN-SPAM", rationale: "Fraud statutes are outcome-based and indifferent to whether a model drafted the message.", sources: [{ sourceId: "us-cfaa" }] },
      { jurisdictionCode: "UK", coverage: "direct", statute: "Fraud Act 2006", section: "s. 2", rationale: "Fraud by false representation covers the pretext directly; scale is an aggravating factor, not a coverage gap.", sources: [{ sourceId: "uk-cma-1990" }] },
      { jurisdictionCode: "IN", coverage: "direct", statute: "Information Technology Act, 2000", section: "s. 66D", rationale: "Cheating by personation using a computer resource maps cleanly onto automated pretexting.", sources: [{ sourceId: "in-it-act-2000", pinpoint: "s. 66D" }] },
      { jurisdictionCode: "SG", coverage: "direct", statute: "Penal Code cheating provisions", rationale: "Cheating and related offences apply regardless of how the pretext was authored.", sources: [{ sourceId: "sg-cma" }] },
      { jurisdictionCode: "AE", coverage: "direct", statute: "Federal Decree-Law No. 34 of 2021", rationale: "Online fraud and impersonation offences are broadly drawn and reach automated campaigns.", sources: [{ sourceId: "ae-cybercrime" }] },
      { jurisdictionCode: "EU", coverage: "analogical", statute: "National fraud law; Directive 2013/40/EU", rationale: "Fraud is not harmonised at EU level, so coverage is a Member State question. The AI Act's transparency duties bear on the tooling, not the fraud.", sources: [{ sourceId: "eu-dir-2013-40" }] },
      { jurisdictionCode: "AU", coverage: "direct", statute: "Criminal Code Act 1995 (Cth), Part 10.8", rationale: "Identity-crime and carriage-service offences cover automated fraudulent communication.", sources: [{ sourceId: "au-privacy-act" }] },
      { jurisdictionCode: "CN", coverage: "direct", statute: "Cybersecurity Law; Anti-Telecom Fraud Law", rationale: "Dedicated telecom-fraud legislation imposes duties on operators as well as criminalising the conduct.", sources: [{ sourceId: "cn-csl" }] },
      { jurisdictionCode: "JP", coverage: "analogical", statute: "Penal Code fraud provisions", rationale: "General fraud provisions apply; no AI-specific aggravation has been established.", sources: [{ sourceId: "jp-appi" }] },
      { jurisdictionCode: "BR", coverage: "analogical", statute: "Código Penal, art. 171-A", rationale: "Electronic fraud provisions apply to the outcome; automation is not separately addressed.", sources: [{ sourceId: "br-marco-civil" }] },
    ],
    sources: [{ sourceId: "us-cfaa" }],
  },

  {
    ...V,
    id: "autonomous-exploitation",
    slug: "autonomous-exploitation",
    name: "Autonomous vulnerability discovery and exploitation",
    shortName: "Autonomous exploitation",
    severity: "critical",
    prevalence: "emerging",
    summary:
      "Agentic systems that find, weaponise and exploit vulnerabilities with little or no human direction, compressing the window between disclosure and exploitation.",
    technicalProfile: {
      howItWorks:
        "An agent chains reconnaissance, candidate-vulnerability analysis and exploitation attempts without per-step human input. The defensive consequence is temporal: patch windows measured in days stop being viable when the discovery-to-exploitation cycle runs in hours.",
      indicators: [
        "Exploitation attempts appearing unusually soon after public disclosure",
        "Reconnaissance breadth inconsistent with human-paced operation",
        "Systematic variation of exploit parameters without manual pacing",
        "Attack chains that adapt mid-sequence to defensive responses",
      ],
    },
    mappings: [
      { jurisdictionCode: "US", coverage: "direct", statute: "Computer Fraud and Abuse Act", section: "18 U.S.C. § 1030", rationale: "Access and damage offences are indifferent to whether a human or an agent performed the act; the operator's intent supplies the mental element.", sources: [{ sourceId: "us-cfaa" }] },
      { jurisdictionCode: "UK", coverage: "direct", statute: "Computer Misuse Act 1990", section: "ss. 1–3A", rationale: "Causing a computer to perform a function to secure unauthorised access covers deploying an autonomous agent to do so.", sources: [{ sourceId: "uk-cma-1990" }] },
      { jurisdictionCode: "EU", coverage: "direct", statute: "Directive 2013/40/EU", section: "Arts. 3, 7", rationale: "Illegal access plus the tools offence reaches both the conduct and the agent as an instrument.", sources: [{ sourceId: "eu-dir-2013-40" }] },
      { jurisdictionCode: "SG", coverage: "direct", statute: "Computer Misuse Act 1993", section: "ss. 3, 6", rationale: "Unauthorised access and the offence of supplying means to commit it both apply.", sources: [{ sourceId: "sg-cma" }] },
      { jurisdictionCode: "IN", coverage: "direct", statute: "Information Technology Act, 2000", section: "ss. 43, 66", rationale: "Unauthorised access and downloading provisions cover agent-driven activity.", sources: [{ sourceId: "in-it-act-2000" }] },
      { jurisdictionCode: "AU", coverage: "direct", statute: "Criminal Code Act 1995 (Cth), Part 10.7", rationale: "Unauthorised access with intent to commit a serious offence applies to autonomous tooling.", sources: [{ sourceId: "au-soci" }] },
      { jurisdictionCode: "CN", coverage: "direct", statute: "Cybersecurity Law", section: "Art. 27", rationale: "Intrusion and provision of intrusion tools are both prohibited.", sources: [{ sourceId: "cn-csl" }] },
      { jurisdictionCode: "JP", coverage: "direct", statute: "Act on Prohibition of Unauthorized Computer Access", rationale: "Circumvention of access-control functions is squarely covered.", sources: [{ sourceId: "jp-unauthorized-access" }] },
      { jurisdictionCode: "AE", coverage: "analogical", statute: "Federal Decree-Law No. 34 of 2021", rationale: "Unauthorised access provisions apply; the specific band for autonomous tooling is not established.", sources: [{ sourceId: "ae-cybercrime" }] },
      { jurisdictionCode: "BR", coverage: "analogical", statute: "Código Penal, art. 154-A", rationale: "Requires violation of a security mechanism, which most but not all autonomous exploitation involves.", sources: [{ sourceId: "br-marco-civil" }] },
    ],
    sources: [{ sourceId: "us-cfaa" }, { sourceId: "uk-cma-1990" }],
  },
];

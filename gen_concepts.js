const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, TableOfContents,
  LevelFormat
} = require('C:/Users/Acer/AppData/Roaming/npm/node_modules/docx');
const fs = require('fs');

// ── Palette ────────────────────────────────────────────────────────────────
const C = {
  darkBlue:  "1F3864", midBlue:   "2E75B6", teal:     "1A6B6B",
  lightBlue: "D6E4F0", gray:      "F2F7FB", white:    "FFFFFF",
  greenBg:   "C6EFCE", greenFg:   "276221", orange:   "C55A11",
  purple:    "7030A0", redBg:     "FFD7D7", yellowBg: "FFF2CC",
  codeBg:    "1E2A38", codeText:  "A8D8A8", codeYellow:"F9E784",
  darkText:  "1A1A2E"
};

const bdr = { style: BorderStyle.SINGLE, size: 1, color: "AECBDF" };
const cellBorders = { top: bdr, bottom: bdr, left: bdr, right: bdr };

// ── Helpers ────────────────────────────────────────────────────────────────
function hCell(text, w, bg) {
  return new TableCell({
    borders: cellBorders, width: { size: w, type: WidthType.DXA },
    shading: { fill: bg || C.darkBlue, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: C.white, font: "Arial", size: 18 })] })]
  });
}
function dCell(text, w, bg, bold, color) {
  return new TableCell({
    borders: cellBorders, width: { size: w, type: WidthType.DXA },
    shading: { fill: bg || C.white, type: ShadingType.CLEAR },
    margins: { top: 72, bottom: 72, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: text||"", bold:!!bold, color:color||"111111", font:"Arial", size:18 })] })]
  });
}
const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing:{ before:400, after:140 },
  children:[new TextRun({ text:t, bold:true, color:C.darkBlue, font:"Arial", size:34 })] });
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing:{ before:280, after:100 },
  children:[new TextRun({ text:t, bold:true, color:C.midBlue, font:"Arial", size:26 })] });
const H3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, spacing:{ before:200, after:80 },
  children:[new TextRun({ text:t, bold:true, color:C.teal, font:"Arial", size:22 })] });
const P  = (text, opts) => new Paragraph({ spacing:{ before:60, after:80 },
  children:[new TextRun({ text, font:"Arial", size:20, ...(opts||{}) })] });
const PI = text => new Paragraph({ spacing:{ before:40, after:40 },
  children:[new TextRun({ text, font:"Arial", size:20, italics:true, color:"444444" })] });
const PB = text => new Paragraph({ spacing:{ before:60, after:80 },
  children:[new TextRun({ text, font:"Arial", size:20, bold:true, color:C.darkBlue })] });
const CODE = t => new Paragraph({ spacing:{before:0,after:0},
  shading:{ fill:C.codeBg, type:ShadingType.CLEAR },
  children:[new TextRun({ text, font:"Courier New", size:18, color:C.codeText })] });
const CODEY = t => new Paragraph({ spacing:{before:0,after:0},
  shading:{ fill:C.codeBg, type:ShadingType.CLEAR },
  children:[new TextRun({ text, font:"Courier New", size:18, color:C.codeYellow })] });
const BL = (t, ref) => new Paragraph({ numbering:{ reference:ref||"bul", level:0 }, spacing:{before:40,after:40},
  children:[new TextRun({ text:t, font:"Arial", size:20 })] });
const NL = (t, ref) => new Paragraph({ numbering:{ reference:ref||"num", level:0 }, spacing:{before:40,after:40},
  children:[new TextRun({ text:t, font:"Arial", size:20 })] });
const SP = () => new Paragraph({ spacing:{before:100,after:100}, children:[new TextRun("")] });
const PB_ = () => new Paragraph({ children:[new PageBreak()] });
const HR = () => new Paragraph({ spacing:{before:120,after:120},
  border:{ bottom:{ style:BorderStyle.SINGLE, size:6, color:C.midBlue, space:1 } },
  children:[new TextRun("")] });

// Callout box — shaded info panel
const callout = (label, text, bg, fc) => new Table({
  width:{ size:9360, type:WidthType.DXA }, columnWidths:[9360],
  rows:[new TableRow({ children:[new TableCell({
    borders:cellBorders, width:{ size:9360, type:WidthType.DXA },
    shading:{ fill:bg||C.lightBlue, type:ShadingType.CLEAR },
    margins:{ top:120, bottom:120, left:200, right:200 },
    children:[
      new Paragraph({ spacing:{before:0,after:60}, children:[new TextRun({ text:label, bold:true, font:"Arial", size:20, color:fc||C.darkBlue })] }),
      new Paragraph({ spacing:{before:0,after:0}, children:[new TextRun({ text, font:"Arial", size:19, color:"222222" })] })
    ]
  })] })]
});

// ════════════════════════════════════════════════════════════════════════════
//  BUILD SECTIONS
// ════════════════════════════════════════════════════════════════════════════

// ── TITLE PAGE ──────────────────────────────────────────────────────────────
const titlePage = [
  new Paragraph({ spacing:{before:2400,after:0}, alignment:AlignmentType.CENTER,
    children:[new TextRun({ text:"AIOps-Care", bold:true, font:"Arial", size:80, color:C.darkBlue })] }),
  new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:60,after:160},
    children:[new TextRun({ text:"Complete Technology Concepts & Deep Understanding", bold:true, font:"Arial", size:36, color:C.midBlue })] }),
  new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:0,after:80},
    children:[new TextRun({ text:"From First Principles: EC2 • Kafka • ML • Kaggle • Security • Observability", font:"Arial", size:24, color:C.teal, italics:true })] }),
  SP(),
  new Table({ width:{size:7200,type:WidthType.DXA}, columnWidths:[7200],
    rows:[new TableRow({ children:[new TableCell({
      borders:cellBorders, width:{size:7200,type:WidthType.DXA},
      shading:{ fill:C.lightBlue, type:ShadingType.CLEAR },
      margins:{top:200,bottom:200,left:300,right:300},
      children:[
        new Paragraph({ alignment:AlignmentType.CENTER, children:[new TextRun({ text:"Muhammad Raees  —  DAIOL6  Final Year Project", bold:true, font:"Arial", size:22, color:C.darkBlue })] }),
        new Paragraph({ alignment:AlignmentType.CENTER, spacing:{before:60,after:0}, children:[new TextRun({ text:"Status: Phase 1 of 10 — Local Prototype  |  May 2026", font:"Arial", size:20, color:"444444" })] }),
      ]
    })] })]
  }),
  PB_()
];

// ── TOC ──────────────────────────────────────────────────────────────────────
const tocSection = [
  H1("Table of Contents"),
  new TableOfContents("Contents", { hyperlink:true, headingStyleRange:"1-3" }),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 1 — WHAT IS AIOPS & WHY HEALTHCARE
// ════════════════════════════════════════════════════════════════════════════
const s1 = [
  H1("1. What Is AIOps — and Why Healthcare ICU?"),
  H2("1.1  AIOps Defined"),
  P("AIOps stands for Artificial Intelligence for IT Operations. It is the practice of using machine learning, data analytics, and event-driven automation to enhance, automate, and augment IT operational processes. The term was coined by Gartner in 2017."),
  P("In traditional IT operations, engineers monitor dashboards, read log files, and respond to alerts manually. AIOps replaces or augments this with AI models that can:"),
  BL("Detect anomalies in high-volume data streams automatically"),
  BL("Correlate events across multiple systems to find root causes"),
  BL("Predict failures before they occur (proactive vs reactive)"),
  BL("Reduce alert noise through intelligent deduplication and fusion"),
  BL("Trigger automated remediation actions"),
  SP(),
  H2("1.2  Why Apply AIOps to ICU Patient Monitoring?"),
  P("The Intensive Care Unit (ICU) is one of the most data-rich environments in medicine. A single ICU patient generates thousands of data points per hour — heart rate, blood pressure, oxygen saturation, temperature, respiratory rate, neurological scores. Yet clinical staff cannot watch every number for every patient simultaneously."),
  P("Three critical problems make ICU monitoring an ideal AIOps use case:"),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2600,6760],
    rows:[
      new TableRow({ children:[hCell("Problem",2600), hCell("Detail",6760)] }),
      new TableRow({ children:[dCell("Early Warning",2600,C.gray,true), dCell("Subtle deterioration in vital signs begins 6–8 hours before cardiac arrest. The pattern is detectable by ML but too subtle for a human to spot in real-time across many patients.",6760,C.gray)] }),
      new TableRow({ children:[dCell("Alarm Fatigue",2600,C.white,true), dCell("Studies show 85–99% of ICU alarms are false positives. Nurses become desensitised and start ignoring alarms — leading to missed real emergencies. AIOps reduces noise through intelligent fusion.",6760,C.white)] }),
      new TableRow({ children:[dCell("Scale",2600,C.gray,true), dCell("A large hospital ICU may have 50–100 beds. One nurse may oversee 2–4 patients. An AI system can monitor all beds simultaneously without fatigue.",6760,C.gray)] }),
    ]
  }),
  SP(),
  callout("Key Insight","AIOps-Care is not replacing doctors — it is acting as an always-alert second pair of eyes that flags the subtle early warning signs, so clinicians can intervene before a crisis becomes irreversible.", C.lightBlue, C.darkBlue),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 2 — KAGGLE & MIMIC-III DATA
// ════════════════════════════════════════════════════════════════════════════
const s2 = [
  H1("2. Kaggle & MIMIC-III — The Dataset"),
  H2("2.1  What Is Kaggle?"),
  P("Kaggle is the world's largest data science platform, owned by Google. It hosts:"),
  BL("100,000+ public datasets across every domain"),
  BL("Competitive machine learning challenges"),
  BL("Free cloud compute notebooks (GPU/TPU)"),
  BL("A community of 15+ million data scientists"),
  P("For AIOps-Care, Kaggle is the primary data access point for the MIMIC-III clinical database — one of the most important real-world healthcare datasets available for research."),
  SP(),
  H2("2.2  What Is MIMIC-III?"),
  P("MIMIC-III (Medical Information Mart for Intensive Care III) is a large, freely-available database of ICU patient records from Beth Israel Deaconess Medical Center (BIDMC) in Boston, USA. It contains data from over 40,000 ICU admissions between 2001 and 2012."),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2800,6560],
    rows:[
      new TableRow({ children:[hCell("MIMIC-III Fact",2800), hCell("Detail",6560)] }),
      new TableRow({ children:[dCell("Patients",2800,C.gray), dCell("~40,000 ICU patients (de-identified for privacy)",6560,C.gray)] }),
      new TableRow({ children:[dCell("Time Period",2800), dCell("2001–2012, Beth Israel Deaconess Medical Center, Boston",6560)] }),
      new TableRow({ children:[dCell("Size",2800,C.gray), dCell("~50 GB uncompressed; CHARTEVENTS table alone is ~33 GB",6560,C.gray)] }),
      new TableRow({ children:[dCell("Key Table",2800), dCell("CHARTEVENTS — every bedside monitoring reading with timestamp, patient ID, and item type",6560)] }),
      new TableRow({ children:[dCell("Access",2800,C.gray), dCell("Free via PhysioNet (credentialing required) or Kaggle datasets",6560,C.gray)] }),
      new TableRow({ children:[dCell("License",2800), dCell("Open data — de-identified, HIPAA-compliant for research use",6560)] }),
    ]
  }),
  SP(),
  H2("2.3  CHARTEVENTS Table Structure"),
  P("CHARTEVENTS is the core table we use. Every row is one measurement taken from a bedside monitor or nurse entry:"),
  SP(),
  ...["SUBJECT_ID   | Patient identifier (de-identified integer)",
      "HADM_ID      | Hospital admission ID",
      "ICUSTAY_ID   | ICU stay ID (one patient may have multiple stays)",
      "ITEMID       | What was measured (e.g., 220045 = Heart Rate)",
      "CHARTTIME    | Timestamp of the measurement",
      "VALUE        | Raw value (e.g., '72')",
      "VALUENUM     | Numeric value (e.g., 72.0)",
      "VALUEUOM     | Unit of measure (e.g., 'bpm', '%', 'mmHg')",
      "ERROR        | 1 if the reading was flagged as an error",
  ].map(CODE),
  SP(),
  H2("2.4  Why ITEMIDs Matter"),
  P("MIMIC-III has 12,000+ different ITEMIDs representing every possible clinical measurement. We filter to just 9 ITEMIDs covering 6 vital signs that the NEWS2 scoring system uses:"),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2400,1600,2000,3360],
    rows:[
      new TableRow({ children:[hCell("Vital Sign",2400), hCell("ITEMID(s)",1600), hCell("Unit",2000), hCell("Clinical Significance",3360)] }),
      new TableRow({ children:[dCell("Heart Rate (HR)",2400,C.gray), dCell("220045",1600,C.gray), dCell("bpm",2000,C.gray), dCell("Tachycardia (>100) or bradycardia (<60) signal distress",3360,C.gray)] }),
      new TableRow({ children:[dCell("Respiratory Rate (RR)",2400), dCell("220210",1600), dCell("breaths/min",2000), dCell("RR >25 is strong predictor of deterioration (NEWS2 score 3)",3360)] }),
      new TableRow({ children:[dCell("SpO2 (Oxygen Sat.)",2400,C.gray), dCell("220277",1600,C.gray), dCell("%",2000,C.gray), dCell("SpO2 <92% indicates hypoxia — serious early warning sign",3360,C.gray)] }),
      new TableRow({ children:[dCell("MAP (Arterial Pressure)",2400), dCell("220181, 220052",1600), dCell("mmHg",2000), dCell("MAP <65 indicates shock; two ITEMIDs cover cuff vs arterial line",3360)] }),
      new TableRow({ children:[dCell("Temperature",2400,C.gray), dCell("223761, 223762",1600,C.gray), dCell("°F / °C",2000,C.gray), dCell("Fever (>38°C) or hypothermia (<36°C) signal systemic infection",3360,C.gray)] }),
      new TableRow({ children:[dCell("GCS (Neurological)",2400), dCell("220739, 223900, 223901",1600), dCell("1–4, 1–5, 1–6",2000), dCell("Eye+Verbal+Motor = 3–15; declining GCS = neurological deterioration",3360)] }),
    ]
  }),
  SP(),
  H2("2.5  Data Pipeline from Kaggle to Model"),
  ...["  Kaggle Dataset Download",
      "       |",
      "       v  data_loader.py",
      "  Load CHARTEVENTS.csv in chunks (pandas chunksize=100,000 rows)",
      "       |",
      "       v  Filter rows: ITEMID in [220045, 220210, 220277, ...]",
      "       |",
      "       v  Pivot: long format (one row per measurement)",
      "                     ─> wide format (one row per patient-timestamp, columns = vitals)",
      "       |",
      "       v  Drop rows where ERROR=1",
      "       |",
      "       v  Save as Parquet (Apache Arrow columnar format — 10x smaller than CSV)",
      "       |",
      "       v  data/processed/vitals.parquet  ─> used for training + replay",
  ].map(CODE),
  SP(),
  callout("Why Parquet?","Parquet is a columnar storage format. Compared to CSV: it compresses 5–10x better, reads 10–100x faster (only loads columns you need), and preserves data types. For a 33 GB CSV like CHARTEVENTS, Parquet can reduce it to ~3 GB and make queries dramatically faster.", C.lightBlue, C.darkBlue),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 3 — AWS EC2
// ════════════════════════════════════════════════════════════════════════════
const s3 = [
  H1("3. AWS EC2 — Cloud Compute Infrastructure"),
  H2("3.1  What Is AWS EC2?"),
  P("Amazon Elastic Compute Cloud (EC2) is the virtual machine service of Amazon Web Services (AWS). It lets you rent virtual servers — called instances — in the cloud, paying only for what you use. EC2 is the backbone of most production cloud applications."),
  P("Key concepts you must understand:"),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2200,7160],
    rows:[
      new TableRow({ children:[hCell("Concept",2200), hCell("Meaning",7160)] }),
      new TableRow({ children:[dCell("Instance",2200,C.gray), dCell("A virtual machine running on AWS physical hardware. You choose CPU, RAM, storage, and network capacity.",7160,C.gray)] }),
      new TableRow({ children:[dCell("Instance Type",2200), dCell("A named configuration, e.g. t3.medium = 2 vCPU + 4 GB RAM. Letters denote family (t=general, c=compute, r=memory, p=GPU); numbers denote generation; size = small/medium/large/xlarge.",7160)] }),
      new TableRow({ children:[dCell("AMI",2200,C.gray), dCell("Amazon Machine Image — a snapshot of an OS + software used to launch instances. Like a VM template.",7160,C.gray)] }),
      new TableRow({ children:[dCell("Security Group",2200), dCell("A virtual firewall. Rules specify which IP addresses and ports are allowed inbound and outbound. Stateful (return traffic auto-allowed).",7160)] }),
      new TableRow({ children:[dCell("VPC",2200,C.gray), dCell("Virtual Private Cloud — your own isolated network within AWS. All EC2 instances live inside a VPC.",7160,C.gray)] }),
      new TableRow({ children:[dCell("Subnet",2200), dCell("A subdivision of a VPC. Public subnets have internet access; private subnets are isolated. AIOps-Care uses 3 subnets.",7160)] }),
      new TableRow({ children:[dCell("IAM Role",2200,C.gray), dCell("Identity and Access Management Role — grants an EC2 instance permission to access AWS services (S3, RDS, Secrets Manager) without embedding credentials.",7160,C.gray)] }),
      new TableRow({ children:[dCell("EBS Volume",2200), dCell("Elastic Block Store — persistent disk storage attached to an EC2 instance. Survives instance restart.",7160)] }),
      new TableRow({ children:[dCell("Elastic IP",2200,C.gray), dCell("A static public IP address you can assign to an EC2 instance. Without it, the IP changes on restart.",7160,C.gray)] }),
    ]
  }),
  SP(),
  H2("3.2  EC2 Instance Types for AIOps-Care"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2000,1200,1200,2000,2960],
    rows:[
      new TableRow({ children:[hCell("Service",2000), hCell("Instance",1200), hCell("vCPU/RAM",1200), hCell("Why This Type?",2000), hCell("Phase",2960)] }),
      new TableRow({ children:[dCell("FastAPI Dashboard",2000,C.gray), dCell("t3.medium",1200,C.gray), dCell("2 / 4 GB",1200,C.gray), dCell("Low CPU, handles WebSocket",2000,C.gray), dCell("Phase 4+",2960,C.gray)] }),
      new TableRow({ children:[dCell("Kafka Broker",2000), dCell("t3.large",1200), dCell("2 / 8 GB",1200), dCell("Needs RAM for partition cache",2000), dCell("Phase 4+",2960)] }),
      new TableRow({ children:[dCell("ML Consumer",2000,C.gray), dCell("t3.xlarge",1200,C.gray), dCell("4 / 16 GB",1200,C.gray), dCell("XGBoost + rolling buffers = RAM intensive",2000,C.gray), dCell("Phase 4+",2960,C.gray)] }),
      new TableRow({ children:[dCell("Model Training",2000), dCell("c5.2xlarge",1200), dCell("8 / 16 GB",1200), dCell("CPU-optimised for XGBoost hist training",2000), dCell("Phase 4+",2960)] }),
      new TableRow({ children:[dCell("LSTM Training",2000,C.gray), dCell("p3.2xlarge",1200,C.gray), dCell("8 / 61 GB + GPU",1200,C.gray), dCell("GPU required for PyTorch LSTM",2000,C.gray), dCell("Phase 7+",2960,C.gray)] }),
    ]
  }),
  SP(),
  H2("3.3  VPC Network Design for AIOps-Care"),
  P("A VPC (Virtual Private Cloud) is a logically isolated network inside AWS. Think of it as your own data centre inside the cloud. Our design uses 3 subnets in the same VPC (10.0.0.0/16):"),
  SP(),
  ...[
    "  VPC: 10.0.0.0/16  (65,536 possible IPs)",
    "  |",
    "  ├── PUBLIC SUBNET  10.0.1.0/24  ── Has Internet Gateway",
    "  |       EC2: FastAPI Dashboard (port 8000)",
    "  |       EC2: Kafka-UI  (port 8080)",
    "  |       ALB: Application Load Balancer (port 443 → 8000)",
    "  |",
    "  ├── PRIVATE SUBNET  10.0.2.0/24  ── No direct internet access",
    "  |       EC2: Kafka Broker  (port 9092 — from private subnet only)",
    "  |       EC2: Zookeeper     (port 2181 — from private subnet only)",
    "  |       EC2: ML Consumer / StreamProcessor",
    "  |       EC2: Model Training Job (batch, stopped when not in use)",
    "  |",
    "  └── DATA SUBNET  10.0.3.0/24  ── Isolated data tier",
    "          S3 VPC Endpoint  (no public internet for data transfer)",
    "          AWS MSK           (Managed Kafka — Phase 5+)",
    "          AWS RDS PostgreSQL (port 5432 — alert history store)",
  ].map(CODE),
  SP(),
  H2("3.4  Why Cloud vs Local?"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2000,3680,3680],
    rows:[
      new TableRow({ children:[hCell("Aspect",2000), hCell("Local Docker (Phase 1–3)",3680), hCell("AWS EC2 (Phase 4+)",3680)] }),
      new TableRow({ children:[dCell("Availability",2000,C.gray), dCell("Only when your laptop is on",3680,C.gray), dCell("24/7 uptime, multi-AZ failover",3680,C.gray)] }),
      new TableRow({ children:[dCell("Scale",2000), dCell("Limited to local CPU/RAM",3680), dCell("Scale to 1000+ ICU beds with Auto Scaling",3680)] }),
      new TableRow({ children:[dCell("Data",2000,C.gray), dCell("Synthetic only (local disk limit)",3680,C.gray), dCell("Full MIMIC-III 50 GB in S3",3680,C.gray)] }),
      new TableRow({ children:[dCell("Security",2000), dCell("No production-grade auth",3680), dCell("IAM, SGs, VPC, TLS, WAF, CloudTrail",3680)] }),
      new TableRow({ children:[dCell("Cost",2000,C.gray), dCell("Free (your hardware)",3680,C.gray), dCell("Pay-per-use: ~$50–200/month for dev",3680,C.gray)] }),
    ]
  }),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 4 — KAFKA
// ════════════════════════════════════════════════════════════════════════════
const s4 = [
  H1("4. Apache Kafka — Event Streaming Platform"),
  H2("4.1  What Is Kafka?"),
  P("Apache Kafka is a distributed event streaming platform originally built by LinkedIn in 2010, open-sourced and now maintained by Apache Software Foundation. It is designed to handle high-throughput, fault-tolerant, real-time data pipelines."),
  P("Think of Kafka as a permanent, ordered, distributed log — like a database, but optimised for writing streams of events and reading them in real-time."),
  SP(),
  H2("4.2  Core Kafka Concepts"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2000,7360],
    rows:[
      new TableRow({ children:[hCell("Concept",2000), hCell("What It Means",7360)] }),
      new TableRow({ children:[dCell("Event / Message",2000,C.gray), dCell("A single piece of data published to Kafka. In AIOps-Care: one JSON object with a patient's vitals at a timestamp.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Topic",2000), dCell("A named category/channel for events. Like a table in a database. We have 3 topics: vitals.raw, vitals.scored, vitals.alerts.",7360)] }),
      new TableRow({ children:[dCell("Partition",2000,C.gray), dCell("A topic is split into partitions for parallelism. Each partition is an ordered, immutable log. Producers write to partitions; consumers read from them.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Offset",2000), dCell("The position of a message within a partition. Each message has a unique offset. Consumers track their offset to know where they left off.",7360)] }),
      new TableRow({ children:[dCell("Producer",2000,C.gray), dCell("An application that writes events to a topic. In AIOps-Care: producer.py sends vitals.raw messages.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Consumer",2000), dCell("An application that reads events from a topic. In AIOps-Care: consumer.py reads vitals.raw and processes each message.",7360)] }),
      new TableRow({ children:[dCell("Consumer Group",2000,C.gray), dCell("Multiple consumer instances sharing the same group ID. Kafka distributes partitions across the group — enabling horizontal scale. Each message is processed by exactly one consumer in the group.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Broker",2000), dCell("A Kafka server. Handles storing topics, serving producers and consumers. In Phase 1: one broker on localhost:9092. In Phase 4: EC2 instance.",7360)] }),
      new TableRow({ children:[dCell("Zookeeper",2000,C.gray), dCell("Coordination service Kafka uses to manage broker membership, leader election, and configuration. Being replaced by KRaft (Kafka Raft) in newer versions.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Retention",2000), dCell("How long Kafka keeps messages. vitals.raw = 7 days, vitals.scored = 30 days, vitals.alerts = 90 days (HIPAA compliance).",7360)] }),
    ]
  }),
  SP(),
  H2("4.3  Why Kafka for AIOps-Care?"),
  P("We could have connected producer.py directly to consumer.py with a simple queue or function call. Why use Kafka?"),
  BL("Decoupling: Producer and consumer are completely independent — producer does not know or care who is consuming"),
  BL("Durability: Messages are persisted to disk. If the consumer crashes, it picks up from its last offset when it restarts"),
  BL("Replay: We can re-read historical messages to debug, re-score with a new model, or backfill data"),
  BL("Multiple Consumers: dashboard.py, audit logger, and future notification services all read vitals.alerts independently"),
  BL("Scale: Add more consumers in a consumer group to handle 1000+ ICU beds (Phase 9)"),
  BL("Backpressure: Kafka buffers messages if consumer is slow — no data loss"),
  SP(),
  H2("4.4  Kafka Message Flow in AIOps-Care"),
  ...[
    "  producer.py                   consumer.py",
    "       |                              |",
    "       |  produce(vitals.raw)         |  poll(vitals.raw)",
    "       v                              v",
    "  ┌─────────────────────────────────────────────────────┐",
    "  │  Kafka Broker (localhost:9092 / EC2 Phase 4+)        │",
    "  │                                                      │",
    "  │  Topic: vitals.raw  [P0][P1][P2]  ← partitions      │",
    "  │    offset: 0,1,2,3,4,5,6,7,8...                      │",
    "  │                                                      │",
    "  │  Topic: vitals.scored [P0][P1][P2]                   │",
    "  │    offset: 0,1,2,3,4,5,6,7,8...                      │",
    "  │                                                      │",
    "  │  Topic: vitals.alerts [P0][P1][P2]                   │",
    "  │    offset: 0,1,2,3...                                │",
    "  └─────────────────────────────────────────────────────┘",
    "                   ↑ read                 ↑ read",
    "            alert_engine.py          dashboard.py",
    "                                     audit_logger.py",
  ].map(CODE),
  SP(),
  H2("4.5  AWS MSK — Managed Kafka (Phase 5)"),
  P("In Phase 5, we replace the self-managed Kafka EC2 instance with AWS MSK (Amazon Managed Streaming for Apache Kafka). MSK handles broker provisioning, patching, scaling, replication, and monitoring automatically."),
  BL("No need to manage ZooKeeper or broker cluster yourself"),
  BL("Automatic multi-AZ replication for fault tolerance"),
  BL("Integrated with AWS IAM, CloudWatch, VPC"),
  BL("Cost: based on broker hours + storage"),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 5 — DOCKER
// ════════════════════════════════════════════════════════════════════════════
const s5 = [
  H1("5. Docker & Docker Compose — Containerisation"),
  H2("5.1  What Is Docker?"),
  P("Docker is a platform for packaging applications and their dependencies into isolated, portable units called containers. A container includes the application code, runtime, libraries, and system tools — everything needed to run, regardless of the host environment."),
  P("Key difference from a Virtual Machine: A VM includes an entire OS kernel. A container shares the host OS kernel and only packages the application layer — making containers 10–100x lighter and faster to start."),
  SP(),
  H2("5.2  Docker Concepts"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2000,7360],
    rows:[
      new TableRow({ children:[hCell("Concept",2000), hCell("Meaning",7360)] }),
      new TableRow({ children:[dCell("Image",2000,C.gray), dCell("A read-only template defining a container. Built from a Dockerfile. Like a class in OOP.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Container",2000), dCell("A running instance of an image. Like an object instantiated from a class.",7360)] }),
      new TableRow({ children:[dCell("Dockerfile",2000,C.gray), dCell("A text file with instructions to build an image: FROM (base), RUN (install), COPY (files), CMD (start command).",7360,C.gray)] }),
      new TableRow({ children:[dCell("Volume",2000), dCell("Persistent storage mounted into a container. Data survives container restarts.",7360)] }),
      new TableRow({ children:[dCell("Network",2000,C.gray), dCell("Docker creates virtual networks for containers to communicate. In AIOps-Care: icu-network bridges all services.",7360,C.gray)] }),
      new TableRow({ children:[dCell("Port Mapping",2000), dCell("Container port exposed to host: -p 8000:8000 means host:8000 → container:8000.",7360)] }),
    ]
  }),
  SP(),
  H2("5.3  Docker Compose"),
  P("Docker Compose is a tool for defining and running multi-container applications using a YAML file (docker-compose.yml). Instead of running docker run commands individually, you define all services together and start them with docker compose up."),
  P("AIOps-Care docker-compose.yml defines:"),
  BL("zookeeper — Kafka coordination service"),
  BL("kafka — Kafka broker (depends on zookeeper)"),
  BL("kafka-ui — Provectus Kafka-UI web interface"),
  BL("prometheus — Metrics collection"),
  BL("All connected via icu-network bridge network"),
  SP(),
  H2("5.4  Local vs EC2 — How Docker Evolves"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2000,3680,3680],
    rows:[
      new TableRow({ children:[hCell("Phase",2000), hCell("Phase 1–3: Docker Compose",3680), hCell("Phase 4+: EC2 Instances",3680)] }),
      new TableRow({ children:[dCell("Kafka",2000,C.gray), dCell("bitnami/kafka Docker container on localhost",3680,C.gray), dCell("Dedicated EC2 t3.large or AWS MSK",3680,C.gray)] }),
      new TableRow({ children:[dCell("Dashboard",2000), dCell("uvicorn running locally on port 8000",3680), dCell("EC2 t3.medium behind ALB on port 443",3680)] }),
      new TableRow({ children:[dCell("Data",2000,C.gray), dCell("Local parquet files in /data/ folder",3680,C.gray), dCell("AWS S3 bucket s3://aiopscare-data/",3680,C.gray)] }),
      new TableRow({ children:[dCell("Models",2000), dCell("Local /models/ folder joblib files",3680), dCell("S3 model artifact store, loaded on startup",3680)] }),
    ]
  }),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 6 — FEATURE ENGINEERING & NEWS2
// ════════════════════════════════════════════════════════════════════════════
const s6 = [
  H1("6. Feature Engineering — Turning Vitals into ML Inputs"),
  H2("6.1  Why Feature Engineering Matters"),
  P("Raw vital signs (e.g., heart_rate = 102) tell you the current state. But ML models — especially for early warning — need to know the trend. Is heart rate rising? How fast? Is it unusual for this patient? Feature engineering creates new variables that capture these richer signals."),
  SP(),
  H2("6.2  NEWS2 — National Early Warning Score 2"),
  P("NEWS2 is a clinical scoring system published by the Royal College of Physicians (UK) in 2017. It is used in hospitals worldwide to identify deteriorating patients. Each vital sign is assigned a score (0–3) based on how far it deviates from normal. Scores are summed to give a total 0–20."),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2200,1200,1200,1200,1200,2360],
    rows:[
      new TableRow({ children:[hCell("Vital Sign",2200), hCell("Score 3",1200), hCell("Score 2",1200), hCell("Score 1",1200), hCell("Score 0",1200), hCell("Score 1/2/3",2360)] }),
      new TableRow({ children:[dCell("Respiratory Rate",2200,C.gray), dCell("≤8",1200,C.gray), dCell("—",1200,C.gray), dCell("9–11",1200,C.gray), dCell("12–20",1200,C.gray), dCell("21–24 / ≥25",2360,C.gray)] }),
      new TableRow({ children:[dCell("SpO2",2200), dCell("≤91%",1200), dCell("92–93%",1200), dCell("94–95%",1200), dCell("≥96%",1200), dCell("—",2360)] }),
      new TableRow({ children:[dCell("Systolic BP",2200,C.gray), dCell("≤90",1200,C.gray), dCell("91–100",1200,C.gray), dCell("101–110",1200,C.gray), dCell("111–219",1200,C.gray), dCell("≥220 = 3",2360,C.gray)] }),
      new TableRow({ children:[dCell("Heart Rate",2200), dCell("≤40",1200), dCell("—",1200), dCell("41–50 / 91–110",1200), dCell("51–90",1200), dCell("111–130=2 / ≥131=3",2360)] }),
      new TableRow({ children:[dCell("Temperature",2200,C.gray), dCell("≤35.0°C",1200,C.gray), dCell("—",1200,C.gray), dCell("35.1–36.0°C",1200,C.gray), dCell("36.1–38.0°C",1200,C.gray), dCell("38.1–39.0=1 / ≥39.1=2",2360,C.gray)] }),
      new TableRow({ children:[dCell("Level of Consciousness",2200), dCell("—",1200), dCell("—",1200), dCell("—",1200), dCell("Alert (GCS=15)",1200), dCell("Any confusion/AVPU V/P/U = 3",2360)] }),
    ]
  }),
  SP(),
  P("NEWS2 total score interpretation:"),
  BL("0–4: Low risk — routine monitoring"),
  BL("5–6: Medium risk — increased monitoring"),
  BL("≥7: High risk — urgent clinical review (our CRITICAL threshold)"),
  SP(),
  H2("6.3  Rolling Window Features"),
  P("Beyond the current value, we compute rolling statistics over the last 5 and 30 minutes for each vital sign. This gives the model information about trends and volatility, not just the current reading."),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2800,6560],
    rows:[
      new TableRow({ children:[hCell("Feature",2800), hCell("What It Captures",6560)] }),
      new TableRow({ children:[dCell("hr_mean_5m",2800,C.gray), dCell("Average heart rate over last 5 minutes — smooths out single-point noise",6560,C.gray)] }),
      new TableRow({ children:[dCell("hr_std_5m",2800), dCell("Standard deviation of HR over 5 min — captures variability (high variability can signal instability)",6560)] }),
      new TableRow({ children:[dCell("hr_slope_5m",2800,C.gray), dCell("Linear regression slope of HR over 5 min — is HR rising or falling, and how fast? (numpy.polyfit)",6560,C.gray)] }),
      new TableRow({ children:[dCell("hr_mean_30m",2800), dCell("Average HR over 30 min — longer trend baseline",6560)] }),
      new TableRow({ children:[dCell("hr_std_30m",2800,C.gray), dCell("SD over 30 min — sustained variability",6560,C.gray)] }),
      new TableRow({ children:[dCell("hr_slope_30m",2800), dCell("Trend over 30 min — slow but persistent rise detectable by this feature",6560)] }),
    ]
  }),
  P("The same 6 features (mean, std, slope × 5min and 30min) are computed for all 6 vital signs, plus NEWS2 as an additional feature. Total: approximately 37 engineered features per patient per inference cycle."),
  SP(),
  H2("6.4  Feature Parity — Why It Matters"),
  callout("Critical Engineering Principle","Feature parity means the EXACT same feature_engineering.py code runs at training time AND at inference time. If training uses 30-min rolling mean but inference uses 5-min mean due to a bug, the model inputs at inference will not match what the model was trained on — causing silently wrong predictions. This is called 'training-serving skew' and is one of the most common production ML bugs.", C.yellowBg, C.orange),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 7 — MACHINE LEARNING MODELS
// ════════════════════════════════════════════════════════════════════════════
const s7 = [
  H1("7. Machine Learning Models — XGBoost & Isolation Forest"),
  H2("7.1  XGBoost — Supervised Deterioration Prediction"),
  H3("7.1.1  What Is XGBoost?"),
  P("XGBoost (Extreme Gradient Boosting) is an ensemble machine learning algorithm that builds a sequence of decision trees, where each new tree corrects the errors of the previous ones. It was developed by Tianqi Chen in 2014 and dominates tabular data competitions."),
  P("Core concept — Gradient Boosting:"),
  BL("Start with a simple prediction (e.g., the mean of all labels)"),
  BL("Compute the residual errors (how wrong were we?)"),
  BL("Fit a decision tree to predict those residuals (correct the mistakes)"),
  BL("Add the tree's contribution (scaled by learning rate) to the ensemble"),
  BL("Repeat N times (n_estimators = 400 in AIOps-Care)"),
  BL("Final prediction = sum of all tree predictions"),
  SP(),
  H3("7.1.2  XGBoost Hyperparameters in AIOps-Care"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2400,1600,5360],
    rows:[
      new TableRow({ children:[hCell("Parameter",2400), hCell("Value",1600), hCell("Why This Choice",5360)] }),
      new TableRow({ children:[dCell("n_estimators",2400,C.gray), dCell("400",1600,C.gray), dCell("400 trees gives good accuracy; more would risk overfitting on a clinical dataset",5360,C.gray)] }),
      new TableRow({ children:[dCell("max_depth",2400), dCell("6",1600), dCell("Limits tree depth to prevent memorising the training set; 6 is the standard starting point",5360)] }),
      new TableRow({ children:[dCell("learning_rate",2400,C.gray), dCell("0.05",1600,C.gray), dCell("Shrinks each tree's contribution; smaller = slower but more robust. Must compensate with more trees.",5360,C.gray)] }),
      new TableRow({ children:[dCell("scale_pos_weight",2400), dCell("auto",1600), dCell("ICU deterioration is rare (~5–10% of patients). This weights the minority class to counteract imbalance.",5360)] }),
      new TableRow({ children:[dCell("tree_method",2400,C.gray), dCell("hist",1600,C.gray), dCell("Histogram-based tree building — 10x faster than exact method on large datasets like MIMIC-III",5360,C.gray)] }),
      new TableRow({ children:[dCell("objective",2400), dCell("binary:logistic",1600), dCell("Outputs probability 0–1; we threshold at 0.65 for HIGH alert, 0.85 for CRITICAL",5360)] }),
    ]
  }),
  SP(),
  H3("7.1.3  The Proxy Label Problem"),
  P("MIMIC-III does not have a column called 'deteriorated=True'. We must create our training label from the data. Our proxy label is: 'Did any vital sign cross a critical threshold within the next 6 hours?'"),
  ...[
    "  For each patient window W at time T:",
    "  Look ahead 6 hours (T+6h)",
    "  If heart_rate > 130 OR rr > 25 OR spo2 < 90 OR map < 60 → label = 1 (deteriorating)",
    "  Else label = 0 (stable)",
    "  This creates a binary classification problem.",
    "",
    "  Class imbalance: ~90% stable, ~10% deteriorating",
    "  Solution: scale_pos_weight = 90/10 = 9  → upweights the minority class",
  ].map(CODE),
  SP(),
  H2("7.2  Isolation Forest — Unsupervised Anomaly Detection"),
  H3("7.2.1  What Is Isolation Forest?"),
  P("Isolation Forest is an unsupervised anomaly detection algorithm proposed by Fei Tony Liu in 2008. It works on a simple insight: anomalies are rare and different — so they are easier to isolate (separate from the rest of the data) than normal points."),
  P("The algorithm:"),
  NL("Build many random decision trees (200 in AIOps-Care)"),
  NL("At each node, randomly pick a feature and a random split point"),
  NL("Continue until each point is isolated (alone in a leaf)"),
  NL("Anomalies are isolated in fewer steps (shorter path length) because they are different from the crowd"),
  NL("Normal points require many steps to isolate (they are surrounded by similar points)"),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2400,6960],
    rows:[
      new TableRow({ children:[hCell("Parameter",2400), hCell("Meaning in AIOps-Care",6960)] }),
      new TableRow({ children:[dCell("n_estimators = 200",2400,C.gray), dCell("200 random trees. More = more stable scores but slower. 200 is the standard balance.",6960,C.gray)] }),
      new TableRow({ children:[dCell("contamination = 0.05",2400), dCell("We expect ~5% of patient windows to be anomalous. Sets the decision threshold for anomaly_score.",6960)] }),
      new TableRow({ children:[dCell("Output",2400,C.gray), dCell("Raw score converted: anomaly_score = 1 − (normalised_path_length). Higher = more anomalous.",6960,C.gray)] }),
    ]
  }),
  SP(),
  H3("7.2.2  Why Use Both XGBoost AND Isolation Forest?"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2800,3280,3280],
    rows:[
      new TableRow({ children:[hCell("Aspect",2800), hCell("XGBoost (Supervised)",3280), hCell("Isolation Forest (Unsupervised)",3280)] }),
      new TableRow({ children:[dCell("Needs labels?",2800,C.gray), dCell("YES — needs training labels",3280,C.gray), dCell("NO — learns from data structure",3280,C.gray)] }),
      new TableRow({ children:[dCell("What it detects",2800), dCell("Patterns that previously preceded deterioration",3280), dCell("Any statistically unusual vital sign combination",3280)] }),
      new TableRow({ children:[dCell("New failure modes",2800,C.gray), dCell("May miss never-before-seen patterns",3280,C.gray), dCell("Can detect novel anomalies",3280,C.gray)] }),
      new TableRow({ children:[dCell("Explainability",2800), dCell("SHAP feature importances available",3280), dCell("Harder to explain",3280)] }),
      new TableRow({ children:[dCell("Role in AIOps-Care",2800,C.gray), dCell("Primary alert trigger (deterioration_prob)",3280,C.gray), dCell("Secondary WATCH alert trigger",3280,C.gray)] }),
    ]
  }),
  SP(),
  H2("7.3  Model Persistence with Joblib"),
  P("After training, models are saved to disk using joblib. joblib is Python's optimised serialisation library — 3–10x faster than pickle for NumPy arrays (which XGBoost models are made of)."),
  ...[
    "  # Training: save",
    "  import joblib",
    "  joblib.dump(xgb_model, 'models/xgb_deterioration.joblib')",
    "  joblib.dump(iso_model,  'models/isolation_forest.joblib')",
    "",
    "  # Inference: load once at startup (lazy singleton pattern)",
    "  xgb_model = joblib.load('models/xgb_deterioration.joblib')",
    "  iso_model  = joblib.load('models/isolation_forest.joblib')",
    "",
    "  # Predict (per-patient, per-event)",
    "  prob  = xgb_model.predict_proba(features)[0][1]  # class 1 probability",
    "  score = iso_model.decision_function(features)[0]  # negative = anomaly",
  ].map(CODE),
  SP(),
  H2("7.4  ROC-AUC — How We Measure Model Quality"),
  P("ROC-AUC (Receiver Operating Characteristic — Area Under Curve) measures a binary classifier's ability to distinguish between classes, regardless of the decision threshold. It ranges from 0.5 (random) to 1.0 (perfect)."),
  BL("ROC-AUC 0.91 means: if we pick a random deteriorating patient and a random stable patient, the model ranks the deteriorating one higher 91% of the time"),
  BL("For clinical early warning, we prefer high Sensitivity (catch most real events) over high Specificity (accept some false alarms)"),
  BL("We tune the threshold at 0.65 (HIGH) and 0.85 (CRITICAL) to balance false alarms vs missed events"),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 8 — FASTAPI, WEBSOCKET, STREAMING
// ════════════════════════════════════════════════════════════════════════════
const s8 = [
  H1("8. FastAPI & WebSocket — Real-Time API & Dashboard"),
  H2("8.1  What Is FastAPI?"),
  P("FastAPI is a modern, high-performance Python web framework for building APIs, created by Sebastián Ramírez in 2018. It is built on top of Starlette (ASGI framework) and Pydantic (data validation)."),
  P("Why FastAPI over Flask or Django?"),
  BL("Async-native: uses Python async/await for non-blocking I/O — critical for WebSocket connections"),
  BL("Automatic OpenAPI/Swagger docs: API is self-documenting at /docs"),
  BL("Type-safe: Pydantic models validate request/response data automatically"),
  BL("Performance: comparable to Node.js and Go — handles thousands of concurrent connections"),
  SP(),
  H2("8.2  WebSocket — Real-Time Communication"),
  P("HTTP is request-response: the client asks, the server responds, connection closes. WebSocket is a persistent, bidirectional connection: once established, either side can send data at any time."),
  P("In AIOps-Care:"),
  BL("Clinician opens dashboard in browser → browser connects ws://localhost:8000/ws"),
  BL("FastAPI upgrades the connection to WebSocket (HTTP → WS protocol upgrade)"),
  BL("Background thread in dashboard.py polls vitals.alerts Kafka topic"),
  BL("Each new alert is broadcast to ALL connected WebSocket clients simultaneously"),
  BL("No polling: browser does NOT ask 'any new alerts?' every 5 seconds"),
  SP(),
  ...[
    "  # Simplified WebSocket endpoint in dashboard.py",
    "  @app.websocket('/ws')",
    "  async def websocket_endpoint(websocket: WebSocket):",
    "      await websocket.accept()",
    "      broadcaster.register(websocket)      # add to subscriber list",
    "      try:",
    "          while True:",
    "              await websocket.receive_text()  # keep connection alive",
    "      except WebSocketDisconnect:",
    "          broadcaster.unregister(websocket)",
    "",
    "  # When alert fires (from Kafka consumer thread):",
    "  await broadcaster.broadcast(alert_json)  # push to ALL browsers instantly",
  ].map(CODE),
  SP(),
  H2("8.3  Uvicorn — ASGI Server"),
  P("Uvicorn is the ASGI (Asynchronous Server Gateway Interface) server that runs FastAPI. ASGI is the modern replacement for WSGI (used by Flask/Django). ASGI supports async code and WebSocket connections natively."),
  BL("Development: uvicorn api.dashboard:app --reload"),
  BL("Production EC2: uvicorn api.dashboard:app --workers 4 --host 0.0.0.0 --port 8000"),
  BL("Behind ALB on EC2: the Load Balancer terminates TLS (HTTPS) and forwards plain HTTP to Uvicorn"),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 9 — PROMETHEUS & OBSERVABILITY
// ════════════════════════════════════════════════════════════════════════════
const s9 = [
  H1("9. Prometheus & OpenTelemetry — Observability"),
  H2("9.1  What Is Observability?"),
  P("Observability is the ability to understand what is happening inside a system from its external outputs. For a production AIOps system treating patients, we must know: Is it running? How fast? Are there errors? Is Kafka falling behind?"),
  P("The three pillars of observability:"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[1600,2400,5360],
    rows:[
      new TableRow({ children:[hCell("Pillar",1600), hCell("Tool in AIOps-Care",2400), hCell("What It Gives You",5360)] }),
      new TableRow({ children:[dCell("Metrics",1600,C.gray), dCell("Prometheus",2400,C.gray), dCell("Aggregated numbers over time: how many alerts, average latency, current active patients",5360,C.gray)] }),
      new TableRow({ children:[dCell("Traces",1600), dCell("OpenTelemetry",2400), dCell("The path of a single request through the system: producer → Kafka → consumer → alert engine",5360)] }),
      new TableRow({ children:[dCell("Logs",1600,C.gray), dCell("Loguru",2400,C.gray), dCell("Timestamped text records of events: warnings, errors, processing decisions",5360,C.gray)] }),
    ]
  }),
  SP(),
  H2("9.2  Prometheus — Metrics Collection"),
  P("Prometheus is an open-source monitoring system that scrapes (pulls) metrics from application endpoints on a fixed interval (typically 15–60 seconds). Metrics are stored as time-series data — a value + labels + timestamp."),
  P("How it works in AIOps-Care:"),
  BL("consumer.py and dashboard.py expose a /metrics HTTP endpoint (port 9090)"),
  BL("Prometheus server scrapes these endpoints every 15 seconds"),
  BL("Metrics are stored in Prometheus's time-series database"),
  BL("Grafana (Phase 4+) queries Prometheus to render charts"),
  SP(),
  H2("9.3  OpenTelemetry — Distributed Tracing"),
  P("OpenTelemetry (OTel) is an open-source observability framework for generating, collecting, and exporting telemetry data (traces, metrics, logs). A trace tracks a request across multiple services."),
  P("In AIOps-Care, the @traced decorator wraps key functions:"),
  ...[
    "  @traced                        # creates a span around this function",
    "  def score(self, features):    # anomaly_detector.py",
    "      ...",
    "      return ScoreResult(...)   # span records: duration, patient_id, result",
    "",
    "  # Resulting trace shows:",
    "  vitals.raw → [consume: 0.3ms] → [rolling_features: 2.1ms]",
    "  → [score: 4.7ms] → [alert_engine: 0.2ms] → [broadcast: 0.5ms]",
    "  Total end-to-end: 7.8ms per patient event",
  ].map(CODE),
  SP(),
  H2("9.4  Alert Rules — Proactive Monitoring"),
  callout("Why Alert Rules Matter","In a clinical system, if Kafka consumer lag grows to 5000, it means we are 5000 vital-sign readings behind — potentially missing 83 minutes of patient data. An automated alert to PagerDuty ensures the on-call engineer fixes this before any clinical harm occurs.", C.redBg, "8B0000"),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 10 — SECURITY
// ════════════════════════════════════════════════════════════════════════════
const s10 = [
  H1("10. Security Architecture — Keycloak, OPA, HMAC, TLS"),
  H2("10.1  Why Security Is Non-Negotiable in Healthcare AI"),
  P("Healthcare data is the most sensitive personal information that exists. A breach of ICU patient records violates HIPAA (USA), GDPR (EU), and potentially causes direct patient harm if adversaries can manipulate alert systems. AIOps-Care implements a 4-layer security model."),
  SP(),
  H2("10.2  Layer 1 — Patient Data Pseudonymisation (HMAC-SHA256)"),
  P("The MIMIC-III database already de-identifies patients. But in a real deployment, we must ensure that if Kafka messages are intercepted, patient identity cannot be recovered."),
  P("HMAC-SHA256 (Hash-based Message Authentication Code using SHA-256):"),
  BL("A one-way cryptographic hash function — given the output, you cannot reverse-engineer the input"),
  BL("HMAC adds a secret key — only someone with the same key can verify the hash"),
  BL("Each patient's real ID is hashed before being placed in any Kafka message"),
  BL("The mapping (real_id → pseudonym) is kept only in the secure data tier, not in Kafka"),
  ...[
    "  import hmac, hashlib, os",
    "  SECRET_KEY = os.environ['HMAC_KEY']          # from AWS Secrets Manager",
    "",
    "  def pseudonymise(patient_id: str) -> str:",
    "      return hmac.new(SECRET_KEY.encode(),",
    "                      patient_id.encode(),",
    "                      hashlib.sha256).hexdigest()",
    "",
    "  # patient_id '12345' → 'a3f7c8d1...' (64-char hex, non-reversible)",
  ].map(CODE),
  SP(),
  H2("10.3  Layer 2 — Authentication (Keycloak)"),
  P("Keycloak is an open-source Identity and Access Management (IAM) solution. It provides Single Sign-On (SSO), user management, and JWT token issuance."),
  BL("Realm: 'icu' — an isolated Keycloak namespace for this application"),
  BL("Users log in once → Keycloak issues a JWT (JSON Web Token) with their role"),
  BL("Every API request to FastAPI includes the JWT in the Authorization header"),
  BL("FastAPI validates the JWT signature using Keycloak's public key"),
  P("Roles defined in the Keycloak realm:"),
  BL("doctor / nurse: clinical staff — can view alerts for their ward"),
  BL("admin: can view all alerts + manage users"),
  BL("aiops_engineer: full access + model retraining capability"),
  SP(),
  H2("10.4  Layer 3 — Authorisation (Open Policy Agent / Rego)"),
  P("Authentication (Keycloak) answers 'Who are you?'. Authorisation (OPA) answers 'Are you allowed to do that?'"),
  P("Open Policy Agent (OPA) is a general-purpose policy engine. Policies are written in Rego — a declarative query language."),
  ...[
    "  # opa_policy.rego — sample rule",
    "  package aiopscare.authz",
    "",
    "  # Clinicians can only read alerts — not retrain models",
    "  allow {",
    "    input.role in {'doctor', 'nurse'}",
    "    input.action == 'read_alerts'",
    "    input.ward == input.user.ward   # must match their ward",
    "  }",
    "",
    "  # Only aiops_engineer can trigger retraining",
    "  allow {",
    "    input.role == 'aiops_engineer'",
    "    input.action == 'retrain_model'",
    "  }",
  ].map(CODE),
  SP(),
  H2("10.5  Layer 4 — Network Security (TLS, VPC, Security Groups)"),
  BL("TLS (Transport Layer Security): all Kafka client-broker and inter-broker communication is encrypted in Phase 4+"),
  BL("VPC Isolation: Kafka and ML services are in private subnets with no direct internet access"),
  BL("Security Groups: act as stateful firewalls. Kafka port 9092 is open ONLY from private subnet IP range"),
  BL("AWS WAF: Web Application Firewall on ALB blocks SQL injection, XSS, and known attack patterns"),
  BL("CloudTrail: logs every API call, model retraining event, and login for the HIPAA audit trail"),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 11 — SHAP & EXPLAINABILITY
// ════════════════════════════════════════════════════════════════════════════
const s11 = [
  H1("11. SHAP — Explainable AI for Clinical Trust"),
  H2("11.1  The Problem with Black-Box AI in Medicine"),
  P("A doctor receiving an alert that says 'ML probability: 0.87' with no explanation is likely to distrust and ignore it. Clinical AI must be explainable — doctors need to understand WHY the model is firing an alert."),
  SP(),
  H2("11.2  What Is SHAP?"),
  P("SHAP (SHapley Additive exPlanations) is a unified framework for explaining ML model predictions, developed by Scott Lundberg in 2017. It is based on Shapley values from game theory."),
  P("Shapley value intuition: imagine the model's prediction as a 'reward' that must be fairly distributed among all input features. SHAP calculates how much each feature contributed (positively or negatively) to that specific prediction."),
  SP(),
  ...[
    "  Example SHAP explanation for CRITICAL alert on Patient X:",
    "",
    "  Base prediction (average):           +0.12  (base rate: 12% chance)",
    "  rr_slope_30m  (RR rising fast):      +0.31  (biggest driver!)",
    "  spo2_mean_5m  (low oxygen 93%):      +0.22",
    "  hr_mean_30m   (HR elevated 118bpm):  +0.15",
    "  map_slope_5m  (BP dropping):         +0.12",
    "  news2_score   (score=8):             +0.08",
    "  temp_std_30m  (stable, normal):      -0.01",
    "                                      ─────",
    "  Final prediction:                    +0.99  → CRITICAL ALERT",
    "",
    "  Clinical interpretation: Patient's breathing rate has been rising",
    "  steadily for 30 minutes — that is the main signal. Oxygen also low.",
  ].map(CODEY),
  SP(),
  P("This explanation appears in the dashboard as 'contributors' in the alert message — giving nurses and doctors the clinical justification in plain feature names."),
  H2("11.3  XGBoost Native Feature Importance"),
  P("For real-time inference in AIOps-Care, we use XGBoost's built-in feature importances (gain) rather than SHAP, because SHAP requires additional compute per prediction. The top-5 features by gain are returned as 'contributors' in each ScoreResult. Full SHAP analysis is run offline for model validation and clinician training."),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 12 — STREAMING ARCHITECTURE DEEP DIVE
// ════════════════════════════════════════════════════════════════════════════
const s12 = [
  H1("12. Streaming Architecture — Per-Patient Buffers & Alert Fusion"),
  H2("12.1  The Circular Rolling Buffer"),
  P("Each patient's vitals stream must be processed as a rolling window — we need the last 30 minutes of readings to compute rolling features. But we cannot store all of MIMIC-III in memory."),
  P("Solution: a circular buffer (ring buffer) per patient in memory. It holds at most N readings (N = 1800 if readings arrive every 1 second). When full, the oldest reading is overwritten."),
  ...[
    "  Patient 200001 buffer (last 30 min, max 1800 rows):",
    "  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐",
    "  │ t-30 │ t-29 │ t-28 │ ...  │ t-2  │ t-1  │ t=0  │ next │",
    "  │ min  │ min  │ min  │      │ min  │ min  │(now) │overwrites t-30│",
    "  └──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘",
    "  New reading arrives → append → if len > 1800 → remove oldest",
  ].map(CODE),
  SP(),
  H2("12.2  Alert Deduplication — Preventing Alarm Fatigue"),
  P("Without deduplication, if a patient's vitals are in the CRITICAL zone, every new vital reading (once per second) would generate a new CRITICAL alert. That is 60 alerts per minute for one patient — the exact alarm fatigue problem we are solving."),
  P("The deduplication logic:"),
  ...[
    "  # alert_engine.py",
    "  class AlertEngine:",
    "      def __init__(self):",
    "          self._last_alert: dict = {}   # patient_id → (severity, timestamp)",
    "",
    "      def should_suppress(self, patient_id, severity) -> bool:",
    "          if patient_id in self._last_alert:",
    "              last_sev, last_time = self._last_alert[patient_id]",
    "              if last_sev == severity:",
    "                  if (now - last_time).seconds < 300:  # 5-minute window",
    "                      return True   # SUPPRESSED",
    "          self._last_alert[patient_id] = (severity, now)",
    "          return False",
  ].map(CODE),
  SP(),
  H2("12.3  The Full Per-Event Processing Loop"),
  ...[
    "  For each message from vitals.raw:",
    "  Step 1: Parse JSON → extract patient_id, timestamp, vitals dict",
    "  Step 2: Append to patient's CircularBuffer",
    "  Step 3: If buffer.size < 5 → skip scoring (not enough data yet)",
    "  Step 4: feature_engineering.rolling_features(buffer.to_dataframe())",
    "  Step 5: ICUDetector.score(feature_vector)",
    "          → news2_score, anomaly_score, deterioration_prob, contributors",
    "  Step 6: Publish to vitals.scored (always)",
    "  Step 7: AlertEngine.evaluate(score_result)",
    "          → if severity != NONE and not suppressed:",
    "             publish to vitals.alerts",
    "  Step 8: Increment Prometheus counters, record latency histogram",
    "  Step 9: Kafka commit offset (mark message as processed)",
  ].map(CODE),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 13 — DATA FORMATS: JSON, PARQUET, PANDAS
// ════════════════════════════════════════════════════════════════════════════
const s13 = [
  H1("13. Data Formats & Python Libraries"),
  H2("13.1  JSON — Kafka Message Format"),
  P("JSON (JavaScript Object Notation) is the wire format for all Kafka messages in AIOps-Care. It is human-readable, universally supported, and flexible."),
  ...[
    "  // vitals.raw message",
    "  {",
    '    "patient_id": "a3f7c8d1e2b4f5a6...",   // HMAC-SHA256 pseudonym',
    '    "icustay_id": 200001,',
    '    "timestamp": "2026-05-11T08:00:00Z",    // ISO 8601 UTC',
    '    "vitals": {',
    '        "heart_rate": 102.0,',
    '        "resp_rate": 22.0,',
    '        "spo2": 94.5,',
    '        "map": 78.0,',
    '        "temp": 37.8,',
    '        "gcs": 14',
    "    }",
    "  }",
  ].map(CODE),
  SP(),
  H2("13.2  Pandas — DataFrame Library"),
  P("Pandas is Python's primary data manipulation library. A DataFrame is a 2D table with named columns, like a spreadsheet in memory. We use it for:"),
  BL("Loading and pivoting MIMIC-III CHARTEVENTS (long → wide format)"),
  BL("Computing rolling window statistics (df.rolling(window=300).mean())"),
  BL("Feature engineering pipelines"),
  BL("Training dataset construction"),
  SP(),
  H2("13.3  NumPy — Numerical Computing"),
  P("NumPy provides fast N-dimensional arrays and mathematical functions. We use it for:"),
  BL("polyfit: computing linear regression slope for trend features (slope = np.polyfit(x, y, 1)[0])"),
  BL("Vectorised operations on feature arrays before passing to XGBoost"),
  BL("Normalisation of Isolation Forest scores"),
  SP(),
  H2("13.4  Apache Arrow / PyArrow — Parquet I/O"),
  P("PyArrow is the Python implementation of Apache Arrow — a columnar in-memory data format. We use it to read and write Parquet files. It is much faster than pandas alone for large datasets because it uses zero-copy reads and SIMD CPU instructions."),
  SP(),
  H2("13.5  Joblib — Model Serialisation"),
  P("Joblib serialises Python objects to disk. For ML models made of NumPy arrays (like XGBoost and Isolation Forest), joblib uses memory-mapped files and compressed NumPy-native format — 3–10x faster and smaller than Python's pickle. Used to persist trained models between training runs and inference deployment."),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 14 — PHASE DELIVERY PLAN
// ════════════════════════════════════════════════════════════════════════════
const deliveryConcepts = [
  ["1","Local Prototype","Docker Compose, Kafka, XGBoost, FastAPI, Isolation Forest, Synthetic data generator, WebSocket dashboard, Prometheus metrics, NEWS2 scoring","Prove the end-to-end pipeline works: vitals in → ML → alert out → dashboard in sub-second"],
  ["2","Testing & Validation","Pytest unit tests, SHAP explainability analysis, GitHub Actions CI, XGBoost hyperparameter tuning, NEWS2 accuracy validation against published clinical benchmarks","Validate the ML model performs to ROC-AUC ≥ 0.91. Ensure NEWS2 matches clinical reference tables exactly."],
  ["3","Kaggle MIMIC-III Data","MIMIC-III CHARTEVENTS, data_loader.py ETL, Parquet pipeline, HMAC-SHA256 pseudonymisation, real feature distribution validation","Replace synthetic data with 40,000 real ICU patients. Retrain models on real data. Compare feature distributions."],
  ["4","AWS EC2 Migration","AWS EC2, VPC, Subnets, Security Groups, IAM Roles, Elastic IPs, S3 for data/models, Route 53 (optional DNS)","Move all Docker Compose services to dedicated EC2 instances. Establish production-grade network topology."],
  ["5","AWS Managed Services","AWS MSK (Kafka), AWS RDS PostgreSQL, AWS Secrets Manager, AWS CloudWatch, AWS CloudTrail","Replace self-managed Kafka/DB with managed AWS services. Add HIPAA-compliant audit trail via CloudTrail."],
  ["6","Dashboard Enhancement","React or Plotly Dash, WebSocket streaming charts, Tailwind CSS, Chart.js, AWS CloudFront CDN","Add real-time vital sign trend charts, NEWS2 history graphs, alert timeline, and PDF report export."],
  ["7","LSTM Temporal Model","PyTorch, LSTM autoencoder, AWS SageMaker, model ensemble (XGBoost + IsoForest + LSTM)","Add deep learning model to capture 30-min temporal drift patterns missed by rolling stats."],
  ["8","Production Security","Keycloak SSO, OPA/Rego, TLS on Kafka, AWS WAF, penetration testing, RBAC enforcement on all API endpoints","Harden the system to production healthcare security standards. Conduct pen test."],
  ["9","Scalability","Kafka consumer groups, EC2 Auto Scaling, Locust load testing, Kafka partition strategy, horizontal scaling","Prove the system can handle 1000 simultaneous ICU beds with sub-second alert latency."],
  ["10","Clinical Pilot & Docs","Sphinx API docs, Postman collection, Grafana dashboards, clinical user guide, DAIOL6 oral exam preparation","Mock clinical pilot on MIMIC-III subset. Final documentation and oral exam demonstration materials."],
];

const s14 = [
  H1("14. 10-Phase Concept Delivery Plan"),
  P("Each phase introduces new technologies and concepts. This table maps the phase to the key concepts delivered:"),
  SP(),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[400,1300,2760,4900],
    rows:[
      new TableRow({ children:[hCell("#",400), hCell("Phase",1300), hCell("Key Technologies",2760), hCell("Concept Delivered",4900)] }),
      ...deliveryConcepts.map((r, i) => new TableRow({ children:[
        dCell(r[0], 400, i%2===0?C.gray:C.white, true, i===0?C.greenFg:C.darkBlue),
        dCell(r[1], 1300, i%2===0?C.gray:C.white, true),
        dCell(r[2], 2760, i%2===0?C.gray:C.white),
        dCell(r[3], 4900, i%2===0?C.gray:C.white),
      ]}))
    ]
  }),
  PB_()
];

// ════════════════════════════════════════════════════════════════════════════
// SECTION 15 — HOW EVERYTHING CONNECTS
// ════════════════════════════════════════════════════════════════════════════
const s15 = [
  H1("15. How Everything Connects — The Big Picture"),
  H2("15.1  Technology Dependency Map"),
  P("Understanding how each technology depends on the others is key to understanding the system:"),
  SP(),
  ...[
    "  AWS EC2 provides the compute infrastructure for all services",
    "       |",
    "       └── Docker (Phase 1–3) / bare Python processes (Phase 4+) run on EC2",
    "                |",
    "                ├── Kafka (event bus) connects ALL components loosely",
    "                |       ├── producer.py writes Kaggle/MIMIC-III data to vitals.raw",
    "                |       ├── consumer.py reads vitals.raw for ML processing",
    "                |       └── dashboard.py reads vitals.alerts for WebSocket push",
    "                |",
    "                ├── Pandas + NumPy process MIMIC-III Parquet → feature vectors",
    "                |       └── XGBoost + Isolation Forest consume feature vectors",
    "                |               └── NEWS2 + model outputs → AlertEngine",
    "                |",
    "                ├── FastAPI + WebSocket serve dashboard to clinician browsers",
    "                |       └── Keycloak + OPA gate access (who can see what)",
    "                |",
    "                ├── Prometheus scrapes metrics from consumer + dashboard",
    "                |       └── OpenTelemetry traces span the full event journey",
    "                |",
    "                └── HMAC-SHA256 protects patient IDs throughout the pipeline",
    "                    Joblib persists trained ML models between restarts",
    "                    SHAP explains model decisions to clinicians",
  ].map(CODE),
  SP(),
  H2("15.2  Why This Architecture Is AIOps"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2800,6560],
    rows:[
      new TableRow({ children:[hCell("AIOps Principle",2800), hCell("How AIOps-Care Implements It",6560)] }),
      new TableRow({ children:[dCell("Event-Driven",2800,C.gray), dCell("Kafka topics decouple every component. Each service reacts to events, not scheduled polling.",6560,C.gray)] }),
      new TableRow({ children:[dCell("AI-Augmented",2800), dCell("XGBoost + Isolation Forest replace manual threshold monitoring with probabilistic risk scoring.",6560)] }),
      new TableRow({ children:[dCell("Observable",2800,C.gray), dCell("Prometheus metrics + OTel traces + alert rules give full visibility into system health.",6560,C.gray)] }),
      new TableRow({ children:[dCell("Loosely Coupled",2800), dCell("Producer, consumer, dashboard, and notifications are independent processes connected only by Kafka.",6560)] }),
      new TableRow({ children:[dCell("Scalable",2800,C.gray), dCell("Kafka consumer groups + EC2 Auto Scaling enables 10 → 1000 ICU beds without architecture changes.",6560,C.gray)] }),
      new TableRow({ children:[dCell("Explainable",2800), dCell("NEWS2 clinical scores + SHAP feature importances make AI decisions auditable and trustworthy.",6560)] }),
      new TableRow({ children:[dCell("Secure",2800,C.gray), dCell("HMAC pseudonymisation + Keycloak + OPA + VPC + TLS satisfy HIPAA/GDPR requirements.",6560,C.gray)] }),
    ]
  }),
  SP(),
  H2("15.3  Final Summary Table — All Technologies"),
  new Table({ width:{size:9360,type:WidthType.DXA}, columnWidths:[2200,2000,5160],
    rows:[
      new TableRow({ children:[hCell("Technology",2200), hCell("Category",2000), hCell("Role in AIOps-Care",5160)] }),
      ...[
        ["Kaggle MIMIC-III","Dataset","Real ICU patient vitals; 40,000 admissions; heart of the ML training data"],
        ["Apache Kafka","Messaging","Event streaming backbone; decouples all components; enables replay + scale"],
        ["AWS EC2","Infrastructure","Cloud virtual machines for all production services from Phase 4+"],
        ["AWS S3","Storage","Hosts Kaggle MIMIC-III data and trained ML model artifacts"],
        ["AWS MSK","Managed Kafka","Fully managed Kafka replacing self-hosted broker in Phase 5+"],
        ["AWS RDS PostgreSQL","Database","Alert history store with 90-day retention for HIPAA compliance"],
        ["Docker Compose","Containerisation","Local orchestration of Kafka + Zookeeper + Prometheus for Phase 1–3"],
        ["Pandas + NumPy","Data Processing","CHARTEVENTS ETL, rolling feature computation, linear regression slopes"],
        ["PyArrow / Parquet","Data Format","Columnar storage; 10x compression vs CSV; fast column reads"],
        ["XGBoost","Supervised ML","Deterioration probability (0–1); ROC-AUC ~0.91 on proxy label"],
        ["Isolation Forest","Unsupervised ML","Anomaly detection without labels; catches novel failure modes"],
        ["NEWS2","Clinical Rule","Gold-standard clinical scoring; makes AI decisions auditable"],
        ["Joblib","Serialisation","Persist trained ML models; faster than pickle for NumPy arrays"],
        ["SHAP","Explainability","Feature attribution; explains which vital sign drove each alert"],
        ["FastAPI","API Framework","REST + WebSocket server; async-native; auto-generated API docs"],
        ["Uvicorn","ASGI Server","Runs FastAPI; supports async and WebSocket natively"],
        ["WebSocket","Protocol","Persistent browser connection; instant alert push with no polling"],
        ["Keycloak","Authentication","SSO identity provider; JWT issuance; role management"],
        ["Open Policy Agent","Authorisation","Rego-based RBAC; enforces ward-level access control"],
        ["HMAC-SHA256","Privacy","One-way patient ID pseudonymisation before any Kafka publish"],
        ["TLS","Encryption","Kafka inter-broker and client traffic encryption in Phase 4+"],
        ["Prometheus","Metrics","Time-series metrics scraping; alert rules; Grafana data source"],
        ["OpenTelemetry","Tracing","Distributed trace of each event from Kafka to dashboard"],
        ["Loguru","Logging","Structured application logs; ISO timestamps; WARNING+ in production"],
        ["Pytest","Testing","Unit + integration tests; NEWS2 accuracy; feature shape validation"],
        ["PyTorch LSTM","Deep Learning","Future Phase 7: temporal autoencoder for 30-min drift detection"],
        ["AWS SageMaker","ML Platform","Future Phase 7: GPU-backed LSTM training; managed notebook"],
      ].map((r, i) => new TableRow({ children:[
        dCell(r[0], 2200, i%2===0?C.gray:C.white, true, C.darkBlue),
        dCell(r[1], 2000, i%2===0?C.gray:C.white),
        dCell(r[2], 5160, i%2===0?C.gray:C.white),
      ]}))
    ]
  }),
];

// ════════════════════════════════════════════════════════════════════════════
// ASSEMBLE
// ════════════════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: { config: [
    { reference:"bul", levels:[{ level:0, format:LevelFormat.BULLET, text:"•", alignment:AlignmentType.LEFT,
        style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
    { reference:"num", levels:[{ level:0, format:LevelFormat.DECIMAL, text:"%1.", alignment:AlignmentType.LEFT,
        style:{ paragraph:{ indent:{ left:720, hanging:360 } } } }] },
  ]},
  styles: {
    default: { document: { run: { font:"Arial", size:20 } } },
    paragraphStyles: [
      { id:"Heading1", name:"Heading 1", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{ size:34, bold:true, font:"Arial", color:C.darkBlue },
        paragraph:{ spacing:{ before:400, after:140 }, outlineLevel:0 } },
      { id:"Heading2", name:"Heading 2", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{ size:26, bold:true, font:"Arial", color:C.midBlue },
        paragraph:{ spacing:{ before:280, after:100 }, outlineLevel:1 } },
      { id:"Heading3", name:"Heading 3", basedOn:"Normal", next:"Normal", quickFormat:true,
        run:{ size:22, bold:true, font:"Arial", color:C.teal },
        paragraph:{ spacing:{ before:200, after:80 }, outlineLevel:2 } },
    ]
  },
  sections: [{
    properties: { page: { size:{ width:12240, height:15840 }, margin:{ top:1080, right:1080, bottom:1080, left:1080 } } },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment:AlignmentType.CENTER,
      children:[
        new TextRun({ text:"AIOps-Care Concepts  |  Muhammad Raees  |  DAIOL6  |  Page ", font:"Arial", size:16, color:"888888" }),
        new TextRun({ children:[PageNumber.CURRENT], font:"Arial", size:16, color:"888888" }),
        new TextRun({ text:" of ", font:"Arial", size:16, color:"888888" }),
        new TextRun({ children:[PageNumber.TOTAL_PAGES], font:"Arial", size:16, color:"888888" }),
      ]
    })] }) },
    children: [
      ...titlePage, ...tocSection,
      ...s1, ...s2, ...s3, ...s4, ...s5,
      ...s6, ...s7, ...s8, ...s9, ...s10,
      ...s11, ...s12, ...s13, ...s14, ...s15,
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = "E:\\AIOps_Care_My perfromance\\AIOps_Care_Technology_Concepts.docx";
  fs.writeFileSync(out, buf);
  console.log("Written:", out, Math.round(buf.length/1024)+"KB");
}).catch(e => { console.error(e); process.exit(1); });

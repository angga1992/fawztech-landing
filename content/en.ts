// English copy. Must mirror the key structure of content/id.ts (checked by `satisfies Dictionary`).
// Voice: "we" for Fawz Tech, "you/your" for the client. Sentence case. No claims absent from the Indonesian copy.
// Translated by the dev team from landing-copy.json and MESSAGING-KIT.md; to be reviewed by the business team.

import type { Dictionary } from "./id";

export const en = {
  locale: "en",
  meta: {
    title: "Fawz Tech | Bespoke Software Solutions & Digital Strategy",
    description:
      "Fawz Tech builds custom software solutions: Web, Mobile, Desktop, and UI/UX specifically designed to optimize your business operations.",
    ogImage: "/og-image-1200x630.png",
    ogLocale: "en_US",
    orgDescription: "Custom software house specializing in Web, Mobile, Desktop, and UI/UX.",
  },
  skipLink: "Skip to content",
  header: {
    logoAria: "Fawz Tech, back to top",
    navAria: "Main Navigation",
    menuOpen: "Open menu",
    menuClose: "Close menu",
  },
  switcher: {
    /** {lang} is replaced with the target language name. */
    switchTo: "Switch language to {lang}",
    labelId: "Bahasa Indonesia",
    labelEn: "English",
  },
  nav: [
    { label: "Services", href: "#layanan" },
    { label: "How we work", href: "#cara-kerja" },
    { label: "Portfolio", href: "#portofolio" },
    { label: "Contact", href: "#kontak" },
  ],
  navCta: { label: "Start a Consultation", href: "#kontak" },
  hero: {
    eyebrow: "Software House · Bespoke Solutions",
    h1: "Tailored Software Solutions, Built Through Collaboration.",
    sub: "Web, Mobile, and Desktop development engineered around your unique business logic, not generic templates.",
    ctaPrimary: { label: "Discuss Your Idea", href: "#kontak" },
    ctaSecondary: { label: "See How We Work", href: "#cara-kerja" },
    strip: "Web · Mobile · Desktop · UI/UX",
  },
  problem: {
    eyebrow: "Operational Challenges",
    h2: "Every Business is Unique, Yet Off-the-Shelf Solutions Often Restrict Growth.",
    points: [
      { title: "Operations Constrained by Rigid Software", text: "Standard software often fails to adapt to your company's specific workflows." },
      {
        title: "Difficulty Finding Relevant Technology Partners",
        text: "Building an internal IT team is capital-intensive, while relying on freelancers brings continuity risks.",
      },
      { title: "Data Fragmentation Across Platforms", text: "Operational information scattered across spreadsheets and chats creates high inefficiency risks." },
    ],
    closing:
      "Fawz Tech was founded to bridge this gap: we immerse ourselves in your workflow to build systems that truly fit.",
  },
  services: {
    eyebrow: "Our Services",
    h2: "Solutions We Deliver",
    items: [
      {
        name: "Web",
        text: "Web applications and operational dashboards optimized for your business workflow efficiency.",
        image: "/illustrations/hero-dashboard.svg",
        width: 960,
        height: 640,
      },
      {
        name: "Mobile",
        text: "Android and iOS solutions designed for accessibility for both customers and field teams.",
        image: "/illustrations/app-mobile.svg",
        width: 420,
        height: 760,
      },
      {
        name: "Desktop",
        text: "Cross-platform applications (Windows, macOS, Linux) to boost productivity with maximum performance.",
        image: "/illustrations/app-desktop.svg",
        width: 960,
        height: 624,
      },
      {
        name: "UI/UX",
        text: "User research and interactive prototypes validated before the development phase begins.",
        image: "/illustrations/uiux-wireframe-to-design.svg",
        width: 960,
        height: 640,
      },
    ],
  },
  process: {
    eyebrow: "Methodology",
    h2: "Transforming Visions into Functional Digital Solutions",
    steps: [
      {
        n: "01",
        name: "Discovery",
        text: "We study your workflow to establish goals, scope, and accurate estimates.",
        image: "/illustrations/process-1-discovery.svg",
      },
      {
        n: "02",
        name: "Design",
        text: "Development of wireframes and interactive prototypes you can test before coding begins.",
        image: "/illustrations/process-2-design.svg",
      },
      {
        n: "03",
        name: "Build",
        text: "Iterative development with regular demonstrations to ensure progress aligns with expectations.",
        image: "/illustrations/process-3-build.svg",
      },
      {
        n: "04",
        name: "Launch & Support",
        text: "Planned system releases, team training, and ongoing support post-implementation.",
        image: "/illustrations/process-4-launch.svg",
      },
    ],
  },
  about: {
    eyebrow: "Who We Are",
    h2: "Fawz Tech, Established in 2022.",
    text: "We noticed that off-the-shelf applications rarely understand your business. We believe every business deserves a tailored approach.",
    slogan: "Your Business, Your Way.",
    image: "/illustrations/team-meeting.svg",
    stats: [
      { big: "2022", label: "the year we started" },
      { big: "Fawz", label: "victory, success" },
    ],
  },
  vision: {
    eyebrow: "Vision",
    h2: "Every Business Deserves a System That Truly Fits the Way It Works.",
    text: "We aim to be the technology partner businesses call first when they need a new system.",
  },
  mission: {
    eyebrow: "Mission",
    h2: "Our Four Commitments.",
    items: [
      { n: "01", title: "Listen First", text: "Understand your process before writing code.", image: "/illustrations/mission-1-listen.svg" },
      { n: "02", title: "Build Together", text: "You co-design and see regular demos.", image: "/illustrations/mission-2-together.svg" },
      { n: "03", title: "Build What Gets Used", text: "Simple, fast, and used every day.", image: "/illustrations/mission-3-used.svg" },
      { n: "04", title: "Support After Launch", text: "Ongoing training and support.", image: "/illustrations/mission-4-care.svg" },
    ],
  },
  values: {
    eyebrow: "Our Values",
    h2: "Our Five Values.",
    items: [
      { title: "Together", text: "Clients co-design." },
      { title: "Fit", text: "Follows your process." },
      { title: "Clear", text: "Transparent pricing and timelines." },
      { title: "Complete", text: "Still here after launch." },
      { title: "Honest", text: "Willing to say when it is not needed." },
    ],
  },
  catalogue: {
    eyebrow: "Catalogue",
    h2: "Starting Points You Can Choose From.",
    sub: "Every module is tailored to your business process.",
    items: [
      { name: "Finance & Accounting", text: "Bookkeeping and financial reports." },
      { name: "Preventive & Corrective Maintenance", text: "Maintenance schedules and repair tickets." },
      { name: "Web & Mobile App Security", text: "Security hardening for web and mobile applications." },
      { name: "E-commerce", text: "Online store with payments." },
      { name: "Smart Building & Smart Housing System", text: "Building and residential control and monitoring." },
      { name: "School & University System", text: "Academics, students, and administration." },
      { name: "POS & Inventory", text: "Works offline." },
      { name: "Attendance & HR", text: "Paperless leave requests." },
    ],
  },
  portfolio: {
    eyebrow: "Portfolio",
    h2: "Selected Work.",
    items: [
      { slug: "arfindo-bersinar", client: "Arfindo Bersinar", title: "Quality Management System", type: "Web \u00b7 Mobile" },
      { slug: "menya-sakura", client: "Menya Sakura", title: "Customer Loyalty App", type: "Mobile" },
      { slug: "museum-nasional", client: "Museum Nasional Indonesia", title: "Artefact Showcase App", type: "Desktop" },
      { slug: "kkara", client: "KKARA", title: "Cooperative Management App", type: "Web" },
    ],
    caseStudy: {
      slug: "arfindo-bersinar",
      eyebrow: "Case Study",
      title: "Arfindo Bersinar: Quality Management System",
      image: "/portfolio/arfindo-qms-dashboard-blurred.jpg",
      imageAlt: "Arfindo QMS dashboard: operations menu, PO summary, and job list",
      caption: "Arfindo QMS dashboard",
      blocks: [
        { label: "Challenge", text: "Business workflows ran entirely by hand. They needed a system that keeps every process under control." },
        {
          label: "What We Built",
          text: "A quality management system: PO lists (goods, services, calibration), per-person job assignments, an issue log, complaint tickets, master data, and role-based access.",
        },
        { label: "Outcome", text: "Processes that used to be manual now run in one system: recorded, owned, and monitored through a dashboard." },
      ],
    },
  },
  engage: {
    eyebrow: "How to Work With Us",
    h2: "Three Ways to Start.",
    items: [
      { n: "A", title: "Defined Project", text: "Price and timeline set after discovery.", image: "/illustrations/engage-1-project.svg" },
      { n: "B", title: "Monthly Team", text: "Monthly capacity with jointly agreed priorities.", image: "/illustrations/engage-2-monthly-team.svg" },
      { n: "C", title: "Maintenance", text: "Fixes and updates for systems already in production.", image: "/illustrations/engage-3-support.svg" },
    ],
  },
  contact: {
    eyebrow: "Get in Touch",
    h2: "Let's Discuss Your Vision.",
    sub: "Share your requirements through a message, and let's begin with a strategic discussion session.",
    /** Label tombol WhatsApp melayang (pojok kanan bawah). */
    whatsappFloatLabel: "Chat on WhatsApp",
    whatsappLabel: "Chat on WhatsApp",
    whatsappPrefill: "Hello Fawz Tech, I'd like to discuss developing an application for my business.",
    form: {
      submit: "Send Request",
      submitting: "Sending…",
      labels: {
        nama: "Full Name",
        kontak: "WhatsApp or Email",
        bisnis: "Company Name",
        bisnisOptional: "(optional)",
        kebutuhan: "Services Needed",
        cerita: "Describe Your Requirements",
        ceritaHint: "You may share key points, such as the operational processes you want to optimize.",
        setujuBefore: "I agree that my data will be used for communication purposes in accordance with the ",
        setujuLink: "Privacy Policy",
        setujuAfter: ".",
      },
      needs: [
        { value: "web", label: "Web" },
        { value: "mobile", label: "Mobile" },
        { value: "desktop", label: "Desktop" },
        { value: "uiux", label: "UI/UX" },
        { value: "belum", label: "Not yet determined" },
      ],
      /** {X} is replaced with the reply-time promise from configuration. */
      success: "Thank you. We will get back to you within {X} business days.",
      /** {n} is replaced with the remaining character count. */
      remaining: "{n} characters left.",
      honeypotLabel: "Leave this empty",
      openWhatsApp: "Open WhatsApp",
      recaptchaBefore: "This site is protected by reCAPTCHA and the Google ",
      recaptchaPrivacy: "Privacy Policy",
      recaptchaMiddle: " and ",
      recaptchaTerms: "Terms of Service",
      recaptchaAfter: " apply.",
    },
  },
  footer: {
    privacyLabel: "Privacy Policy",
    copyright: "Fawz Tech",
  },
  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription: "How Fawz Tech collects, uses, and stores the data you submit through the form on this site.",
    eyebrow: "Privacy Policy",
    h1: "Fawz Tech Privacy Policy",
    /** {date} is replaced with the formatted version date. */
    version: "Version {date}.",
    /** Tokens: {name}, {address}, {months}, {email}. */
    sections: [
      {
        h2: "Data Controller",
        blocks: [{ p: "{name}, located at {address}, is the data controller for the information you submit through this site." }],
      },
      {
        h2: "Information We Collect",
        blocks: [
          { p: "When you fill out the “Discuss Your Idea” form, we collect:" },
          {
            ul: [
              "Your full name;",
              "Your WhatsApp number or email address;",
              "Your company or business name (if provided);",
              "The type of service selected and the requirement description you provided;",
              "The referring page, campaign parameters (UTM), and referrer address;",
              "The time of consent and the version of the privacy policy agreed to.",
            ],
          },
          { p: "We only request information necessary to follow up on your request." },
        ],
      },
      {
        h2: "Purpose of Data Use",
        blocks: [
          {
            p: "Data is used to contact you, understand your operational needs, and follow up on requests for consultations or cost estimates. We are committed to not selling your data or using it for third-party advertising purposes.",
          },
        ],
      },
      {
        h2: "Legal Basis for Processing",
        blocks: [
          {
            p: "Processing is based on your consent, given by checking the consent box on the form. You have the right to withdraw your consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.",
          },
        ],
      },
      {
        h2: "Data Retention Period",
        blocks: [
          {
            p: "Data from potential clients that do not proceed to the engagement stage is kept for a maximum of {months} months after the last contact, then anonymized. Client data is kept for the duration of the engagement and as required by administrative and tax obligations.",
          },
        ],
      },
      {
        h2: "Your Rights",
        blocks: [
          {
            ul: [
              "Access and request a copy of your data;",
              "Correct inaccurate data;",
              "Request deletion or anonymization of data;",
              "Withdraw consent for data processing.",
            ],
          },
        ],
      },
      {
        h2: "How to Make a Request",
        blocks: [
          {
            p: "You may send your request via email to {email}. We will respond within a reasonable timeframe and reserve the right to request identity verification before processing.",
          },
        ],
      },
      {
        h2: "Third Parties Involved in Processing",
        blocks: [
          {
            ul: [
              "The hosting provider that operates this site and our internal systems;",
              "Google reCAPTCHA or Cloudflare Turnstile for spam prevention on the form (if enabled);",
              "Cookie-free analytics tools for aggregate visit statistics (if enabled).",
            ],
          },
          { p: "These parties only process data based on our strict instructions." },
        ],
      },
      {
        h2: "Changes to This Policy",
        blocks: [
          {
            p: "If this policy changes, the version date above is updated. The version you agreed to when submitting the form will remain on record with your data.",
          },
        ],
      },
    ],
  },
  notFound: {
    metaTitle: "Page Not Found",
    h1: "Page Not Found",
    text: "The address you are looking for is unavailable or has been moved.",
    homeId: "Return to Homepage (Indonesian)",
    homeEn: "Return to Homepage",
  },
} as const satisfies Dictionary;

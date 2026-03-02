/**
 * Seed script — populates MongoDB with realistic data.
 * Run once: npm run seed
 *
 * Safe to re-run: every collection is cleared before inserting.
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User         from "../src/models/User";
import Job          from "../src/models/Job";
import Application  from "../src/models/Application";
import Message      from "../src/models/Message";
import ScheduleEvent from "../src/models/ScheduleEvent";

const MONGODB_URI = process.env["MONGODB_URI"]!;

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("✔ Connected to MongoDB Atlas");

  // ── 1. Users (10 employers) ──────────────────────────────────
  await User.deleteMany({});

  const hash = (pw: string) => bcrypt.hash(pw, 12);

  const [
    shoaib, maria, alex, james, sarah,
    tom, emma, david, priya, lucas,
  ] = await Promise.all([
    User.create({ name: "Shoaib Ramim",   email: "email_changed@after.seeding", passwordHash: await hash("password_changed_after_seeding"), role: "employer", company: "QuickHire Labs", companyLogo: "quickhire" }),
    User.create({ name: "Maria Silva",    email: "email_changed@after.seeding",          passwordHash: await hash("password_changed_after_seeding"),         role: "employer", company: "Nomad",         companyLogo: "nomad"      }),
    User.create({ name: "Alex Chen",      email: "email_changed@after.seeding",         passwordHash: await hash("password_changed_after_seeding"),       role: "employer", company: "Dropbox",       companyLogo: "dropbox"    }),
    User.create({ name: "James Wilson",   email: "email_changed@after.seeding",           passwordHash: await hash("password_changed_after_seeding"),         role: "employer", company: "Tesla",         companyLogo: "tesla"      }),
    User.create({ name: "Sarah Kumar",    email: "email_changed@after.seeding",        passwordHash: await hash("password_changed_after_seeding"),       role: "employer", company: "Revolut",       companyLogo: "revolut"    }),
    User.create({ name: "Tom Richards",   email: "email_changed@after.seeding",            passwordHash: await hash("password_changed_after_seeding"),         role: "employer", company: "Canva",         companyLogo: "canva"      }),
    User.create({ name: "Emma Thompson",  email: "email_changed@after.seeding",           passwordHash: await hash("password_changed_after_seeding"),         role: "employer", company: "Figma",         companyLogo: "figma"      }),
    User.create({ name: "David Park",     email: "email_changed@after.seeding",         passwordHash: await hash("password_changed_after_seeding"),        role: "employer", company: "Stripe",        companyLogo: "stripe"     }),
    User.create({ name: "Priya Patel",    email: "email_changed@after.seeding",        passwordHash: await hash("password_changed_after_seeding"),       role: "employer", company: "Netlify",       companyLogo: "netlify"    }),
    User.create({ name: "Lucas Oliveira", email: "email_changed@after.seeding",      passwordHash: await hash("password_changed_after_seeding"),     role: "employer", company: "Terraform",     companyLogo: "terraform"  }),
  ]);
  console.log("✔ Seeded 10 employer users");

  // ── 2. Jobs (all 8 categories covered, 10+ featured) ─────────
  await Job.deleteMany({});

  const jobsData = [
    // ── DESIGN ──────────────────────────────────────────────────
    {
      title: "Senior Brand Designer",
      company: "Dropbox", companyLogoKey: "dropbox", postedBy: alex._id,
      location: "San Francisco, US", employmentType: "Full Time",
      tags: ["design", "business"], featured: true, status: "Active",
      description: `<p>Dropbox is seeking a <strong>Senior Brand Designer</strong> to lead the visual evolution of our brand across all touchpoints.</p><p>You'll work closely with product, marketing, and leadership to create compelling visual systems that tell our story and resonate with millions of users globally.</p><h3>Responsibilities</h3><ul><li>Own and evolve the Dropbox visual identity system</li><li>Create brand guidelines, templates, and asset libraries</li><li>Collaborate with cross-functional teams on launch campaigns</li><li>Mentor junior designers and run design critiques</li></ul><h3>Requirements</h3><ul><li>5+ years of brand design experience</li><li>Strong portfolio showcasing large-scale brand work</li><li>Proficiency in Figma, Illustrator, and Photoshop</li><li>Excellent communication and presentation skills</li></ul>`,
    },
    {
      title: "UI/UX Designer",
      company: "Figma", companyLogoKey: "figma", postedBy: emma._id,
      location: "London, United Kingdom", employmentType: "Full Time",
      tags: ["design"], featured: true, status: "Active",
      description: `<p>Figma is looking for a <strong>UI/UX Designer</strong> who is passionate about creating beautiful, intuitive interfaces used by millions of designers worldwide.</p><p>You'll be embedded in our product team, designing features end-to-end from discovery through to delivery.</p><h3>Responsibilities</h3><ul><li>Design user flows, wireframes, and high-fidelity prototypes</li><li>Conduct user research and usability testing sessions</li><li>Define and document design specifications for engineering</li><li>Maintain and evolve our internal design system</li></ul><h3>Requirements</h3><ul><li>3+ years of product design experience</li><li>Expert Figma user (naturally)</li><li>Solid understanding of accessibility standards</li><li>Ability to balance creative thinking with data-driven decisions</li></ul>`,
    },
    {
      title: "Visual Designer",
      company: "Canva", companyLogoKey: "canva", postedBy: tom._id,
      location: "Sydney, Australia", employmentType: "Full Time",
      tags: ["design"], featured: false, status: "Active",
      description: `<p>Canva is hiring a <strong>Visual Designer</strong> to craft stunning visuals that inspire our community of over 150 million users.</p><p>You'll work on marketing campaigns, product illustrations, and editorial content that brings our brand to life.</p><h3>Responsibilities</h3><ul><li>Create visuals for social, email, and paid marketing channels</li><li>Design product screenshots and in-app onboarding illustrations</li><li>Collaborate with the brand team on photo direction</li></ul><h3>Requirements</h3><ul><li>2+ years of visual or graphic design experience</li><li>Strong illustration and typography skills</li><li>Experience with Canva (obviously!) and Adobe Creative Suite</li></ul>`,
    },
    {
      title: "Product Designer",
      company: "Nomad", companyLogoKey: "nomad", postedBy: maria._id,
      location: "Paris, France", employmentType: "Remote",
      tags: ["design", "business"], featured: true, status: "Active",
      description: `<p>Nomad is seeking a versatile <strong>Product Designer</strong> to own design across our remote-work platform, helping distributed teams collaborate more effectively.</p><h3>Responsibilities</h3><ul><li>Lead design for new product features from ideation to launch</li><li>Run rapid prototyping cycles and user testing</li><li>Collaborate with developers to ensure pixel-perfect implementation</li></ul><h3>Requirements</h3><ul><li>3+ years of product design in a tech startup</li><li>Strong systems thinking and component-driven design mindset</li><li>Remote-first work ethic with excellent async communication</li></ul>`,
    },
    {
      title: "Lead UX Designer",
      company: "QuickHire Labs", companyLogoKey: "quickhire", postedBy: shoaib._id,
      location: "Dhaka, Bangladesh", employmentType: "Full Time",
      tags: ["design"], featured: true, status: "Active",
      description: `<p>QuickHire Labs is looking for a <strong>Lead UX Designer</strong> to define the experience vision for our job-matching platform serving thousands of job seekers and employers.</p><h3>Responsibilities</h3><ul><li>Own the end-to-end UX across web and mobile surfaces</li><li>Build and maintain our component library and design system</li><li>Run stakeholder workshops and ideation sessions</li><li>Manage and mentor a team of 2–3 designers</li></ul><h3>Requirements</h3><ul><li>5+ years of UX/product design experience</li><li>Experience designing for marketplace or platform products</li><li>Strong portfolio with case studies showcasing impact</li></ul>`,
    },

    // ── SALES ────────────────────────────────────────────────────
    {
      title: "Account Executive",
      company: "Revolut", companyLogoKey: "revolut", postedBy: sarah._id,
      location: "Berlin, Germany", employmentType: "Full Time",
      tags: ["sales", "business"], featured: true, status: "Active",
      description: `<p>Revolut is looking for a driven <strong>Account Executive</strong> to join our B2B sales team and help businesses switch to modern financial infrastructure.</p><h3>Responsibilities</h3><ul><li>Own the full sales cycle from prospecting to close</li><li>Build and manage a pipeline of SME and mid-market accounts</li><li>Deliver product demos tailored to prospect pain points</li><li>Collaborate with Solutions Engineers on complex deals</li></ul><h3>Requirements</h3><ul><li>2+ years of B2B SaaS sales experience</li><li>Proven track record of exceeding quota</li><li>Strong communication and negotiation skills</li><li>Fluent in English; German is a strong plus</li></ul>`,
    },
    {
      title: "Sales Manager — EMEA",
      company: "Stripe", companyLogoKey: "stripe", postedBy: david._id,
      location: "Amsterdam, Netherlands", employmentType: "Full Time",
      tags: ["sales"], featured: false, status: "Active",
      description: `<p>Stripe is hiring a <strong>Sales Manager for EMEA</strong> to grow our revenue across the region by building and leading a team of high-performing Account Executives.</p><h3>Responsibilities</h3><ul><li>Hire, onboard, and coach a team of 6–8 AEs</li><li>Set regional targets and track KPIs with leadership</li><li>Engage directly on strategic enterprise deals</li><li>Provide accurate forecasting to the VP of Sales</li></ul><h3>Requirements</h3><ul><li>5+ years of sales experience, 2+ in management</li><li>Experience in fintech or payments preferred</li><li>Data-driven approach to pipeline management (Salesforce)</li></ul>`,
    },
    {
      title: "Sales Development Representative",
      company: "Netlify", companyLogoKey: "netlify", postedBy: priya._id,
      location: "Toronto, Canada", employmentType: "Full Time",
      tags: ["sales"], featured: false, status: "Active",
      description: `<p>Netlify is seeking a motivated <strong>SDR</strong> to generate qualified pipeline for our growing enterprise sales team.</p><h3>Responsibilities</h3><ul><li>Research and prospect into ICP accounts via email, phone, and LinkedIn</li><li>Run discovery conversations to qualify inbound and outbound leads</li><li>Book meetings for Senior AEs and follow up diligently</li></ul><h3>Requirements</h3><ul><li>1+ year of outbound sales or BDR experience</li><li>Familiarity with web development and DevOps tools is a plus</li><li>High energy, resilient, and coachable mindset</li></ul>`,
    },

    // ── MARKETING ────────────────────────────────────────────────
    {
      title: "Email Marketing Manager",
      company: "Revolut", companyLogoKey: "revolut", postedBy: sarah._id,
      location: "Madrid, Spain", employmentType: "Full Time",
      tags: ["marketing"], featured: true, status: "Active",
      description: `<p>Revolut needs an <strong>Email Marketing Manager</strong> to own our lifecycle email strategy and drive activation, engagement, and retention across millions of users.</p><h3>Responsibilities</h3><ul><li>Design and execute automated email journeys using Braze</li><li>Own A/B testing strategy and optimise for open rate, CTR, and conversion</li><li>Collaborate with product teams on feature announcement campaigns</li><li>Analyse campaign performance and present insights to stakeholders</li></ul><h3>Requirements</h3><ul><li>3+ years of email marketing experience at scale</li><li>Hands-on experience with Braze, Klaviyo, or Iterable</li><li>Strong copywriting skills and attention to detail</li><li>Analytical mindset and comfortable with SQL basics</li></ul>`,
    },
    {
      title: "Social Media Manager",
      company: "Canva", companyLogoKey: "canva", postedBy: tom._id,
      location: "Los Angeles, US", employmentType: "Full Time",
      tags: ["marketing"], featured: false, status: "Active",
      description: `<p>Canva is hiring a creative <strong>Social Media Manager</strong> to grow our brand presence across Instagram, TikTok, LinkedIn, and X.</p><h3>Responsibilities</h3><ul><li>Plan and produce platform-native content calendars</li><li>Manage community engagement and respond to comments</li><li>Analyse performance metrics and adjust strategy accordingly</li><li>Collaborate with the influencer marketing team on campaigns</li></ul><h3>Requirements</h3><ul><li>2+ years of social media management for a consumer brand</li><li>Strong sense of visual storytelling and design eye</li><li>Experience with Sprout Social or Hootsuite</li></ul>`,
    },
    {
      title: "Brand Strategist",
      company: "QuickHire Labs", companyLogoKey: "quickhire", postedBy: shoaib._id,
      location: "Dhaka, Bangladesh", employmentType: "Full Time",
      tags: ["marketing", "business"], featured: false, status: "Active",
      description: `<p>QuickHire Labs is seeking a <strong>Brand Strategist</strong> to shape how job seekers and employers perceive and engage with our platform.</p><h3>Responsibilities</h3><ul><li>Define and evolve the brand positioning and messaging framework</li><li>Lead market research and competitive analysis initiatives</li><li>Partner with design and content teams on campaign briefs</li></ul><h3>Requirements</h3><ul><li>3+ years in brand strategy, preferably at a tech company</li><li>Strong analytical skills and narrative-driven thinking</li></ul>`,
    },
    {
      title: "Content Marketing Lead",
      company: "Netlify", companyLogoKey: "netlify", postedBy: priya._id,
      location: "Remote", employmentType: "Remote",
      tags: ["marketing"], featured: true, status: "Active",
      description: `<p>Netlify is looking for a <strong>Content Marketing Lead</strong> to build and execute a content engine that attracts developers and decision makers.</p><h3>Responsibilities</h3><ul><li>Develop a content strategy covering blog, guides, and video</li><li>Write and edit long-form technical and thought-leadership content</li><li>Work with SEO to drive organic growth for high-intent keywords</li><li>Manage freelance writers and a content editorial calendar</li></ul><h3>Requirements</h3><ul><li>4+ years of content marketing experience in B2B tech</li><li>Strong writing skills and familiarity with developer audiences</li><li>Experience with SEO tools: Ahrefs, Semrush, or similar</li></ul>`,
    },

    // ── FINANCE ──────────────────────────────────────────────────
    {
      title: "Financial Analyst",
      company: "Stripe", companyLogoKey: "stripe", postedBy: david._id,
      location: "Dublin, Ireland", employmentType: "Full Time",
      tags: ["finance"], featured: true, status: "Active",
      description: `<p>Stripe is hiring a sharp <strong>Financial Analyst</strong> to support FP&A, help build our annual operating plan, and provide analytical support for key business initiatives.</p><h3>Responsibilities</h3><ul><li>Build and maintain financial models for revenue, costs, and headcount</li><li>Lead monthly variance analysis and budget vs. actuals reporting</li><li>Prepare executive-level presentations for quarterly business reviews</li><li>Partner with GTM and Engineering on ROI analysis for investments</li></ul><h3>Requirements</h3><ul><li>2+ years of FP&A or investment banking experience</li><li>Advanced Excel/Google Sheets and SQL skills</li><li>Experience with Looker, Tableau, or similar BI tools</li><li>CPA, CFA or MBA a plus</li></ul>`,
    },
    {
      title: "Senior Accountant",
      company: "Revolut", companyLogoKey: "revolut", postedBy: sarah._id,
      location: "Vilnius, Lithuania", employmentType: "Full Time",
      tags: ["finance"], featured: false, status: "Active",
      description: `<p>Revolut is seeking a meticulous <strong>Senior Accountant</strong> to join our growing finance team and ensure accurate financial reporting across multiple jurisdictions.</p><h3>Responsibilities</h3><ul><li>Manage month-end close processes and prepare journal entries</li><li>Reconcile balance sheet accounts and resolve discrepancies</li><li>Support external audit and regulatory reporting requirements</li></ul><h3>Requirements</h3><ul><li>3+ years of accounting experience in a regulated environment</li><li>ACA/ACCA qualification preferred</li><li>Hands-on experience with NetSuite or SAP</li></ul>`,
    },
    {
      title: "Head of Finance",
      company: "Nomad", companyLogoKey: "nomad", postedBy: maria._id,
      location: "Tallinn, Estonia", employmentType: "Full Time",
      tags: ["finance", "business"], featured: false, status: "Active",
      description: `<p>Nomad is hiring its first <strong>Head of Finance</strong> to build financial infrastructure from the ground up and support our Series B growth journey.</p><h3>Responsibilities</h3><ul><li>Own all financial reporting, forecasting, and cash management</li><li>Lead fundraising processes and investor relations support</li><li>Implement finance tooling and internal controls</li><li>Hire and manage a lean finance team</li></ul><h3>Requirements</h3><ul><li>7+ years of finance experience including startup exposure</li><li>Proven experience scaling finance in a high-growth company</li><li>Strong communication skills for board-level reporting</li></ul>`,
    },

    // ── TECHNOLOGY ───────────────────────────────────────────────
    {
      title: "Full Stack Developer",
      company: "QuickHire Labs", companyLogoKey: "quickhire", postedBy: shoaib._id,
      location: "Dhaka, Bangladesh", employmentType: "Full Time",
      tags: ["technology"], featured: true, status: "Active",
      description: `<p>QuickHire Labs is hiring a <strong>Full Stack Developer</strong> to help build and scale our job marketplace platform used by thousands of employers and job seekers.</p><h3>Responsibilities</h3><ul><li>Build new features across the Next.js frontend and Node/Express backend</li><li>Design and optimise MongoDB schemas and API endpoints</li><li>Integrate third-party services (payment, notifications, AI matching)</li><li>Participate in code reviews and contribute to architecture decisions</li></ul><h3>Requirements</h3><ul><li>3+ years of full-stack development experience</li><li>Strong proficiency in TypeScript, React/Next.js, and Node.js</li><li>Experience with MongoDB, REST APIs, and cloud deployments (AWS/Vercel)</li><li>Passion for clean code and developer experience</li></ul>`,
    },
    {
      title: "Senior Backend Engineer",
      company: "Stripe", companyLogoKey: "stripe", postedBy: david._id,
      location: "Singapore", employmentType: "Full Time",
      tags: ["technology", "engineering"], featured: true, status: "Active",
      description: `<p>Stripe is seeking a <strong>Senior Backend Engineer</strong> to work on core payment infrastructure that processes hundreds of billions of dollars every year.</p><h3>Responsibilities</h3><ul><li>Design and build high-availability, low-latency distributed services</li><li>Own production reliability for critical payment processing pipelines</li><li>Collaborate with product and platform teams on API design</li><li>Mentor junior engineers and lead technical roadmap discussions</li></ul><h3>Requirements</h3><ul><li>5+ years of backend engineering experience</li><li>Deep knowledge of distributed systems and databases</li><li>Experience with Go, Java, or Ruby preferred</li><li>Strong understanding of financial systems is a plus</li></ul>`,
    },
    {
      title: "Data Analyst",
      company: "Tesla", companyLogoKey: "tesla", postedBy: james._id,
      location: "Austin, US", employmentType: "Full Time",
      tags: ["technology", "finance"], featured: false, status: "Active",
      description: `<p>Tesla is looking for a <strong>Data Analyst</strong> to extract insights from large-scale datasets that drive manufacturing efficiency, energy product decisions, and Autopilot improvements.</p><h3>Responsibilities</h3><ul><li>Build dashboards and reports using Tableau and internal BI tools</li><li>Write complex SQL queries to analyse vehicle telemetry and production data</li><li>Partner with engineering and operations teams on KPI definition</li><li>Identify anomalies and surface actionable findings to stakeholders</li></ul><h3>Requirements</h3><ul><li>2+ years of data analysis experience</li><li>Expert SQL skills; Python (pandas) is a strong plus</li><li>Tableau or Power BI proficiency</li><li>Curious, detail-oriented, and able to communicate findings clearly</li></ul>`,
    },
    {
      title: "Frontend Engineer",
      company: "Figma", companyLogoKey: "figma", postedBy: emma._id,
      location: "New York, US", employmentType: "Full Time",
      tags: ["technology"], featured: false, status: "Active",
      description: `<p>Figma is hiring a talented <strong>Frontend Engineer</strong> to build the features that help millions of designers collaborate in real-time.</p><h3>Responsibilities</h3><ul><li>Build performant, accessible UI components and features in React/TypeScript</li><li>Collaborate with designers to translate prototypes into polished products</li><li>Improve rendering performance and bundle size optimisations</li><li>Write thorough tests and maintain high engineering standards</li></ul><h3>Requirements</h3><ul><li>3+ years of frontend engineering experience</li><li>Deep React and TypeScript expertise</li><li>Experience with WebGL, canvas, or graphics programming is a bonus</li></ul>`,
    },

    // ── ENGINEERING ──────────────────────────────────────────────
    {
      title: "DevOps Engineer",
      company: "Terraform", companyLogoKey: "terraform", postedBy: lucas._id,
      location: "Hamburg, Germany", employmentType: "Full Time",
      tags: ["engineering", "technology"], featured: true, status: "Active",
      description: `<p>Terraform (HashiCorp) is looking for a <strong>DevOps Engineer</strong> to build and maintain the infrastructure that powers our cloud-native developer tooling used by Fortune 500 companies.</p><h3>Responsibilities</h3><ul><li>Manage Kubernetes clusters on AWS/GCP and maintain CI/CD pipelines</li><li>Implement Infrastructure as Code best practices with Terraform</li><li>Monitor system health, set up alerting, and lead incident response</li><li>Collaborate with engineering teams to improve deployment velocity</li></ul><h3>Requirements</h3><ul><li>3+ years of DevOps or SRE experience</li><li>Strong knowledge of Kubernetes, Docker, Helm, and Terraform</li><li>Experience with GitHub Actions, ArgoCD, or similar CI/CD tools</li><li>AWS or GCP certifications are a plus</li></ul>`,
    },
    {
      title: "Machine Learning Engineer",
      company: "Tesla", companyLogoKey: "tesla", postedBy: james._id,
      location: "Palo Alto, US", employmentType: "Full Time",
      tags: ["engineering", "technology"], featured: true, status: "Active",
      description: `<p>Tesla's Autopilot team is seeking a <strong>Machine Learning Engineer</strong> to develop and deploy neural networks that make full self-driving a reality.</p><h3>Responsibilities</h3><ul><li>Research, train, and evaluate deep learning models for perception and planning</li><li>Build scalable data pipelines for continuous model improvement</li><li>Optimise model inference for on-device deployment</li><li>Publish internal research and contribute to team knowledge sharing</li></ul><h3>Requirements</h3><ul><li>MS/PhD in Computer Science, ML, or related field preferred</li><li>Strong Python and PyTorch skills</li><li>Experience with large-scale distributed training (FSDP, DeepSpeed)</li></ul>`,
    },
    {
      title: "Software Architect",
      company: "Dropbox", companyLogoKey: "dropbox", postedBy: alex._id,
      location: "Seattle, US", employmentType: "Full Time",
      tags: ["engineering"], featured: false, status: "Active",
      description: `<p>Dropbox is hiring a <strong>Software Architect</strong> to define the technical direction for our core file synchronisation and collaboration platform.</p><h3>Responsibilities</h3><ul><li>Design scalable, maintainable system architectures for new product areas</li><li>Lead technical design reviews and set engineering standards</li><li>Evaluate and introduce new technologies and frameworks</li><li>Mentor senior engineers and drive cross-team technical alignment</li></ul><h3>Requirements</h3><ul><li>10+ years of software engineering experience with architecture background</li><li>Deep expertise in distributed systems and storage</li><li>Excellent written and verbal communication for technical docs and RFCs</li></ul>`,
    },

    // ── BUSINESS ────────────────────────────────────────────────
    {
      title: "Business Development Manager",
      company: "Nomad", companyLogoKey: "nomad", postedBy: maria._id,
      location: "Singapore", employmentType: "Full Time",
      tags: ["business"], featured: true, status: "Active",
      description: `<p>Nomad is looking for a <strong>Business Development Manager</strong> to forge strategic partnerships and expand our footprint across the Asia-Pacific market.</p><h3>Responsibilities</h3><ul><li>Identify, negotiate, and close partnership agreements with co-working spaces, employers, and relocation services</li><li>Build and maintain a robust BD pipeline in Salesforce</li><li>Represent Nomad at industry events and conferences</li></ul><h3>Requirements</h3><ul><li>4+ years of business development or partnerships experience</li><li>Strong network in APAC tech or startup ecosystem preferred</li><li>Excellent relationship-building and deal-closing skills</li></ul>`,
    },
    {
      title: "Operations Manager",
      company: "Canva", companyLogoKey: "canva", postedBy: tom._id,
      location: "Manila, Philippines", employmentType: "Full Time",
      tags: ["business"], featured: false, status: "Active",
      description: `<p>Canva is seeking an <strong>Operations Manager</strong> to streamline processes and scale our support and logistics operations across Southeast Asia.</p><h3>Responsibilities</h3><ul><li>Identify operational bottlenecks and implement scalable solutions</li><li>Own vendor management and third-party service SLAs</li><li>Collaborate with finance on budgeting and cost-efficiency initiatives</li></ul><h3>Requirements</h3><ul><li>3+ years of operations experience in a high-growth company</li><li>Strong project management skills; PMP or equivalent is a plus</li><li>Data-driven with experience in process documentation</li></ul>`,
    },
    {
      title: "Project Manager — Platform",
      company: "QuickHire Labs", companyLogoKey: "quickhire", postedBy: shoaib._id,
      location: "Dhaka, Bangladesh", employmentType: "Full Time",
      tags: ["business"], featured: false, status: "Active",
      description: `<p>QuickHire Labs is hiring an experienced <strong>Project Manager</strong> to drive product and engineering delivery, keeping our platform roadmap on track.</p><h3>Responsibilities</h3><ul><li>Manage sprint planning, stand-ups, and retrospectives for the core product team</li><li>Track milestones, risks, and dependencies using Jira and Notion</li><li>Facilitate alignment between engineering, design, and business stakeholders</li></ul><h3>Requirements</h3><ul><li>3+ years of PM or Scrum Master experience in software delivery</li><li>PMP, CSM, or PRINCE2 certification preferred</li><li>Excellent communication and stakeholder management skills</li></ul>`,
    },

    // ── HUMAN RESOURCE ───────────────────────────────────────────
    {
      title: "HR Manager",
      company: "Netlify", companyLogoKey: "netlify", postedBy: priya._id,
      location: "Lucerne, Switzerland", employmentType: "Full Time",
      tags: ["human-resource"], featured: false, status: "Active",
      description: `<p>Netlify is hiring an <strong>HR Manager</strong> to own people operations and culture as we grow our global remote-first team past 200 employees.</p><h3>Responsibilities</h3><ul><li>Lead end-to-end recruitment for technical and GTM roles</li><li>Run performance review cycles and manage compensation benchmarking</li><li>Develop onboarding programmes and L&D initiatives</li><li>Act as a trusted partner to managers on employee relations</li></ul><h3>Requirements</h3><ul><li>4+ years of HR generalist or HRBP experience</li><li>Experience in a remote or distributed team environment</li><li>SHRM-CP or PHR certification preferred</li></ul>`,
    },
    {
      title: "Talent Acquisition Specialist",
      company: "Stripe", companyLogoKey: "stripe", postedBy: david._id,
      location: "Dublin, Ireland", employmentType: "Full Time",
      tags: ["human-resource"], featured: false, status: "Active",
      description: `<p>Stripe is looking for a <strong>Talent Acquisition Specialist</strong> to help scale our engineering and product teams in EMEA by attracting world-class talent.</p><h3>Responsibilities</h3><ul><li>Own full-cycle recruitment for technical roles across EMEA</li><li>Build diverse talent pipelines through sourcing, events, and referrals</li><li>Partner with hiring managers to define role requirements and scorecards</li><li>Track recruiting metrics and improve time-to-fill and quality-of-hire</li></ul><h3>Requirements</h3><ul><li>2+ years of in-house or agency tech recruiting experience</li><li>Proficiency with Greenhouse or Lever ATS</li><li>Strong sourcing skills — Boolean, LinkedIn Recruiter, GitHub</li></ul>`,
    },
    {
      title: "People Operations Lead",
      company: "Tesla", companyLogoKey: "tesla", postedBy: james._id,
      location: "Austin, US", employmentType: "Full Time",
      tags: ["human-resource", "business"], featured: false, status: "Active",
      description: `<p>Tesla is seeking a <strong>People Operations Lead</strong> to build scalable HR systems and programmes that support rapid team growth across our Gigafactory operations.</p><h3>Responsibilities</h3><ul><li>Design and implement HRIS workflows, onboarding automation, and compliance processes</li><li>Lead benefits administration and manage relationships with HR vendors</li><li>Partner with plant managers on workforce planning and retention strategies</li></ul><h3>Requirements</h3><ul><li>5+ years of HR operations experience, preferably in manufacturing or tech</li><li>Experience with Workday, BambooHR, or equivalent HRIS</li><li>Strong analytical approach to people data and reporting</li></ul>`,
    },
  ];

  const insertedJobs = await Job.insertMany(jobsData);
  console.log(`✔ Seeded ${insertedJobs.length} jobs (${jobsData.filter((j) => j.featured).length} featured)`);

  // ── 3. Applications ──────────────────────────────────────────
  await Application.deleteMany({});
  const appData = [
    { job: insertedJobs[0],  name: "Alice Nguyen",    email: "alice@example.com",    resumeLink: "https://example.com/alice",    coverNote: "Big fan of Dropbox! Excited to bring my 6 years of brand experience.",    status: "Shortlisted" },
    { job: insertedJobs[1],  name: "Carlos Mendez",   email: "carlos@example.com",   resumeLink: "https://example.com/carlos",   coverNote: "I've been using Figma daily for 4 years and want to help shape its future.", status: "Reviewed"    },
    { job: insertedJobs[5],  name: "Priya Singh",     email: "priya.s@example.com",  resumeLink: "https://example.com/priya",    coverNote: "Revolut's mission to disrupt banking aligns perfectly with my background.",   status: "Pending"     },
    { job: insertedJobs[8],  name: "Liam O'Brien",    email: "liam@example.com",     resumeLink: "https://example.com/liam",     coverNote: "I've grown lifecycle email revenue by 40% at my current role.",             status: "Shortlisted" },
    { job: insertedJobs[15], name: "Yuki Tanaka",     email: "yuki@example.com",     resumeLink: "https://example.com/yuki",     coverNote: "Experienced full-stack dev looking to make an impact at a growing startup.", status: "Reviewed"    },
    { job: insertedJobs[16], name: "Sofia Adams",     email: "sofia@example.com",    resumeLink: "https://example.com/sofia",    coverNote: "Stripe's engineering culture is exactly what I've been looking for.",        status: "Shortlisted" },
    { job: insertedJobs[19], name: "Ethan Brooks",    email: "ethan@example.com",    resumeLink: "https://example.com/ethan",    coverNote: "3 years of DevOps at scale — happy to demo my Terraform modules!",           status: "Pending"     },
    { job: insertedJobs[22], name: "Mia Chen",        email: "mia@example.com",      resumeLink: "https://example.com/mia",      coverNote: "I closed $2M in partnership deals last year across APAC.",                  status: "Reviewed"    },
    { job: insertedJobs[0],  name: "Ravi Sharma",     email: "ravi@example.com",     resumeLink: "https://example.com/ravi",     coverNote: "Passionate about building brand systems that scale.",                       status: "Reviewed"    },
    { job: insertedJobs[12], name: "Ifeoma Okafor",   email: "ifeoma@example.com",   resumeLink: "https://example.com/ifeoma",   coverNote: "CFA Level 3 candidate with 3 years at Goldman Sachs.",                     status: "Shortlisted" },
    { job: insertedJobs[15], name: "Ben Howarth",     email: "ben@example.com",      resumeLink: "https://example.com/ben",      coverNote: "Love the QuickHire product — built something similar at a previous role.",  status: "Pending"     },
    { job: insertedJobs[20], name: "Nadia Volkov",    email: "nadia@example.com",    resumeLink: "https://example.com/nadia",    coverNote: "Former Tesla intern with a PhD in computer vision.",                        status: "Reviewed"    },
  ] as const;

  await Application.insertMany(appData.map((a) => ({
    jobId:      a.job._id,
    name:       a.name,
    email:      a.email,
    resumeLink: a.resumeLink,
    coverNote:  a.coverNote,
    status:     a.status,
  })));

  // Update applicant counts
  await Job.updateMany({}, { $set: { applicantCount: 0 } });
  await Promise.all(appData.map((a) => Job.findByIdAndUpdate(a.job._id, { $inc: { applicantCount: 1 } })));
  console.log(`✔ Seeded ${appData.length} applications`);

  // ── 4. Messages ──────────────────────────────────────────────
  await Message.deleteMany({});
  await Message.insertMany([
    { ownerId: shoaib._id, from: "Alice Nguyen",   preview: "Hi Shoaib, I've submitted my UX portfolio as requested. Looking forward to hearing from you!", time: "1h ago",  unread: true  },
    { ownerId: shoaib._id, from: "Yuki Tanaka",    preview: "Thank you for shortlisting me! I'm available for a technical interview any day this week.",      time: "3h ago",  unread: true  },
    { ownerId: shoaib._id, from: "Ethan Brooks",   preview: "Hey, just following up on the DevOps Engineer role. Let me know if you need more info!",          time: "1d ago",  unread: false },
    { ownerId: shoaib._id, from: "Ben Howarth",    preview: "Huge fan of what you're building at QuickHire Labs. Would love to chat about the Full Stack role.", time: "2d ago",  unread: false },
    { ownerId: shoaib._id, from: "Nadia Volkov",   preview: "I noticed the ML Engineer role requires PyTorch — attached is a link to my published model.",      time: "3d ago",  unread: false },
    { ownerId: shoaib._id, from: "Ifeoma Okafor",  preview: "Can you share more details about the financial analyst growth path at QuickHire Labs?",            time: "4d ago",  unread: false },
  ]);
  console.log("✔ Seeded 6 messages for Shoaib");

  // ── 5. Schedule events ───────────────────────────────────────
  await ScheduleEvent.deleteMany({});
  await ScheduleEvent.insertMany([
    { ownerId: shoaib._id, title: "Interview: Alice Nguyen — Lead UX Designer",   time: "10:00 AM", date: "Mar 3, 2026",  type: "Interview",  withPerson: "Alice Nguyen"   },
    { ownerId: shoaib._id, title: "Technical Screen: Yuki Tanaka",                time: "2:00 PM",  date: "Mar 3, 2026",  type: "Interview",  withPerson: "Yuki Tanaka"    },
    { ownerId: shoaib._id, title: "Engineering Team Sync",                         time: "9:30 AM",  date: "Mar 4, 2026",  type: "Meeting"  },
    { ownerId: shoaib._id, title: "Interview: Ben Howarth — Full Stack Dev",       time: "11:00 AM", date: "Mar 5, 2026",  type: "Interview",  withPerson: "Ben Howarth"    },
    { ownerId: shoaib._id, title: "Resume Review — Finance Applications",          time: "3:00 PM",  date: "Mar 5, 2026",  type: "Review"   },
    { ownerId: shoaib._id, title: "Q2 Roadmap Planning",                           time: "10:00 AM", date: "Mar 6, 2026",  type: "Meeting"  },
  ]);
  console.log("✔ Seeded 6 schedule events for Shoaib");

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const baseUrl = 'https://hybridads.ai';

const pages = [
  {
    slug: '',
    title: 'Hybrid Ads – AI Systems Integrator & Paid Ads Agency',
    description:
      'Hybrid Ads builds AI systems and manages paid ads on Google, Meta, TikTok & more. Cut digital labor costs, scale smarter. 2M+ leads generated.',
    h1: 'AI Systems Integrator and Paid Ads Agency',
    intro:
      'Hybrid Ads builds production-grade AI systems and runs paid advertising across Google, Meta, TikTok, X, and LinkedIn for growing brands worldwide.',
    bullets: [
      'Autonomous AI agents, RAG pipelines, and voice AI shipped to production',
      'Paid ad management across Google Ads, Meta Ads, TikTok Ads, and LinkedIn',
      'Unified ad performance dashboards with AI-powered insights',
      '2M+ leads generated across 3,000+ ad campaigns since 2012',
    ],
  },
  {
    slug: 'ai-agency',
    title: 'AI Systems Integrator – Agents, RAG & Voice AI | Hybrid Ads',
    description:
      'Custom AI systems built for production: autonomous agents, RAG pipelines, voice AI, LLM fine-tuning & on-device ML. 50+ systems shipped to 2M+ users.',
    h1: 'AI Systems Integrator: Agents, RAG, and Voice AI',
    intro:
      'We design, build, and ship production-grade AI systems for brands that need more than a prompt library. From autonomous agents to on-device inference, we cover the full stack.',
    bullets: [
      'Autonomous multi-agent systems with tool use and guardrails',
      'Retrieval-augmented generation (RAG) over private knowledge bases',
      'Voice AI, call automation, and conversational assistants',
      'LLM fine-tuning, evaluation, and cost-optimized deployment',
      'On-device and edge AI for mobile and embedded targets',
    ],
  },
  {
    slug: 'ai-visibility',
    title: 'Become the Business AI Recommends | AI Visibility by Hybrid Ads',
    description:
      'Hybrid Ads makes local service businesses visible in ChatGPT, Perplexity, Gemini & Google AI Overviews — so AI recommends you, sends you booked jobs, and lowers your cost per lead.',
    h1: 'Get Recommended by ChatGPT, Perplexity, Gemini, and Google AI',
    intro:
      'AI Visibility is search engine optimization built for the AI era. We structure your business so ChatGPT, Perplexity, Gemini, and Google AI Overviews confidently recommend you when customers ask for a service in your category.',
    bullets: [
      'Local business AI optimization for service categories',
      'Structured data, review signals, and citation coverage',
      'Recommendation tracking across ChatGPT, Perplexity, Gemini, and Grok',
      'Lower cost per lead than traditional paid channels',
    ],
  },
  {
    slug: 'gtm-service',
    title: 'AI Go-To-Market Sales Team – $0.03/Email | Hybrid Ads',
    description:
      'Deploy a fully autonomous AI sales team of 7 agents. Prospect, personalize, and outreach 24/7 at $0.03 per email. No contracts, no minimums, live in 24 hours.',
    h1: 'AI Sales Team: 7 Autonomous Agents for $0.03 per Email',
    intro:
      'Our AI Go-To-Market service deploys a fully autonomous seven-agent sales team that prospects, researches, personalizes, and sends outbound emails 24/7 at $0.03 per email.',
    bullets: [
      'Seven specialized AI agents covering the full outbound workflow',
      'ICP definition, prospect enrichment, and per-lead personalization',
      'Live in under 24 hours, no long-term contracts, no minimums',
      'Transparent per-email pricing that scales with your pipeline',
    ],
  },
  {
    slug: 'content-lab',
    title: 'AI Content Lab – AI Content Generator | Hybrid Ads',
    description:
      'Generate platform-optimized social media content powered by Claude AI. Multi-project workspace with URL source extraction, tone control, and Grok Aurora image prompts.',
    h1: 'AI Content Lab: Platform-Optimized Social Media Generation',
    intro:
      'Content Lab is a multi-project AI content workspace powered by Claude. Pull sources from any URL, control tone and format, and generate publish-ready posts for every major platform.',
    bullets: [
      'Multi-project workspace with saved research sources',
      'Platform-specific formatting for X, LinkedIn, Instagram, and TikTok',
      'Fine-grained tone, voice, and length controls',
      'Grok Aurora image prompt generation paired with each post',
    ],
  },
  {
    slug: 'nemo-claw',
    title: 'NemoClaw Enterprise AI Agents | Secure Agentic AI for Marketing & Ads',
    description:
      'Deploy production-grade, sandboxed AI agents with NVIDIA NemoClaw and NeMo Agent Toolkit — built by Hybrid Ads for enterprise paid media teams.',
    h1: 'Enterprise-Grade AI Agents for Paid Media Teams',
    intro:
      'NemoClaw is our enterprise agent stack, built on NVIDIA NeMo Agent Toolkit. Deploy sandboxed, observable, production-ready AI agents for marketing operations and paid media workflows.',
    bullets: [
      'Sandboxed execution with full observability and audit trails',
      'Integrations for Google Ads, Meta, TikTok, and analytics platforms',
      'Human-in-the-loop review gates for budget-sensitive actions',
      'Deployable on your infrastructure or ours',
    ],
  },
  {
    slug: 'ai-score',
    title: 'AI Publisher Score – Free AI Visibility Audit | Hybrid Ads',
    description:
      'Discover how ChatGPT, Gemini, Copilot, Grok & Perplexity describe your business. Get your free AI Publisher Score and visibility report in seconds.',
    h1: 'Free AI Publisher Score: See How AI Describes Your Business',
    intro:
      'Enter any business URL to see how ChatGPT, Gemini, Copilot, Grok, and Perplexity describe you today, where they get it wrong, and how to raise your score.',
    bullets: [
      'Instant visibility snapshot across five leading AI assistants',
      'Category-level ranking against local competitors',
      'Concrete recommendations to improve how AI describes you',
      'Free to run, no signup required',
    ],
  },
  {
    slug: 'dashboard',
    title: 'Ad Analytics Dashboard – Google, Meta, TikTok & LinkedIn',
    description:
      'Unify Google, Meta, LinkedIn & TikTok ad data in one AI-powered dashboard. Surface insights, eliminate data silos, and optimize toward 3x+ ROAS.',
    h1: 'Unified Ad Analytics for Google, Meta, TikTok, and LinkedIn',
    intro:
      'One AI-powered dashboard for every paid channel. Consolidate Google, Meta, TikTok, and LinkedIn ad performance, surface where budget is leaking, and act on prioritized recommendations.',
    bullets: [
      'Cross-channel spend, ROAS, and CPA in one view',
      'AI-generated insights on creative fatigue and audience drift',
      'Anomaly detection with actionable next steps',
      'Purpose-built for agencies and in-house paid media teams',
    ],
  },
  {
    slug: 'case-studies',
    title: 'Case Studies – Client Results & Growth Stories | Hybrid Ads',
    description:
      'See how Hybrid Ads delivers measurable results: $476K/month revenue, 602% booking increases, 101.9K Instagram views, and more. Real results for real businesses.',
    h1: 'Client Case Studies and Growth Results',
    intro:
      'Real results from real Hybrid Ads clients across e-commerce, local services, SaaS, and DTC brands.',
    bullets: [
      '$476K per month in tracked revenue for a limousine service',
      '602% increase in bookings for a hospitality client',
      '101.9K Instagram views from a single organic campaign',
      '3x+ ROAS improvement across dozens of paid accounts',
    ],
  },
  {
    slug: 'social-generator',
    title: 'Social Media Card Generator – Auto Brand Detection | Hybrid Ads',
    description:
      'Paste any website URL to auto-extract brand colors, logo, and identity. Generate download-ready social media cards for Instagram, LinkedIn, Twitter & Facebook.',
    h1: 'Social Media Card Generator with Automatic Brand Detection',
    intro:
      'Paste any website URL and our brand extractor pulls colors, logo, and typography. Then generate on-brand social cards ready to download for Instagram, LinkedIn, X, and Facebook.',
    bullets: [
      'Automatic logo and brand color extraction from any URL',
      'Templates for quotes, testimonials, features, and promotions',
      'Instant download in platform-ready sizes',
      'No design skills required',
    ],
  },
  {
    slug: 'about',
    title: 'About Hybrid Ads – AI Systems Integrators & PPC Experts',
    description:
      'Meet the team behind 50+ AI systems and 3000+ ad campaigns. 15 years of Web + Mobile Dev combined with production-grade AI engineering.',
    h1: 'About Hybrid Ads',
    intro:
      'Hybrid Ads is an AI Systems Integrator and paid advertising agency founded in 2012. We combine 15 years of full-stack web and mobile engineering with production-grade AI to ship systems that drive measurable business results.',
    bullets: [
      '50+ AI systems shipped to production',
      '3,000+ paid campaigns managed across every major platform',
      '2M+ leads generated for clients worldwide',
      'Fully remote, senior team based across North America',
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy – HybridAds.ai',
    description:
      'Read the HybridAds.ai Privacy Policy. We explain how your data is collected, used, and protected. GDPR & CCPA compliant.',
    h1: 'Privacy Policy',
    intro:
      'This page explains how HybridAds.ai collects, uses, stores, and protects your personal information. We are compliant with GDPR and CCPA and provide clear controls over your data.',
    bullets: [
      'What information we collect and why',
      'How we use and share your data',
      'Your rights to access, correct, and delete your data',
      'How to contact us with privacy questions',
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service – HybridAds.ai',
    description:
      'Review the HybridAds.ai Terms of Service covering usage rights, intellectual property, DMCA policy, and conditions for using our platform.',
    h1: 'Terms of Service',
    intro:
      'These Terms of Service govern your use of HybridAds.ai. Read them carefully — they cover acceptable use, intellectual property, disclaimers, limitations of liability, and DMCA procedures.',
    bullets: [
      'Acceptable use and account responsibilities',
      'Intellectual property and license terms',
      'Warranty disclaimers and liability limits',
      'DMCA takedown procedure',
    ],
  },
  {
    slug: 'sign-in',
    title: 'Sign In – Hybrid Ads',
    description:
      'Sign in to your Hybrid Ads account to access your AI workspace, sales team, content lab, and analytics dashboard.',
    h1: 'Sign In to Hybrid Ads',
    intro: 'Sign in to access your Hybrid Ads workspace.',
    bullets: [],
    noindex: true,
  },
  {
    slug: 'sign-up',
    title: 'Create Account – Hybrid Ads',
    description:
      'Create your free Hybrid Ads account. Access AI-powered sales automation, content generation, and ad performance analytics.',
    h1: 'Create Your Hybrid Ads Account',
    intro: 'Create your free Hybrid Ads account to get started.',
    bullets: [],
    noindex: true,
  },
  {
    slug: 'gtm-success',
    title: 'Welcome to Your AI Sales Workspace | Hybrid Ads',
    description:
      'Your AI Sales Team is ready. Access your workspace, configure your ICP, and launch your first campaign.',
    h1: 'Welcome to Your AI Sales Workspace',
    intro: 'Your account is ready. Continue to your workspace to configure your team.',
    bullets: [],
    noindex: true,
  },
  {
    slug: 'gtm-workspace',
    title: 'AI Sales Workspace – Dashboard | Hybrid Ads',
    description:
      'Manage your AI Sales Team, define your ideal customers, track campaigns, and monitor credits from your personalized workspace.',
    h1: 'AI Sales Workspace',
    intro: 'Manage your AI Sales Team and campaigns.',
    bullets: [],
    noindex: true,
  },
];

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
function escapeText(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderStaticContent(page) {
  const bullets = (page.bullets || []).map((b) => `<li>${escapeText(b)}</li>`).join('');
  return `<div class="prerender-seo" style="max-width:960px;margin:0 auto;padding:48px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111827;line-height:1.6;">
  <h1 style="font-size:32px;font-weight:700;margin:0 0 16px;">${escapeText(page.h1)}</h1>
  <p style="font-size:18px;margin:0 0 24px;color:#374151;">${escapeText(page.intro)}</p>
  ${bullets ? `<ul style="padding-left:20px;margin:0;">${bullets}</ul>` : ''}
</div>`;
}

function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) {
    throw new Error(`Prerender: could not find ${label} in dist/index.html`);
  }
  return html.replace(regex, replacement);
}

async function main() {
  const shell = await readFile(join(distDir, 'index.html'), 'utf8');

  for (const page of pages) {
    const url = page.slug ? `${baseUrl}/${page.slug}` : `${baseUrl}/`;

    let html = shell;
    html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeText(page.title)}</title>`, 'title');
    html = replaceOnce(
      html,
      /<meta name="description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="description" content="${escapeAttr(page.description)}" />`,
      'description meta'
    );
    html = replaceOnce(
      html,
      /<link rel="canonical"[^>]*>/,
      `<link rel="canonical" href="${url}" id="canonical-link" />`,
      'canonical link'
    );
    html = replaceOnce(
      html,
      /<meta property="og:url" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:url" content="${url}" />`,
      'og:url'
    );
    html = replaceOnce(
      html,
      /<meta property="og:title" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:title" content="${escapeAttr(page.title)}" />`,
      'og:title'
    );
    html = replaceOnce(
      html,
      /<meta property="og:description" content="[^"]*"\s*\/?\s*>/,
      `<meta property="og:description" content="${escapeAttr(page.description)}" />`,
      'og:description'
    );
    html = replaceOnce(
      html,
      /<meta name="twitter:title" content="[^"]*"\s*\/?\s*>/,
      `<meta name="twitter:title" content="${escapeAttr(page.title)}" />`,
      'twitter:title'
    );
    html = replaceOnce(
      html,
      /<meta name="twitter:description" content="[^"]*"\s*\/?\s*>/,
      `<meta name="twitter:description" content="${escapeAttr(page.description)}" />`,
      'twitter:description'
    );

    if (page.noindex) {
      html = html.replace(
        /<meta name="viewport"[^>]*>/,
        (m) => `${m}\n    <meta name="robots" content="noindex, nofollow" />`
      );
    }

    html = html.replace('<div id="root"></div>', `<div id="root">${renderStaticContent(page)}</div>`);

    const outDir = page.slug ? join(distDir, page.slug) : distDir;
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'index.html'), html);
    console.log(`prerender: wrote /${page.slug || ''} -> ${page.slug ? `${page.slug}/` : ''}index.html`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

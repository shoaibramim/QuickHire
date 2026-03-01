"use client";

// PricingCards — three-tier pricing display with auth-modal CTA.

import { useAuth } from "@/hooks/useAuth";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "forever",
    description: "Perfect for small teams just getting started.",
    badge: null,
    features: [
      "1 active job posting",
      "Basic applicant management",
      "Email notifications",
      "7-day listing duration",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 10,
    period: "per job posting",
    description: "For growing teams that need more reach and tools.",
    badge: "Most Popular",
    features: [
      "Unlimited job postings",
      "Featured listing placement",
      "Full applicant dashboard",
      "30-day listing duration",
      "Priority support",
    ],
    cta: "Start Posting",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "custom",
    description: "Tailored solutions for large organisations and agencies.",
    badge: null,
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "SLA guarantee",
      "Team collaboration tools",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingCards() {
  const { openAuthModal } = useAuth();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={[
            "relative flex flex-col rounded-2xl border p-8 transition-all duration-200",
            plan.highlighted
              ? "bg-brand-indigo border-brand-indigo shadow-xl text-white"
              : "bg-white border-gray-200 hover:border-brand-indigo hover:shadow-md",
          ].join(" ")}
        >
          {plan.badge && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              {plan.badge}
            </span>
          )}

          <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${plan.highlighted ? "text-indigo-200" : "text-subtitle"}`}>
            {plan.name}
          </p>

          <div className="mb-2">
            {plan.price === null ? (
              <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-heading-dark"}`}>
                Custom
              </span>
            ) : plan.price === 0 ? (
              <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-heading-dark"}`}>
                Free
              </span>
            ) : (
              <>
                <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-heading-dark"}`}>
                  ${plan.price}
                </span>
                <span className={`text-sm ml-1 ${plan.highlighted ? "text-indigo-200" : "text-subtitle"}`}>
                  {plan.period}
                </span>
              </>
            )}
          </div>

          <p className={`text-sm mb-6 ${plan.highlighted ? "text-indigo-100" : "text-subtitle"}`}>
            {plan.description}
          </p>

          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((f) => (
              <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlighted ? "text-indigo-100" : "text-subtitle"}`}>
                <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-indigo-200" : "text-brand-indigo"}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => plan.id === "enterprise" ? window.location.href = "/contact" : openAuthModal("signup")}
            className={[
              "w-full py-3 rounded-xl font-semibold text-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              plan.highlighted
                ? "bg-white text-brand-indigo hover:bg-indigo-50 focus-visible:ring-white"
                : "bg-brand-indigo text-white hover:bg-indigo-700 focus-visible:ring-brand-indigo",
            ].join(" ")}
          >
            {plan.cta}
          </button>
        </div>
      ))}
    </div>
  );
}

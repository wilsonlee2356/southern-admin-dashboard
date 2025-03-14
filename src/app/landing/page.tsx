import React from "react";
import Link from "next/link";

function InvoiceLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold">InvoicePro</div>
          <div className="space-x-6">
            <Link href="/login" className="transition hover:text-blue-200">
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-4 py-2 text-blue-600 transition hover:bg-blue-100"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="animate-fade-in mb-6 text-5xl font-bold md:text-6xl">
            Simplify Your Invoicing
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl md:text-2xl">
            Create, manage, and track professional invoices with ease. Save time
            and get paid faster.
          </p>
          <Link
            href="/signup"
            className="inline-block transform rounded-full bg-yellow-400 px-8 py-4 text-lg font-semibold text-blue-900 transition hover:scale-105 hover:bg-yellow-300"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="mb-12 text-center text-4xl font-bold">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Easy Invoice Creation",
              desc: "Generate professional invoices in minutes with customizable templates",
              icon: "📝",
            },
            {
              title: "Payment Tracking",
              desc: "Monitor payment status and send automated reminders",
              icon: "💰",
            },
            {
              title: "Client Management",
              desc: "Organize client information and billing history",
              icon: "👥",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="transform rounded-lg bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-4xl font-bold">
            Simple Pricing
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                plan: "Basic",
                price: "$9",
                features: ["5 Invoices/mo", "1 User", "Email Support"],
              },
              {
                plan: "Pro",
                price: "$29",
                features: ["Unlimited Invoices", "3 Users", "Priority Support"],
              },
              {
                plan: "Enterprise",
                price: "$99",
                features: [
                  "Unlimited Everything",
                  "10+ Users",
                  "Dedicated Support",
                ],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg bg-white p-6 shadow-md ${
                  index === 1 ? "scale-105 border-2 border-blue-500" : ""
                }`}
              >
                <h3 className="mb-2 text-2xl font-semibold">{plan.plan}</h3>
                <p className="mb-6 text-4xl font-bold">
                  {plan.price}
                  <span className="text-base text-gray-600">/mo</span>
                </p>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block rounded-full bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
                >
                  Choose Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="mb-6 text-4xl font-bold">Ready to Get Started?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          Join thousands of businesses streamlining their invoicing process
          today.
        </p>
        <Link
          href="/signup"
          className="inline-block transform rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:scale-105 hover:bg-blue-700"
        >
          Try InvoicePro Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto flex flex-col items-center justify-between px-6 md:flex-row">
          <div className="mb-4 text-lg font-semibold md:mb-0">InvoicePro</div>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-blue-300">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-300">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-blue-300">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-blue-300">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default InvoiceLandingPage;

import React, { useState } from 'react';
import { Check, HelpCircle, X, Shield, Sparkles, CreditCard, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function PricingPage() {
  const { user, updateProfile } = useAuthStore();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null); // plan details for checkout modal
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const plans = [
    {
      name: 'Free Tier',
      priceMonthly: 0,
      priceAnnual: 0,
      description: 'Ideal for trying out the AI engine features.',
      features: [
        '3 complete AI mock interviews',
        'Basic ATS compatibility scan',
        'Standard JavaScript sandbox access',
        'Basic text-based response grading'
      ],
      cta: 'Start Preparing',
      popular: false,
      color: 'border-light-border dark:border-dark-border bg-white dark:bg-dark-card'
    },
    {
      name: 'Pro Member',
      priceMonthly: 19,
      priceAnnual: 15,
      description: 'Perfect for software engineers preparing for tech loops.',
      features: [
        'Unlimited AI mock interviews',
        'Voice transcript recording & syntax grading',
        'Custom role configuration filters',
        'Detailed keyword advice & ideal responses',
        'Personalized roadmap tracking tools'
      ],
      cta: 'Go Pro Now',
      popular: true,
      color: 'border-indigo-500 bg-white dark:bg-dark-card ring-2 ring-indigo-500/20'
    },
    {
      name: 'Enterprise Team',
      priceMonthly: 49,
      priceAnnual: 39,
      description: 'Best for engineering squads and bootcamps.',
      features: [
        'Everything in Pro Tier',
        'Dedicated administrative dashboard',
        'Team growth analytics reporting',
        'Custom API key endpoints',
        'Priority SLA engineering support'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-light-border dark:border-dark-border bg-white dark:bg-dark-card'
    }
  ];

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaySuccess(true);
      // Update store tier
      updateProfile({ tier: selectedPlan.name });
      setTimeout(() => {
        setPaySuccess(false);
        setSelectedPlan(null); // close modal
      }, 2000);
    }, 1800);
  };

  const getPrice = (plan) => {
    return isAnnual ? plan.priceAnnual : plan.priceMonthly;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          Flexible Plans for Every Engineer
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
          Start for free to evaluate your current readiness, or unlock unlimited simulations, personalized coach advice, and voice transcript analysis.
        </p>

        {/* Toggle Switch */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!isAnnual ? 'text-indigo-500' : 'text-gray-400'}`}>Billed Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-12 h-6.5 rounded-full bg-light-hover dark:bg-dark-hover border border-light-border dark:border-dark-border flex items-center p-0.5 transition-colors"
          >
            <div className={`h-5.5 w-5.5 rounded-full bg-indigo-500 transition-transform ${isAnnual ? 'translate-x-5.5' : 'translate-x-0'}`} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold ${isAnnual ? 'text-indigo-500' : 'text-gray-400'}`}>Billed Annually</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full">Save 20%</span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`p-8 rounded-2xl border flex flex-col justify-between shadow-sm relative transition-all duration-300 hover:scale-[1.02] ${plan.color}`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-lg text-gray-800 dark:text-gray-100">{plan.name}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{plan.description}</p>
              </div>

              {/* Price value */}
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-display font-extrabold">${getPrice(plan)}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">/ {isAnnual ? 'month' : 'mo'}</span>
              </div>

              {/* Billed indicator */}
              {isAnnual && getPrice(plan) > 0 && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Billed annually (${getPrice(plan) * 12}/yr)</p>
              )}

              {/* Features List */}
              <ul className="space-y-3 pt-4 border-t border-light-border dark:border-dark-border">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA action button */}
            <div className="pt-8">
              <button
                onClick={() => {
                  if (plan.name === 'Enterprise Team' && getPrice(plan) > 0) {
                    alert('Redirecting to sales email setup...');
                  } else {
                    setSelectedPlan(plan);
                  }
                }}
                disabled={user?.tier === plan.name}
                className={`w-full py-3 rounded-xl text-xs font-semibold transition-all duration-200 border flex items-center justify-center gap-1 shadow-sm ${
                  user?.tier === plan.name
                    ? 'border-gray-500/20 bg-gray-500/5 text-gray-400 cursor-default'
                    : plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-transparent'
                      : 'border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300'
                }`}
              >
                <span>{user?.tier === plan.name ? 'Active Plan' : plan.cta}</span>
                {user?.tier !== plan.name && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Simulated Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {paySuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-gray-100">Payment Successful!</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Welcome to the {selectedPlan.name}! Your features are now active.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3 w-3 fill-current" /> Checkout Sandbox
                  </span>
                  <h3 className="text-lg font-display font-bold">Subscribe to {selectedPlan.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Billed now: <span className="font-bold text-gray-900 dark:text-gray-100">${getPrice(selectedPlan)}</span> / {isAnnual ? 'year' : 'month'}
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400">Card Number</label>
                    <div className="relative flex items-center">
                      <CreditCard className="absolute left-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400">Expiration Date</label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400">CVC Code</label>
                      <input
                        type="password"
                        required
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center p-3.5 rounded-xl bg-indigo-500/5 text-gray-500 dark:text-gray-400 border border-indigo-500/10">
                  <Shield className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                  <span className="text-[10px] leading-relaxed">
                    This checkout is a simulation. Do not input real credit card credentials. Any mock entries will complete subscription successfully.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  {isPaying ? 'Processing Transaction...' : `Confirm & Pay $${getPrice(selectedPlan)}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

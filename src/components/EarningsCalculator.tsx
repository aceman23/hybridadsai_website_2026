import { useState } from 'react';
import { Calculator, Clock, DollarSign, TrendingUp } from 'lucide-react';
import AnimateIn from './AnimateIn';

const tiers = [
  { id: 'developer', label: 'Developer', detail: 'Code review, prompts, and evaluation', min: 60, max: 70 },
  { id: 'specialist', label: 'Senior / AI-ML Specialist', detail: 'Expert reasoning and advanced tasks', min: 80, max: 90 },
];

const MIN_HOURS = 1;
const MAX_HOURS = 40;
const WEEKS_PER_MONTH = 52 / 12;

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function EarningsCalculator() {
  const [hours, setHours] = useState(10);
  const [tierId, setTierId] = useState(tiers[0].id);
  const tier = tiers.find((t) => t.id === tierId) ?? tiers[0];

  const weeklyMin = hours * tier.min;
  const weeklyMax = hours * tier.max;
  const monthlyMin = weeklyMin * WEEKS_PER_MONTH;
  const monthlyMax = weeklyMax * WEEKS_PER_MONTH;
  const hoursPercent = ((hours - MIN_HOURS) / (MAX_HOURS - MIN_HOURS)) * 100;

  return (
    <section className="py-20 bg-white" aria-labelledby="earnings-calculator-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn>
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Earnings calculator</span>
            <h2 id="earnings-calculator-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              Estimate what you could earn
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Choose your skill level and how many hours a week you&apos;d like to work to see a rough estimate.
            </p>
          </div>
        </AnimateIn>

        <AnimateIn delay={100}>
          <div className="mt-10 grid lg:grid-cols-5 rounded-2xl border border-gray-200 overflow-hidden shadow-xl shadow-gray-900/5">
            <div className="lg:col-span-3 p-6 sm:p-8 bg-gray-50 space-y-8">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Skill level</p>
                <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Skill level">
                  {tiers.map((t) => {
                    const active = t.id === tierId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setTierId(t.id)}
                        className={`text-left p-4 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                          active
                            ? 'bg-white border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="block text-sm font-bold text-gray-900">{t.label}</span>
                        <span className="block text-xs text-gray-500 mt-1">{t.detail}</span>
                        <span className={`block text-sm font-semibold mt-3 ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                          {currency.format(t.min)}–{currency.format(t.max)}/hr
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="hours-per-week" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Hours per week
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    {hours} {hours === 1 ? 'hour' : 'hours'}
                  </span>
                </div>
                <input
                  id="hours-per-week"
                  type="range"
                  min={MIN_HOURS}
                  max={MAX_HOURS}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-600"
                  style={{ background: `linear-gradient(to right, #059669 ${hoursPercent}%, #e5e7eb ${hoursPercent}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{MIN_HOURS} hr</span>
                  <span>20 hrs</span>
                  <span>{MAX_HOURS} hrs</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 sm:p-8 bg-gray-900 text-white flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                Estimated income
              </div>
              <p className="mt-4 text-sm text-gray-400">Per week</p>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums" aria-live="polite">
                {currency.format(weeklyMin)}
                <span className="text-gray-500"> – </span>
                {currency.format(weeklyMax)}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <TrendingUp className="w-4 h-4 text-emerald-300 mb-2" />
                  <p className="text-xs text-gray-400">Per month</p>
                  <p className="text-lg font-bold tabular-nums">
                    {currency.format(monthlyMin)}–{currency.format(monthlyMax)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <DollarSign className="w-4 h-4 text-amber-300 mb-2" />
                  <p className="text-xs text-gray-400">Hourly rate</p>
                  <p className="text-lg font-bold tabular-nums">
                    {currency.format(tier.min)}–{currency.format(tier.max)}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs text-gray-400 leading-relaxed">
                Estimates only. Actual pay depends on the project, your skills, and the quality of your work. Income and project availability are not guaranteed.
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

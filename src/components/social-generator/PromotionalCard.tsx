import { useRef, useState } from 'react';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import type { BrandData, PromoCardData } from './types';
import { getContrastColor, downloadCard } from './utils';

interface PromotionalCardProps {
  brand: BrandData;
}

const DEFAULT_PROMO: PromoCardData = {
  badge: 'SPECIAL OFFER',
  productName: 'Premium Plan',
  valueProp: 'Everything you need to scale your business',
  benefits: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Custom integrations'],
  originalPrice: '$199/mo',
  discountedPrice: '$99/mo',
  qualification: 'Limited time offer for new customers',
};

export default function PromotionalCard({ brand }: PromotionalCardProps) {
  const [promo, setPromo] = useState<PromoCardData>({ ...DEFAULT_PROMO });
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof PromoCardData, value: string | string[]) => {
    setPromo({ ...promo, [field]: value });
  };

  const updateBenefit = (index: number, value: string) => {
    const updated = [...promo.benefits];
    updated[index] = value;
    setPromo({ ...promo, benefits: updated });
  };

  const addBenefit = () => {
    setPromo({ ...promo, benefits: [...promo.benefits, 'New benefit'] });
  };

  const removeBenefit = (index: number) => {
    const updated = promo.benefits.filter((_, i) => i !== index);
    setPromo({ ...promo, benefits: updated });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await downloadCard(cardRef.current, `${brand.domain}-promo`);
    } finally {
      setDownloading(false);
    }
  };

  const textColor = getContrastColor(brand.primaryColor);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Promotional Card</h3>
        <p className="text-sm text-gray-500">600 x 600px - Perfect for Instagram & Facebook</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5 bg-white border border-gray-200 rounded-xl p-6">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Card Content</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Badge Text</label>
              <input
                value={promo.badge}
                onChange={(e) => updateField('badge', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Product Name</label>
              <input
                value={promo.productName}
                onChange={(e) => updateField('productName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Value Proposition</label>
            <input
              value={promo.valueProp}
              onChange={(e) => updateField('valueProp', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Benefits</label>
            {promo.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={b}
                  onChange={(e) => updateBenefit(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeBenefit(i)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={addBenefit}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              + Add benefit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Original Price</label>
              <input
                value={promo.originalPrice}
                onChange={(e) => updateField('originalPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Discounted Price</label>
              <input
                value={promo.discountedPrice}
                onChange={(e) => updateField('discountedPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Qualification Note</label>
            <input
              value={promo.qualification}
              onChange={(e) => updateField('qualification', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Live Preview</h4>

          <div
            ref={cardRef}
            style={{
              width: 600,
              height: 600,
              background: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.secondaryColor})`,
              color: textColor,
            }}
            className="rounded-2xl p-10 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: textColor, transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: textColor, transform: 'translate(-30%, 30%)' }} />

            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4" style={{ backgroundColor: `${textColor}25` }}>
                {promo.badge}
              </div>
              <h2 className="text-4xl font-bold mb-2">{promo.productName}</h2>
              <p className="text-lg opacity-90">{promo.valueProp}</p>
            </div>

            <div className="relative z-10 space-y-3 my-4">
              {promo.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: textColor, opacity: 0.8 }} />
                  <span className="text-base font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-lg line-through opacity-50">{promo.originalPrice}</span>
                <span className="text-4xl font-bold">{promo.discountedPrice}</span>
              </div>
              <p className="text-sm opacity-70">{promo.qualification}</p>

              <div className="mt-4 flex items-center gap-2 opacity-60">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-5 w-5 rounded object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs font-medium">{brand.domain}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}

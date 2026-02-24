const tickerItems = [
  { label: 'X', stat: 'Posts', value: '+378%' },
  { label: 'X', stat: 'Clicks', value: '+770%' },
  { label: 'X', stat: 'Retweets', value: '+168%' },
  { label: 'X', stat: 'Engagement Rate', value: '+18%' },
  { label: 'LinkedIn', stat: 'Video Views', value: '+999%' },
  { label: 'LinkedIn', stat: 'Reached Audience', value: '+999%' },
  { label: 'LinkedIn', stat: 'Profile Views', value: '+999%' },
  { label: 'LinkedIn', stat: 'Subscriber Count', value: '+425%' },
  { label: 'YouTube', stat: 'Video Views', value: '8,545' },
  { label: 'YouTube', stat: 'Watch Time', value: '+453%' },
  { label: 'YouTube', stat: 'Subscribers', value: '+425%' },
  { label: 'TikTok', stat: 'Video Views', value: '+999%' },
  { label: 'TikTok', stat: 'Reached Audience', value: '+999%' },
  { label: 'TikTok', stat: 'Profile Views', value: '+999%' },
  { label: 'Website', stat: 'Qualified Leads/Month', value: '70+' },
  { label: 'Website', stat: 'Total Leads (since Oct 1)', value: '273+' },
];

const platformColors: Record<string, { bg: string; text: string }> = {
  X: { bg: 'bg-gray-900', text: 'text-white' },
  LinkedIn: { bg: 'bg-blue-700', text: 'text-white' },
  YouTube: { bg: 'bg-red-600', text: 'text-white' },
  TikTok: { bg: 'bg-black', text: 'text-white' },
  Website: { bg: 'bg-green-600', text: 'text-white' },
};

export default function StatsTicker() {
  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-white/60 backdrop-blur-md border-y border-gray-200/60 overflow-hidden py-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-600 text-white text-xs font-black px-4 py-2 z-10 relative whitespace-nowrap mr-4 rounded-r-full">
          2024 ACHIEVEMENTS
        </div>
        <div className="overflow-hidden flex-1 relative">
          <div
            className="flex items-center gap-0 animate-ticker"
            style={{ width: 'max-content' }}
          >
            {doubled.map((item, i) => {
              const colors = platformColors[item.label] ?? { bg: 'bg-gray-700', text: 'text-white' };
              return (
                <div key={i} className="flex items-center gap-3 pr-10">
                  <span className={`${colors.bg} ${colors.text} text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap`}>
                    {item.label}
                  </span>
                  <span className="text-gray-500 text-sm whitespace-nowrap">{item.stat}</span>
                  <span className="text-gray-900 font-black text-sm whitespace-nowrap">{item.value}</span>
                  <span className="text-gray-300 mx-2 text-lg">|</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Legend() {
  const items = [
    { icon: '✅', label: 'Consistent', desc: 'This information is up to date and accurate', color: 'text-emerald-400' },
    { icon: '⚠️', label: 'Inconsistent Data', desc: 'There is a mismatch in the information', color: 'text-yellow-400' },
    { icon: '❌', label: 'Not Available', desc: 'This information could not be found', color: 'text-red-400' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">{item.icon}</span>
          <div>
            <span className={`text-xs font-semibold ${item.color}`}>{item.label}</span>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

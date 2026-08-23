import { Panel } from '../components/Panel';
import { Data } from '../components/Data';

const FULL_CATALOG = [
  { id: 'SKU-001', name: 'Premium Cloud Credits', price: 50000, stock: 120, category: 'Compute', active: true },
  { id: 'SKU-002', name: 'Enterprise API Tier', price: 150000, stock: 45, category: 'SaaS', active: true },
  { id: 'SKU-003', name: 'Dedicated Server', price: 25000, stock: 0, category: 'Compute', active: false },
  { id: 'SKU-004', name: 'Global CDN Bandwidth', price: 10000, stock: 999, category: 'Network', active: true },
  { id: 'SKU-005', name: 'Priority Support SLA', price: 75000, stock: 10, category: 'Service', active: true },
];

export function Catalog() {
  return (
    <div className="max-w-[1200px] mx-auto p-6 pt-24 min-h-screen relative z-10">
      
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="font-display text-3xl font-bold text-paper mb-2">Merchant Catalog</h1>
          <p className="font-body text-mist">Manage items exposed to autonomous agents.</p>
        </div>
        <button className="px-6 py-2 border border-signal-blue text-signal-blue rounded font-display font-bold uppercase tracking-wider hover:bg-signal-blue hover:text-ink transition-colors">
          Add Item
        </button>
      </div>

      <Panel className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-steel/30 bg-panel-2/50 text-xs font-display uppercase tracking-wider text-mist">
              <th className="p-4 font-normal">SKU</th>
              <th className="p-4 font-normal">Name</th>
              <th className="p-4 font-normal">Category</th>
              <th className="p-4 font-normal">Price (INR)</th>
              <th className="p-4 font-normal">Stock</th>
              <th className="p-4 font-normal">Agent Vis</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm text-paper divide-y divide-steel/20">
            {FULL_CATALOG.map((item) => (
              <tr key={item.id} className="hover:bg-steel/10 transition-colors">
                <td className="p-4">
                  <Data className="text-xs text-mist">{item.id}</Data>
                </td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-ink rounded border border-steel/30 text-xs text-mist font-display">
                    {item.category}
                  </span>
                </td>
                <td className="p-4">
                  <Data>₹{(item.price / 100).toLocaleString('en-IN')}</Data>
                </td>
                <td className="p-4">
                  {item.stock > 0 ? (
                    <Data className="text-mint">{item.stock}</Data>
                  ) : (
                    <span className="text-coral text-xs font-mono uppercase">Out of stock</span>
                  )}
                </td>
                <td className="p-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={item.active} readOnly />
                    <div className="w-9 h-5 bg-steel/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-paper after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-signal-blue"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

    </div>
  );
}

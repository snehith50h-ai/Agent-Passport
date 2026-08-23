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
    <div className="max-w-[1200px] mx-auto p-8 pt-32 min-h-screen relative z-10">
      
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="font-display text-[32px] font-bold text-paper mb-3">Merchant Catalog</h1>
          <p className="font-body text-[14px] text-mist">Manage items exposed to autonomous agents.</p>
        </div>
        <button className="px-6 py-3 border border-signal-blue text-signal-blue rounded text-[12px] font-display font-bold uppercase tracking-[0.05em] hover:bg-signal-blue hover:text-ink hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-blue focus-visible:outline-offset-2 transition-all duration-150">
          Add Item
        </button>
      </div>

      <Panel className="p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-steel/20 bg-panel-2/50 text-[12px] font-display uppercase tracking-[0.05em] text-mist">
              <th className="p-5 font-medium">SKU</th>
              <th className="p-5 font-medium">Name</th>
              <th className="p-5 font-medium">Category</th>
              <th className="p-5 font-medium">Price (INR)</th>
              <th className="p-5 font-medium">Stock</th>
              <th className="p-5 font-medium">Agent Vis</th>
            </tr>
          </thead>
          <tbody className="font-body text-[14px] text-paper divide-y divide-steel/10">
            {FULL_CATALOG.map((item) => (
              <tr key={item.id} className="hover:bg-steel/5 transition-colors">
                <td className="p-5">
                  <Data className="text-[12px] text-mist">{item.id}</Data>
                </td>
                <td className="p-5 font-medium">{item.name}</td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-ink rounded border border-steel/20 text-[12px] text-mist font-display">
                    {item.category}
                  </span>
                </td>
                <td className="p-5">
                  <Data className="font-medium">₹{(item.price / 100).toLocaleString('en-IN')}</Data>
                </td>
                <td className="p-5">
                  {item.stock > 0 ? (
                    <Data className="text-[12px] text-mint">{item.stock}</Data>
                  ) : (
                    <span className="text-coral text-[12px] font-mono uppercase">Out of stock</span>
                  )}
                </td>
                <td className="p-5">
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

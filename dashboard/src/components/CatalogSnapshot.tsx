import { ShoppingBag } from 'lucide-react';
import { Panel } from './Panel';
import { Data } from './Data';

const SNAPSHOT = [
  { id: 'SKU-001', name: 'Premium Cloud Credits', price: 50000, stock: 120 },
  { id: 'SKU-002', name: 'Enterprise API Tier', price: 150000, stock: 45 },
  { id: 'SKU-003', name: 'Dedicated Server', price: 25000, stock: 0 }, // blocked due to stock
];

export function CatalogSnapshot() {
  return (
    <Panel className="p-6">
      <div className="flex items-center gap-2 mb-6 text-mist">
        <ShoppingBag className="w-4 h-4" />
        <h2 className="text-[12px] uppercase tracking-[0.05em] font-display">Catalog Overview</h2>
      </div>

      <div className="space-y-3">
        {SNAPSHOT.map(item => (
          <div key={item.id} className="py-3 border-b border-steel/20 last:border-0 flex justify-between items-center group transition-colors hover:bg-steel/5 px-2 -mx-2 rounded">
            <div>
              <p className="text-[14px] text-paper font-body font-medium">{item.name}</p>
              <Data className="text-[12px] text-mist">{item.id}</Data>
            </div>
            <div className="text-right">
              <Data className="text-[14px] font-bold text-paper block">
                ₹{(item.price / 100).toLocaleString('en-IN')}
              </Data>
              {item.stock > 0 ? (
                <Data className="text-[12px] text-mint">{item.stock} in stock</Data>
              ) : (
                <span className="text-[10px] text-coral font-mono uppercase">Out of stock</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 border border-steel/30 rounded text-[12px] text-mist hover:text-paper hover:bg-steel/20 transition-all duration-150 hover:-translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-blue focus-visible:outline-offset-2 font-display uppercase tracking-[0.05em]">
        View Full Catalog
      </button>
    </Panel>
  );
}

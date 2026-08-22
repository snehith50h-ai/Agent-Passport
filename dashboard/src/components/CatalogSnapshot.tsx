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
        <h2 className="text-xs font-semibold uppercase tracking-wider font-display">Catalog Overview</h2>
      </div>

      <div className="space-y-3">
        {SNAPSHOT.map(item => (
          <div key={item.id} className="p-3 bg-panel-2 rounded border border-steel/30 flex justify-between items-center">
            <div>
              <p className="text-sm text-paper font-body">{item.name}</p>
              <Data className="text-[10px] text-mist">{item.id}</Data>
            </div>
            <div className="text-right">
              <Data className="text-sm font-bold text-paper block">
                ₹{(item.price / 100).toLocaleString('en-IN')}
              </Data>
              {item.stock > 0 ? (
                <Data className="text-[10px] text-mint">{item.stock} in stock</Data>
              ) : (
                <span className="text-[10px] text-coral font-mono uppercase">Out of stock</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 border border-steel/50 rounded text-xs text-mist hover:text-paper hover:bg-steel/20 transition-colors font-display uppercase tracking-wider">
        View Full Catalog
      </button>
    </Panel>
  );
}

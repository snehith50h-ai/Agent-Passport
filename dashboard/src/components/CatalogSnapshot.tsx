import { Package, ShoppingBag } from 'lucide-react';

const CATALOG = [
  { id: 'SKU-MBP-16', name: 'MacBook Pro 16"', price: 249900, stock: 42, blocked: false },
  { id: 'SKU-IPH-15P', name: 'iPhone 15 Pro', price: 129900, stock: 156, blocked: false },
  { id: 'SKU-AW-S9', name: 'Apple Watch S9', price: 41900, stock: 8, blocked: false },
  { id: 'GIFT-CARD-BULK', name: 'Corporate Gift Cards', price: 100000, stock: 1000, blocked: true },
];

export function CatalogSnapshot() {
  return (
    <div className="bg-panel/60 backdrop-blur-md border border-steel/50 rounded-xl p-6 shadow-2xl flex flex-col h-[320px]">
      <h2 className="text-mist text-xs font-semibold uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
        <Package className="w-4 h-4" />
        Live Catalog
      </h2>
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 -mr-2">
        {CATALOG.map(item => (
          <div 
            key={item.id} 
            className={`p-3 rounded-lg border ${item.blocked ? 'border-coral/30 bg-coral/5' : 'border-steel/30 bg-panel-2/50'} flex justify-between items-start`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-medium ${item.blocked ? 'text-coral' : 'text-paper'}`}>
                  {item.name}
                </p>
                {item.blocked && (
                  <span className="text-[9px] font-mono uppercase bg-coral/20 text-coral px-1.5 py-0.5 rounded">Blocked</span>
                )}
              </div>
              <p className="text-[10px] font-mono text-mist">{item.id}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-mono text-paper">₹{item.price.toLocaleString('en-IN')}</p>
              <p className={`text-xs font-mono mt-1 ${item.stock < 10 ? 'text-amber' : 'text-mist'}`}>
                {item.stock} in stock
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-steel/30 flex justify-between items-center text-xs font-mono text-mist">
        <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> Storefront API Active</span>
        <span className="text-mint">Sync: OK</span>
      </div>
    </div>
  );
}

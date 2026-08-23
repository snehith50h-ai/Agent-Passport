import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BgFlowLayer } from './components/BgFlowLayer';
import { useAuditFeed } from './hooks/useAuditFeed';
import { Landing } from './routes/Landing';
import { Console } from './routes/Console';
import { Policies } from './routes/Policies';
import { Catalog } from './routes/Catalog';
import { Nav } from './components/Nav';

function App() {
  const location = useLocation();
  const { logs, isLive } = useAuditFeed();
  const latestEvent = logs.length > 0 ? logs[0] : null;

  const showNav = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-ink text-paper font-sans relative selection:bg-signal-blue/30 overflow-x-hidden">
      <BgFlowLayer latestEvent={latestEvent} />
      
      {showNav && <Nav isLive={isLive} />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/console" element={<Console logs={logs} latestEvent={latestEvent} />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/catalog" element={<Catalog />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

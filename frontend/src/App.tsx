import React, { useState, useEffect } from 'react';
import TableView from './components/TableView';
import KanbanBoard from './components/KanbanBoard';
import CreateItemForm from './components/CreateItemForm';
import { actionItemsApi } from './api/actionItems';
import { ActionItem } from './types/ActionItem';

type ViewType = 'table' | 'kanban';

function App() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [view, setView] = useState<ViewType>('kanban');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await actionItemsApi.getAll(searchTerm ? { search: searchTerm } : {});
      setItems(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch action items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <header className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#00ff88', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#00a8ff', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <rect x="10" y="25" width="20" height="50" rx="4" fill="url(#logoGrad)" opacity="0.8"/>
                <rect x="35" y="15" width="20" height="60" rx="4" fill="url(#logoGrad)" opacity="0.6"/>
                <rect x="60" y="20" width="20" height="55" rx="4" fill="url(#logoGrad)" opacity="0.4"/>
                <rect x="85" y="30" width="10" height="45" rx="4" fill="url(#logoGrad)" opacity="0.9"/>
              </svg>
              <h1 className="text-2xl font-bold gradient-text">
                Action Kanban
              </h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              + New Item
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('kanban')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'kanban' 
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                view === 'table' 
                  ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30' 
                  : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              Table View
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search items..."
              className="input-glass w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] transition-colors text-gray-300"
            >
              Search
            </button>
          </form>
        </div>

        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#00ff88]/30 rounded-full animate-spin border-t-[#00ff88]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="animate-fadeIn">
            {view === 'kanban' ? (
              <KanbanBoard items={items} onUpdate={fetchItems} />
            ) : (
              <div className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-6">
                <TableView items={items} onUpdate={fetchItems} />
              </div>
            )}
          </div>
        )}
      </main>

      {showCreateForm && (
        <CreateItemForm 
          onClose={() => setShowCreateForm(false)} 
          onCreated={fetchItems}
        />
      )}
    </div>
  );
}

export default App;
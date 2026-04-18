import { RECIPES } from '../lib/recipes';
import { useStore, BlockType } from '../hooks/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Hammer } from 'lucide-react';

interface CraftingUIProps {
  isOpen: boolean;
  onClose: () => void;
  blocksConfig: Record<BlockType, { color: string; label: string }>;
}

export const CraftingUI = ({ isOpen, onClose, blocksConfig }: CraftingUIProps) => {
  const [inventory, craftItem] = useStore((state) => [state.inventory, state.craftItem]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-[200] p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center gap-3">
                <Hammer className="text-blue-400" size={24} />
                <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Crafting Table</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            {/* Recipes Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {RECIPES.map((recipe) => {
                const canCraft = Object.entries(recipe.ingredients).every(([ing, count]) => (inventory[ing as BlockType] || 0) >= (count || 0));

                return (
                  <div 
                    key={recipe.id}
                    className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded shadow-inner border border-white/10"
                          style={{ backgroundColor: blocksConfig[recipe.result].color }}
                        />
                        <div>
                          <h3 className="font-bold text-white text-lg leading-tight uppercase italic">{blocksConfig[recipe.result].label} x{recipe.resultCount}</h3>
                          <p className="text-xs text-slate-400">{recipe.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {Object.entries(recipe.ingredients).map(([ing, count]) => (
                          <div 
                            key={ing}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                              (inventory[ing as BlockType] || 0) >= (count || 0) 
                                ? 'bg-slate-700 text-white' 
                                : 'bg-red-900/30 text-red-400'
                            }`}
                          >
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: blocksConfig[ing as BlockType].color }} />
                            <span>{blocksConfig[ing as BlockType].label}: {(inventory[ing as BlockType] || 0)}/{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={!canCraft}
                      onClick={() => craftItem(recipe.id)}
                      className={`mt-4 w-full py-2 rounded-lg font-black uppercase text-sm transition-all shadow-lg ${
                        canCraft 
                          ? 'bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800' 
                          : 'bg-slate-700 text-slate-500 cursor-not-allowed border-b-4 border-slate-800 opacity-50'
                      }`}
                    >
                      Craft
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select ingredients to combine patterns</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

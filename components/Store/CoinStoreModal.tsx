
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Coins, Gift, Ticket } from 'lucide-react';

interface CoinStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
}

export const CoinStoreModal: React.FC<CoinStoreModalProps> = ({ isOpen, onClose, coins }) => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('modal-root'));
  }, []);

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-[80] pointer-events-auto"
          />
          <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="absolute inset-x-4 inset-y-8 md:inset-20 bg-white rounded-[40px] shadow-2xl z-[90] flex flex-col overflow-hidden pointer-events-auto"
          >
              {/* Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white shrink-0 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 shadow-lg shadow-yellow-400/20">
                          <ShoppingBag size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                          <h2 className="text-2xl font-black">积分商店</h2>
                          <div className="flex items-center gap-2 text-yellow-400 font-bold">
                              <Coins size={16} />
                              <span>余额: {coins}</span>
                          </div>
                      </div>
                  </div>
                  <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                      <X size={24} />
                  </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                  {/* Virtual Items */}
                  <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Gift size={20} className="text-brand" />
                          Lumi 装扮 & 道具
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <StoreItem icon="🎟️" name="补签卡" price={100} desc="恢复一天未打卡记录" />
                          <StoreItem icon="🃏" name="双倍经验卡" price={300} desc="未来 1 小时获取双倍 XP" />
                          <StoreItem icon="🧢" name="酷炫棒球帽" price={500} desc="给 Lumi 戴上" />
                          <StoreItem icon="🎨" name="霓虹皮肤" price={1000} desc="限定炫彩外观" locked />
                      </div>
                  </div>

                  {/* Physical Rewards */}
                  <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Ticket size={20} className="text-pink-500" />
                          班级许愿池
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <TicketItem icon="🛋️" name="C位体验卡" price={200} desc="任选班级座位一天" />
                          <TicketItem icon="🍩" name="零食大礼包" price={300} desc="课间小零食兑换券" />
                          <TicketItem icon="📚" name="课外图书" price={500} desc="兑换一本心仪的课外书" isRare />
                      </div>
                  </div>
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    portalTarget
  );
};

const StoreItem: React.FC<{ icon: string, name: string, price: number, desc: string, locked?: boolean }> = ({ icon, name, price, desc, locked }) => (
    <div className={`bg-white p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${locked ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-brand/50 hover:shadow-lg cursor-pointer'}`}>
        <div className="text-4xl mb-3">{icon}</div>
        <h4 className="font-bold text-gray-800 text-sm mb-1">{name}</h4>
        <p className="text-[10px] text-gray-400 mb-3 h-8 leading-tight line-clamp-2">{desc}</p>
        <button disabled={locked} className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${locked ? 'bg-gray-100 text-gray-400' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>
            {locked ? '解锁需 Lv.10' : <><Coins size={12} /> {price}</>}
        </button>
    </div>
);

const TicketItem: React.FC<{ icon: string, name: string, price: number, desc: string, isRare?: boolean }> = ({ icon, name, price, desc, isRare }) => (
    <button 
        onClick={() => alert("已兑换！请在卡包中查看，并向老师出示核销。")}
        className={`relative p-4 rounded-xl border-2 border-dashed flex items-center gap-4 transition-all group active:scale-95 text-left ${isRare ? 'bg-red-50 border-red-200 hover:border-red-300' : 'bg-white border-gray-200 hover:border-brand/50'}`}
    >
        {/* Ticket Cutouts */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full border-r border-gray-200"></div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full border-l border-gray-200"></div>

        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${isRare ? 'bg-red-100' : 'bg-gray-100'}`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-1">{desc}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-black text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-md">
                <Coins size={10} /> {price}
            </div>
        </div>
    </button>
);

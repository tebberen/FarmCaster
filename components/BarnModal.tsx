import React from 'react';
import { X } from 'lucide-react';
import { NETWORKS } from '../constants';

interface BarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNetworkId: string;
  userXP: number;
}

const BarnModal = ({ isOpen, onClose, currentNetworkId, userXP }: BarnModalProps) => {
  if (!isOpen) return null;

  const network = NETWORKS.find(n => n.id === currentNetworkId) || NETWORKS[0];
  const cropCount = Math.floor(userXP / 100);
  const cropName = network.cropName || 'Crop';
  const cropEmoji = network.cropEmoji || '🌱';

  const getPluralName = (name: string, count: number) => {
    if (count === 1) return name;
    if (name === 'Corn') return name; // Corn is typically uncountable
    if (name.endsWith('y')) return name.slice(0, -1) + 'ies'; // Blueberry -> Blueberries
    return name + 's';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm p-6 bg-[#1a1b1e] border border-gray-800 rounded-2xl shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white">Barn Inventory</h2>

          <div className="relative">
            <div className="text-8xl animate-bounce filter drop-shadow-lg select-none">
              {cropEmoji}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gray-800 text-white text-sm font-bold px-2 py-1 rounded-full border border-gray-700">
              x{cropCount}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-300 text-lg">
              You have collected <span className="text-green-400 font-bold">{cropCount} {getPluralName(cropName, cropCount)}</span> on <span className={network.text ? `font-bold ${network.text}` : "font-bold text-white"} style={network.text ? {} : { color: network.color.replace('bg-', '') }}>{network.name}</span>.
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-4">
              Keep farming to grow your stash!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarnModal;

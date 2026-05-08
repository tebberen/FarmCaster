import React from 'react';
import { X } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>👋</span> Welcome to FarmCaster
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/50 flex items-center justify-center text-2xl">
                            👛
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Connect Wallet</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Connect your wallet to start your farming journey. We support multiple networks like Base, Optimism, and more.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center text-2xl">
                            🌱
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Plant Seeds</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Choose a seed from the market or use <b>&apos;Water Farm&apos;</b> for free daily actions. Different seeds have different costs and rarity.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/50 flex items-center justify-center text-2xl">
                            🔥
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Build Streak</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Plant daily to build your streak and earn XP. Higher streaks and XP qualify you for future airdrops and rewards!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                    >
                        Let&apos;s Farm! 🚜
                    </button>
                </div>

            </div>
        </div>
    );
};

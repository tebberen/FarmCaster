import React from 'react';
import { Theme } from '../app/page';
import clsx from 'clsx';
import { X, Share2 } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme: Theme;
    emoji: string | null;
    networkName: string;
    xpEarned?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, theme, emoji, networkName, xpEarned }) => {
    if (!isOpen) return null;

    const handleShare = () => {
        // "Just planted [Emoji] on [Network]! #FarmCaster"
        const text = `Just planted ${emoji || '🌱'} on ${networkName}! #FarmCaster`;
        const encodedText = encodeURIComponent(text);
        const url = `https://warpcast.com/~/compose?text=${encodedText}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={clsx("relative w-full max-w-sm bg-white border rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-6", theme.border)}>

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                    <X size={20} />
                </button>

                <div className="text-center space-y-2 mt-4">
                    <div className="text-6xl animate-bounce filter drop-shadow-md">
                        {emoji || "🌱"}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Harvest Successful!</h2>
                    <p className="text-slate-500">Your crops are growing nicely.</p>
                </div>

                {xpEarned && (
                     <div className={clsx("px-4 py-2 rounded-lg bg-slate-50 border", theme.border)}>
                        <span className={clsx("font-bold text-lg", theme.text)}>+{xpEarned} XP</span>
                    </div>
                )}

                <button
                    onClick={handleShare}
                    className={clsx(
                        "w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-white",
                        "bg-[#472a91] hover:bg-[#5b37b7] shadow-lg shadow-purple-900/20" // Warpcast brand colorish
                    )}
                >
                    <Share2 size={18} />
                    <span>Share on Warpcast</span>
                </button>

            </div>
        </div>
    );
};

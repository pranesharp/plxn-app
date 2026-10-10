'use client';

import React, { useState } from 'react';
import { useProfile } from '@/plxn/context/ProfileContext';
import { X, Mail, User as UserIcon, ArrowRight, Check, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { profile, signIn, signOut } = useProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    signIn(name, email || undefined);
    setName('');
    setEmail('');
    onClose();
  };

  const handleGuest = () => {
    signIn('Guest');
    onClose();
  };

  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] rounded-none brut flex flex-col plxn-pop"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b-2 border-[#1A1814] dark:border-[#F2EEE2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 brut-xs bg-[#1A1814] dark:bg-[#F2EEE2] text-[#F4F0E6] dark:text-[#15140F] flex items-center justify-center">
              <span
                className="display inline-flex items-baseline select-none font-semibold leading-none"
                style={{ transform: 'rotate(-6deg)' }}
              >
                <span className="text-[13px] leading-none">P</span>
                <span className="text-[9px] lowercase leading-none -ml-0.5 relative top-0.5">x</span>
              </span>
            </div>
            <h2 className="display text-base font-semibold tracking-tight text-[#1A1814] dark:text-[#F2EEE2]">
              {profile ? 'Account' : 'Sign in to PLXN'}
            </h2>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="w-7 h-7 brut-xs bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* If Already Signed In (profile active) */}
        {profile ? (
          <div className="p-5 space-y-3.5 text-xs">
            <div className="bg-[#FBF8F1] dark:bg-[#1F1D17] brut-sm p-3.5 flex items-center gap-3">
              <div className="w-11 h-11 shrink-0 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] flex items-center justify-center">
                <span className="display text-lg font-semibold leading-none">
                  {profile.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="display font-semibold text-[13px] tracking-tight text-[#1A1814] dark:text-[#F2EEE2] truncate">
                  {profile.name}
                </p>
                <p className="text-[11px] text-[#6B6356] dark:text-[#A39B8B] font-mono truncate mt-0.5">
                  {profile.email || 'local profile'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#4A6A0E] dark:text-[var(--lime)] text-[11px] px-1">
              <span className="w-4 h-4 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              </span>
              <span className="font-mono uppercase tracking-wider text-[10px]">
                Local profile active — your plans stay in this browser
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#FBF8F1] dark:bg-[#1F1D17] text-[#1A1814] dark:text-[#F2EEE2] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm font-semibold tracking-tight hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          /* Sign-in Form (local profile by name + optional email) */
          <div className="p-5 space-y-4">
            <p className="text-xs text-[#6B6356] dark:text-[#A39B8B] leading-relaxed">
              Create a local profile to label your workspaces. Your plans are stored privately in this browser — no account, no cloud.
            </p>

            <form onSubmit={handleContinue} className="space-y-2.5">
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A907F] dark:text-[#6E6759]" strokeWidth={2.5} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] focus:outline-none focus:bg-[var(--lime)]/20 text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#9A907F] dark:placeholder:text-[#6E6759]"
                />
              </div>

              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A907F] dark:text-[#6E6759]" strokeWidth={2.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@work.com (optional)"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-[#FBF8F1] dark:bg-[#1F1D17] border-2 border-[#1A1814] dark:border-[#F2EEE2] focus:outline-none focus:bg-[var(--lime)]/20 text-[#1A1814] dark:text-[#F2EEE2] placeholder:text-[#9A907F] dark:placeholder:text-[#6E6759]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[var(--lime)] text-[#1A1814] border-2 border-[#1A1814] dark:border-[#F2EEE2] brut-sm font-semibold tracking-tight cursor-pointer flex items-center justify-center gap-1.5 hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[1.5px] active:translate-y-[1.5px] transition-transform"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[2px] bg-[#1A1814]/15 dark:bg-[#F2EEE2]/15" />
              <span className="text-[10px] text-[#6B6356] dark:text-[#A39B8B] font-mono uppercase tracking-wider">or</span>
              <div className="flex-1 h-[2px] bg-[#1A1814]/15 dark:bg-[#F2EEE2]/15" />
            </div>

            {/* Guest Mode */}
            <div className="pt-0 text-center">
              <button
                onClick={handleGuest}
                className="text-[11px] text-[#6B6356] dark:text-[#A39B8B] hover:text-[#4A6A0E] dark:hover:text-[var(--lime)] underline underline-offset-4 decoration-1 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

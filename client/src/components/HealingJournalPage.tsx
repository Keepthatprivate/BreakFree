import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Feather, Calendar, BarChart3, Shield, FileText, Download, Sparkles, Check } from 'lucide-react';

interface HealingJournalPageProps {
  onAccept: () => void;
  onSkip: () => void;
}

export default function HealingJournalPage({ onAccept, onSkip }: HealingJournalPageProps) {
  const journalContents = [
    { icon: Feather, text: '30 Guided Prompts', color: 'from-rose-500 to-pink-600' },
    { icon: Heart, text: 'Grounding Pages', color: 'from-violet-500 to-purple-600' },
    { icon: FileText, text: 'Letter to Younger Self', color: 'from-blue-500 to-indigo-600' },
    { icon: Calendar, text: 'Weekly Check-ins', color: 'from-amber-500 to-orange-600' },
    { icon: BarChart3, text: 'Emotional Tracking', color: 'from-emerald-500 to-teal-600' },
    { icon: Shield, text: 'Boundary Templates', color: 'from-cyan-500 to-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      <div className="relative max-w-lg mx-auto px-5 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 fill-amber-400 text-amber-400" />
            Wait — Before You Go
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
            Start Healing With
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              One Simple Step
            </span>
          </h1>
          
          <p className="text-purple-200/80 text-sm sm:text-base max-w-sm mx-auto">
            A gentle, guided journal to reconnect with yourself
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden mb-6"
        >
          <div className="h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">Inner Child Journal</h2>
                <p className="text-purple-300/70 text-sm">Printable PDF • Use Forever</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {journalContents.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-xs sm:text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-2.5 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <span className="text-amber-200 text-sm font-medium flex-1">Instant Download</span>
              <Check className="w-5 h-5 text-emerald-400" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10"
        >
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-400" />
            Why Journaling Heals
          </h3>
          <div className="space-y-2">
            {[
              "Unlocks emotions that stay hidden",
              "Removes the overwhelm of 'where to start'",
              "10 minutes a day creates lasting change"
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-1.5 flex-shrink-0" />
                <p className="text-purple-200/80 text-sm">{reason}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="relative bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-rose-600/30 rounded-2xl p-5 mb-6 border border-purple-400/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-2xl" />
          
          <div className="relative text-center">
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
              $14.99
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="space-y-3"
        >
          <Button
            onClick={onAccept}
            size="lg"
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 border-0 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 rounded-xl"
            data-testid="button-accept-journal"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Get the Journal — $14.99
          </Button>
          
          <button
            onClick={onSkip}
            className="w-full text-center text-purple-300/60 hover:text-purple-200 transition-colors py-2 text-sm"
            data-testid="button-skip-journal"
          >
            Skip this offer
          </button>
        </motion.div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Feather, Calendar, BarChart3, Shield, FileText, Download, Sparkles } from 'lucide-react';

interface HealingJournalPageProps {
  onAccept: () => void;
  onSkip: () => void;
}

export default function HealingJournalPage({ onAccept, onSkip }: HealingJournalPageProps) {
  const journalContents = [
    { icon: Feather, text: '30 Guided Prompts' },
    { icon: Heart, text: 'Grounding Pages' },
    { icon: FileText, text: 'Letter to Younger Self' },
    { icon: Calendar, text: 'Weekly Check-ins' },
    { icon: BarChart3, text: 'Emotional Tracking' },
    { icon: Shield, text: 'Boundary Templates' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/30 to-orange-50/50 dark:from-stone-950 dark:via-amber-950/20 dark:to-stone-950">
      <div className="max-w-lg mx-auto px-5 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Wait — Before You Go
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-3 leading-tight">
            Start Healing With
            <span className="block text-amber-600 dark:text-amber-400">One Simple Step</span>
          </h1>
          
          <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base">
            A gentle, guided journal to help you reconnect with yourself
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden mb-6"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
          
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-stone-800 dark:text-stone-100 text-lg">Inner Child Journal</h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm">Printable PDF • Use Forever</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {journalContents.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-2 p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-lg"
                >
                  <item.icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50"
            >
              <Download className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">Instant Download</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-gradient-to-r from-stone-100 to-amber-50 dark:from-stone-800 dark:to-stone-800/50 rounded-xl p-4 mb-6 border border-stone-200 dark:border-stone-700"
        >
          <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            Why Journaling Heals
          </h3>
          <div className="space-y-2">
            {[
              "Unlocks emotions that stay hidden",
              "Removes the overwhelm of 'where to start'",
              "10 minutes a day creates lasting change"
            ].map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <p className="text-stone-600 dark:text-stone-400 text-sm">{reason}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="text-center mb-6"
        >
          <span className="text-4xl sm:text-5xl font-black text-stone-800 dark:text-stone-100">
            $14<span className="text-2xl sm:text-3xl">.99</span>
          </span>
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
            className="w-full py-6 text-base font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 border-0 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 rounded-xl text-white"
            data-testid="button-accept-journal"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Get the Journal — $14.99
          </Button>
          
          <button
            onClick={onSkip}
            className="w-full text-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors py-2 text-sm"
            data-testid="button-skip-journal"
          >
            Skip this offer
          </button>
        </motion.div>
      </div>
    </div>
  );
}

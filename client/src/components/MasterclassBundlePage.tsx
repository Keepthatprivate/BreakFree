import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Shield, Sparkles, Heart, Brain, Users, BookOpen, Star } from 'lucide-react';

interface MasterclassBundlePageProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function MasterclassBundlePage({ onAccept, onDecline }: MasterclassBundlePageProps) {
  const masterclasses = [
    { icon: Heart, title: 'Inner Child Healing', color: 'from-rose-500 to-pink-600' },
    { icon: Users, title: 'Attachment Style Deep-Dive', color: 'from-violet-500 to-purple-600' },
    { icon: Brain, title: 'Emotional Regulation', color: 'from-blue-500 to-indigo-600' },
    { icon: Sparkles, title: 'Self-Worth Rebuilding', color: 'from-amber-500 to-orange-600' },
    { icon: Shield, title: 'Boundaries & Communication', color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      <div className="relative max-w-2xl mx-auto px-5 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            One-Time Exclusive Offer
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight tracking-tight">
            Break Free From
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              What's Holding You Back
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-purple-200/80 max-w-md mx-auto">
            Transform pain into power with our complete masterclass bundle
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/10"
        >
          <p className="text-purple-100/90 text-sm sm:text-base text-center italic leading-relaxed">
            "The patterns keeping you stuck were learned for survival. 
            Now it's time to unlearn them and <span className="text-pink-300 font-semibold">reclaim your life</span>."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 text-center flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            5 Transformative Masterclasses
          </h2>
          
          <div className="grid gap-2.5">
            {masterclasses.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white text-sm sm:text-base">{item.title}</span>
                <Check className="w-5 h-5 text-emerald-400 ml-auto" />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="flex items-center gap-3 p-3 mt-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-amber-200 text-sm sm:text-base">BONUS: Printable Workbook</span>
            </div>
            <span className="text-xs font-bold bg-amber-500 text-slate-900 px-2 py-1 rounded-full">FREE</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="relative bg-gradient-to-br from-purple-600/30 via-pink-600/20 to-rose-600/30 rounded-2xl p-6 mb-6 border border-purple-400/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-2xl" />
          
          <div className="relative text-center">
            <p className="text-purple-300 text-sm mb-1">
              <span className="line-through opacity-70">Total Value: $199+</span>
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-white/60 text-xl">Today:</span>
              <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                $69
              </span>
            </div>
            <p className="text-purple-200/70 text-sm">One-time payment • Lifetime access</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="flex items-center justify-center gap-2 mb-5 text-sm"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 font-medium">30-Day Money-Back Guarantee</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="space-y-3"
        >
          <Button
            onClick={onAccept}
            size="lg"
            className="w-full py-7 text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:via-pink-500 hover:to-rose-500 border-0 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 rounded-xl"
            data-testid="button-accept-masterclass"
          >
            <Check className="w-5 h-5 mr-2" />
            YES — I Want the Bundle
          </Button>
          
          <button
            onClick={onDecline}
            className="w-full text-center text-purple-300/60 hover:text-purple-200 transition-colors py-2 text-sm"
            data-testid="button-decline-masterclass"
          >
            No thanks, I'll pass
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-xs text-purple-300/40 text-center mt-6"
        >
          Educational content only. Not a replacement for therapy.
        </motion.p>
      </div>
    </div>
  );
}

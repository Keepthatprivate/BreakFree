import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, Feather, Calendar, BarChart3, Shield, FileText, Download } from 'lucide-react';

interface HealingJournalPageProps {
  onAccept: () => void;
  onSkip: () => void;
}

export default function HealingJournalPage({ onAccept, onSkip }: HealingJournalPageProps) {
  const journalContents = [
    { icon: Feather, text: '30 guided journaling prompts for deep self-reflection' },
    { icon: Heart, text: 'Reflection & grounding pages for emotional processing' },
    { icon: FileText, text: '"Letter to Your Younger Self" template' },
    { icon: Calendar, text: 'Weekly check-in pages to track your progress' },
    { icon: BarChart3, text: 'Emotional tracking sheets to understand patterns' },
    { icon: Shield, text: 'Boundary & forgiveness templates' },
    { icon: Download, text: 'Instant PDF download — print as many times as you need' },
  ];

  const whyItHelps = [
    'Writing unlocks emotions that stay hidden when we only think about them',
    'A guided structure removes the overwhelm of "where do I even start?"',
    'Daily practice creates lasting change — even just 10 minutes a day',
    'You deserve a safe space to process your journey at your own pace',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            A Gentle Alternative
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Start Your Healing Journey With a Simple First Step
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            The Inner Child Healing Journal is a gentle, guided tool to help you 
            process emotions, reconnect with yourself, and begin healing — one page at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card rounded-xl p-6 mb-8 border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Inner Child Healing Journal</h2>
              <p className="text-sm text-muted-foreground">Printable PDF • Use forever</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {journalContents.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-primary/70" />
                </div>
                <span className="text-foreground/90 text-sm">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
            Why Journaling Heals:
          </h3>
          
          <div className="space-y-3">
            {whyItHelps.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-card/50 rounded-lg"
              >
                <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-foreground/80 text-sm leading-relaxed">{reason}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 rounded-xl p-6 mb-8 text-center"
        >
          <p className="text-3xl font-bold text-foreground mb-2">
            $14.99
          </p>
          <p className="text-sm text-muted-foreground">Instant download • Print unlimited copies</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="space-y-4"
        >
          <Button
            onClick={onAccept}
            size="lg"
            className="w-full py-6 text-lg font-semibold"
            data-testid="button-accept-journal"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Get the Healing Journal — $14.99
          </Button>
          
          <button
            onClick={onSkip}
            className="w-full text-center text-muted-foreground hover:text-foreground transition-colors py-2 text-sm"
            data-testid="button-skip-journal"
          >
            Skip this offer
          </button>
        </motion.div>
      </div>
    </div>
  );
}

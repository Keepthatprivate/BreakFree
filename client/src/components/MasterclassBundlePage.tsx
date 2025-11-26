import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Shield, Sparkles, Heart, Brain, Users, BookOpen } from 'lucide-react';

interface MasterclassBundlePageProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function MasterclassBundlePage({ onAccept, onDecline }: MasterclassBundlePageProps) {
  const masterclasses = [
    { icon: Heart, title: 'Inner Child Healing Masterclass', description: 'Reconnect with and heal your younger self' },
    { icon: Users, title: 'Attachment Style Deep-Dive', description: 'Understand your relationship patterns' },
    { icon: Brain, title: 'Emotional Regulation Masterclass', description: 'Master your emotional responses' },
    { icon: Sparkles, title: 'Self-Worth Rebuilding Workshop', description: 'Reclaim your inherent value' },
    { icon: Shield, title: 'Boundaries & Communication Masterclass', description: 'Protect your peace and speak your truth' },
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Special One-Time Offer
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Finally Break Free From the Patterns That Keep You Stuck
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Deepen your healing journey with our complete Trauma Healing Masterclass Bundle — 
            expert-guided sessions designed to transform pain into peace.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-card rounded-xl p-6 mb-8 border border-border/50"
        >
          <p className="text-foreground/90 leading-relaxed text-center italic">
            "The patterns you developed to survive are now keeping you from thriving. 
            These masterclasses give you the roadmap to finally release what no longer serves you — 
            to understand your inner child, regulate your emotions, and rebuild the self-worth 
            that was taken from you. This is where real transformation begins."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            What's Included in Your Bundle:
          </h2>
          
          <div className="space-y-4">
            {masterclasses.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/30"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">BONUS: Printable Workbook</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">FREE</span>
                </div>
                <p className="text-sm text-muted-foreground">Integration exercises to deepen your practice</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-6 mb-8 text-center"
        >
          <p className="text-muted-foreground mb-2">
            <span className="line-through">Total Value: $199+</span>
          </p>
          <p className="text-3xl font-bold text-foreground mb-2">
            Today Only: <span className="text-primary">$69</span>
          </p>
          <p className="text-sm text-muted-foreground">One-time payment • Lifetime access</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground"
        >
          <Shield className="w-4 h-4 text-green-500" />
          <span>30-day satisfaction guarantee — No questions asked</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="space-y-4"
        >
          <Button
            onClick={onAccept}
            size="lg"
            className="w-full py-6 text-lg font-semibold"
            data-testid="button-accept-masterclass"
          >
            <Check className="w-5 h-5 mr-2" />
            YES — I Want the Masterclass Bundle
          </Button>
          
          <button
            onClick={onDecline}
            className="w-full text-center text-muted-foreground hover:text-foreground transition-colors py-2 text-sm"
            data-testid="button-decline-masterclass"
          >
            No thanks, I'll pass on this offer
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-xs text-muted-foreground/70 text-center mt-8"
        >
          This program is for educational purposes and is not a replacement for professional therapy or medical advice.
        </motion.p>
      </div>
    </div>
  );
}

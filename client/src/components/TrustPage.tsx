import { Star, Users, Heart, Smartphone, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { trackViewContent } from '@/lib/facebook-tracking';
import { motion, AnimatePresence } from 'framer-motion';

import marieImage from '@assets/stock_images/young_woman_casual_s_b2572404.jpg';

interface TrustPageProps {
  onContinue: () => void;
}

const dynamicNotifications = [
  { name: 'Léa', action: 'just finished day 12' },
  { name: 'Thomas', action: 'started their healing journey' },
  { name: 'Sophie', action: 'completed the morning reflection' },
  { name: 'Marc', action: 'unlocked a new insight' },
  { name: 'Julie', action: 'just finished day 7' },
  { name: 'Antoine', action: 'started the evening exercise' },
];

export default function TrustPage({ onContinue }: TrustPageProps) {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    trackViewContent({ contentName: 'Funnel Step 10 - Trust & Stats' });
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowNotification(true);
    }, 2000);

    const rotateTimer = setInterval(() => {
      setShowNotification(false);
      setTimeout(() => {
        setCurrentNotification((prev) => (prev + 1) % dynamicNotifications.length);
        setShowNotification(true);
      }, 500);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, []);

  const trustStats = [
    {
      icon: Users,
      number: '48,291',
      label: 'Active users in December 2024',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400'
    },
    {
      icon: Star,
      number: '4.72/5',
      label: 'Average rating',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400'
    },
    {
      icon: Heart,
      number: '93.7%',
      label: 'Feel better in 7 days',
      iconBg: 'bg-rose-500/15',
      iconColor: 'text-rose-400'
    },
    {
      icon: Smartphone,
      number: 'Local',
      label: 'Your data stays on your phone',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400'
    },
  ];

  const notification = dynamicNotifications[currentNotification];

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 relative">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-4 left-1/2 z-50 bg-card/95 backdrop-blur-sm border border-card-border/50 rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
            data-testid="dynamic-notification"
          >
            <Bell className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-foreground">
              <span className="font-semibold">{notification.name}</span>{' '}
              <span className="text-muted-foreground">{notification.action}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-5 sm:px-6 w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-2">
            Trusted by thousands
          </h1>
          <p className="text-muted-foreground text-base">
            Join others on their healing journey
          </p>
        </div>
          
        <div className="grid grid-cols-2 gap-3 mb-6">
          {trustStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-5 border border-card-border/30 text-center animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
                data-testid={`trust-stat-${index}`}
              >
                <div className={`${stat.iconBg} rounded-xl p-3 inline-flex mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-sm">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-2xl p-5 border border-card-border/30 mb-8">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12 shrink-0 border-2 border-primary/20">
              <AvatarImage src={marieImage} alt="Marie" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-foreground text-sm leading-relaxed italic mb-2">
                "After my separation, I found sleep again in 2 weeks. Finding out why I kept on repeating the same patterns was the key."
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                — Marie, 34
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-foreground font-medium text-lg" data-testid="micro-engagement-question">
            Ready to start?
          </p>
          <button
            onClick={onContinue}
            className="w-full sm:w-auto min-w-[280px] bg-primary hover-elevate active-elevate-2 text-background font-bold text-lg px-10 py-4 rounded-full shadow-xl shadow-primary/30 transition-all duration-200"
            data-testid="button-continue-trust"
          >
            Yes, I'm ready
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({ name: name.trim(), email: email.trim() });
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-8">
      <div
        className="bg-card/60 backdrop-blur-sm border border-card-border rounded-2xl p-6 sm:p-8"
        data-testid="contact-form"
      >
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Almost there
          </h2>
          <p className="text-base text-muted-foreground">
            Share your details to see your personalized results
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium mb-2 block">
              Your name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              placeholder="Enter your first name"
              className={`h-12 ${errors.name ? 'border-destructive' : ''}`}
              data-testid="input-name"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium mb-2 block">
              Your email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="your@email.com"
              className={`h-12 ${errors.email ? 'border-destructive' : ''}`}
              data-testid="input-email"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 text-base" data-testid="button-submit-contact">
            See my results
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            We respect your privacy. Your information is safe with us.
          </p>
        </form>
      </div>
    </div>
  );
}

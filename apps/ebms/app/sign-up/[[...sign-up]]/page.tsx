import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <SignUp
      appearance={{
        elements: {
          card: 'bg-[#0b1730]/90 shadow-2xl border border-white/10',
          headerTitle: 'text-white',
          headerSubtitle: 'text-[#cfd8eb]',
          socialButtonsBlockButton:
            'bg-white/5 border border-white/10 text-white hover:bg-white/10',
          formButtonPrimary: 'bg-[#2870f0] hover:bg-[#1d5fd1] text-white',
          formFieldInput: 'bg-white/5 border border-white/10 text-white',
          footerActionText: 'text-[#cfd8eb]',
          footerActionLink: 'text-[#7fb2ff] hover:text-white',
        },
      }}
    />
  );
}

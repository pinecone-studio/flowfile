import { Tone } from '../showcase.data';

const toneClasses: Record<Tone, string> = {
  promotion: 'bg-[#17351f] text-[#24b246]',
  onboarding: 'bg-[#152f5e] text-[#2e8cff]',
  'role-change': 'bg-[#4d4818] text-[#2a9b42]',
  terminate: 'bg-[#4b1718] text-[#cf3035]',
  active: 'bg-[#17351f] text-[#1cce39]',
  inactive: 'bg-[#23252b] text-[#7e818a]',
  neutral: 'bg-[#1c325e] text-[#d7e1f4]',
  success: 'bg-transparent text-[#23cd35]',
  warning: 'bg-transparent text-[#d7dce9]',
};

export function TonePill({
  label,
  tone,
  className = '',
  compact = false,
}: {
  label: string;
  tone: Tone;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-[14px] px-4 text-[15px] font-semibold ${
        compact ? 'h-[32px]' : 'h-[40px]'
      } ${toneClasses[tone]} ${className}`}
    >
      {label}
    </span>
  );
}

export function AvatarStack({ avatars }: { avatars: string[] }) {
  return (
    <div className="flex items-center">
      {avatars.map((avatar, index) => (
        <img
          key={`${avatar}-${index}`}
          src={avatar}
          alt=""
          className={`h-10 w-10 rounded-full border-2 border-[#11264f] object-cover ${
            index === 0 ? '' : '-ml-2.5'
          }`}
        />
      ))}
    </div>
  );
}

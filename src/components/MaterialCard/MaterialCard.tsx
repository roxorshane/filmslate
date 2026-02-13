import { cn } from "@/helpers";

interface MaterialCardProps {
  thumbnail: string;
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  horizontal?: boolean;
  outline?: boolean;
  className?: string;
  key?: React.Key;
}

const MaterialCard = ({ thumbnail, title, subtitle, description, actions, horizontal, outline }: MaterialCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-lg overflow-hidden",
      horizontal ? "max-h-[80px] w-full" : "max-w-[360px] h-full",
      outline ? "border" : "shadow-md"
    )}>
      <div className={cn(
        "flex h-full",
        horizontal ? "flex-row" : "flex-col"
      )}>
        <div className={cn(
          "shrink-0",
          horizontal ? "w-[80px] h-[80px]" : "w-[360px] h-[188px]"
        )}>
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="grow flex flex-col p-4 text-left">
          <div className="font-semibold">{title}</div>
          {subtitle && <div>{subtitle}</div>}
          {description && !horizontal && <div className="grow mt-2">{description}</div>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
    </div>
  );
};

export { MaterialCard };
export default MaterialCard;

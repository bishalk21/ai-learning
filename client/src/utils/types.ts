export interface LucideProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
  //   [key: string]: any; // Allow additional props
}

export type IconComponent = React.FC<LucideProps>;

export type NavLink = {
  name: string;
  href: string;
  ariaLabel: string;
};

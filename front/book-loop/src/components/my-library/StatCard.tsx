import type { ReactNode, FunctionComponent } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

interface StatCardProps extends HTMLMotionProps<"div"> {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  sub?: string;
  className?: string;        
  iconClassName?: string; 
}

const StatCard: FunctionComponent<StatCardProps> = ({
  icon,
  value,
  label,
  sub,
  className,
  iconClassName,
  ...motionProps
}) => {
  return (
    <motion.div className={`stat-card ${className ?? ""}`} {...motionProps}>
      <div className={`stat-icon ${iconClassName ?? ""}`}>{icon}</div>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </motion.div>
  );
};

export default StatCard;

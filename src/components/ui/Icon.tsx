import {
  Boxes,
  Database,
  Globe,
  Layers,
  Network,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  Workflow,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import type { IconName } from "@/types";

const iconMap: Record<IconName, LucideIcon> = {
  boxes: Boxes,
  database: Database,
  globe: Globe,
  layers: Layers,
  network: Network,
  refreshCw: RefreshCw,
  server: Server,
  shield: Shield,
  sparkles: Sparkles,
  workflow: Workflow,
};

/** Resolves a content icon name without allowing presentation code to invent icons. */
export function resolveIcon(name: IconName | string, fallback: IconName = "sparkles"): LucideIcon {
  return iconMap[name as IconName] ?? iconMap[fallback];
}

export interface IconProps extends Omit<LucideProps, "aria-label"> {
  readonly name: IconName | string;
  readonly label?: string;
}

/** Renders a mapped icon as decorative by default, or as a labeled image when requested. */
export function Icon({ name, label, ...props }: IconProps) {
  const ResolvedIcon = resolveIcon(name);

  return (
    <ResolvedIcon
      {...props}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
    />
  );
}

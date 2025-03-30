import * as React from "react";
import * as RechartsPrimitive from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex aspect-video", className)} {...props}>
      <RechartsPrimitive.ResponsiveContainer>
        {children}
      </RechartsPrimitive.ResponsiveContainer>
    </div>
  );
});
ChartContainer.displayName = "Chart";

export { RechartsPrimitive as Recharts };

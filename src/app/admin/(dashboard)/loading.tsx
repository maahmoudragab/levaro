import { UnifiedLoading } from "@/components/shared/UnifiedLoading";

/**
 * Unified Dashboard Loading Component.
 * Displayed next to the sidebar during page navigation and server rendering across all dashboard routes.
 */
export default function DashboardLoading() {
  return <UnifiedLoading message="Loading..." />;
}

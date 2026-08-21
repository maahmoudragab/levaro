import { getOverviewStats } from "@/app/services/admin/overview";
import Overview from "@/components/dashboard/Overview";

export default async function AdminPage() {
  const overviewStats = await getOverviewStats();


  return <Overview overviewStats={overviewStats} />;
}

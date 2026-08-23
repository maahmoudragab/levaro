import TopHeader from "@/components/dashboard/TopHeader";

export default async function Admin() {
  return (
    <div className="p-4 flex flex-col gap-2 pb-50">
      <TopHeader
        title="Dashboard"
        description="Welcome back, here's what's happening today."
        buttonName="Notifications"
      />
    </div>
  );
}

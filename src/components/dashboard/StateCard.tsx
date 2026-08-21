export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    
    <div className="bg-[#f7f8f9] p-3 rounded-2xl ">
      <span className="text-[10px] uppercase font-bold  text-[#6b7280]   block">
        {label}
      </span>

      <span className="text-lg sm:text-xl font-bold text-[#1f2937]">
        {value}
      </span>
    </div>
  );
}

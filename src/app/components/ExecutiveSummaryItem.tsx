// src/app/components/ExecutiveSummaryItem.tsx
interface ExecutiveSummaryProps {
  title: string;
  content: string;
}

export default function ExecutiveSummaryItem({ title, content }: ExecutiveSummaryProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-gray-100 mt-4">
      <h3 className="text-violet-300 font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-200">{content}</p>
    </div>
  );
}

// src/app/components/ChecklistItem.tsx
interface ChecklistProps {
  title: string;
  content: string;
}

export function ChecklistItem({ title, content }: ChecklistProps) {
  return (
    <div className="bg-slate-700 p-4 rounded-md shadow-md text-white mb-4">
      <h3 className="font-semibold text-md text-purple-200 mb-1">{title}</h3>
      <p className="text-sm opacity-90">{content}</p>
    </div>
  );
}
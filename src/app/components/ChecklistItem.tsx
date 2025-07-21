// src/app/components/ChecklistItem.tsx
interface ChecklistProps {
  title: string;
  content: string;
}

export function ChecklistItem({ title, content }: ChecklistProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-white mb-4">
      <h3 className="font-semibold text-md mb-1 text-violet-200">{title}</h3>
      <p className="text-sm text-gray-200">{content}</p>
    </div>
  );
}

// src/app/components/RecommendationCard.tsx
interface RecommendationProps {
  title: string;
  content: string;
}

export function RecommendationCard({ title, content }: RecommendationProps) {
  return (
    <div className="bg-gradient-to-br from-purple-700 to-indigo-900 p-4 rounded-md shadow text-white mb-4">
      <h3 className="font-semibold text-md text-cyan-200 mb-1">{title}</h3>
      <p className="text-sm opacity-90">{content}</p>
    </div>
  );
}
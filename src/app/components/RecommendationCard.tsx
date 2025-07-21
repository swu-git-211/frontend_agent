// src/app/components/RecommendationCard.tsx
interface RecommendationProps {
  title: string;
  content: string;
}

export function RecommendationCard({ title, content }: RecommendationProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-white mb-4">
      <h3 className="font-semibold text-md mb-1 text-cyan-200">{title}</h3>
      <p className="text-sm text-gray-200">{content}</p>
    </div>
  );
}

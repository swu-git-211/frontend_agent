// src/app/components/AttackTypeCard.tsx
export default function AttackTypeCard() {
  return (
    <div className="bg-slate-800 border-l-4 border-orange-400 p-4 rounded-lg text-white mb-6">
      <h2 className="text-sm font-semibold text-orange-300">Attack Type</h2>
      <p className="mt-1 text-sm">TA0006 - Credential Access</p>
      <p className="text-sm">Confident Score: <span className="text-yellow-400 font-semibold">0.345</span></p>
    </div>
  );
}
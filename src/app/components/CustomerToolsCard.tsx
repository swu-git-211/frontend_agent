// src/app/components/CustomerToolsCard.tsx
export default function CustomerToolsCard() {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-md shadow-md text-white mt-4">
      <h3 className="font-semibold text-md text-lime-300 mb-2">Customer Tools</h3>
      <ul className="text-sm list-none">
        <li><strong>EDR</strong>: missing</li>
        <li><strong>Antivirus</strong>: active</li>
        <li><strong>Firewall</strong>: inactive</li>
        <li><strong>MFA</strong>: enabled</li>
      </ul>
    </div>
  );
}

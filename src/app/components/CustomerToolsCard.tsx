// src/app/components/CustomerToolsCard.tsx
export default function CustomerToolsCard() {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow text-white mt-4">
      <h3 className="font-semibold text-md text-lime-300 mb-2">Customer Tools</h3>
      <ul className="text-sm list-none text-gray-200">
        <li><strong className="text-gray-100">EDR</strong>: missing</li>
        <li><strong className="text-gray-100">Antivirus</strong>: active</li>
        <li><strong className="text-gray-100">Firewall</strong>: inactive</li>
        <li><strong className="text-gray-100">MFA</strong>: enabled</li>
      </ul>
    </div>
  );
}

import Link from "next/link";

interface FooterProps {
  role: "soc-dev" | "customer" | "customer-success";
}

export default function Footer({ role }: FooterProps) {
  return (
    <footer className="w-full mt-12 px-6 py-3 bg-white/5 backdrop-blur-md border-t border-white/10 rounded-t-xl flex justify-between items-center text-sm text-gray-200">
      <div className="flex items-center gap-2">
        <span className="opacity-70">Investigator</span>
        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Cynclair Soc
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/dev-soc">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              role === "soc-dev"
                ? "bg-purple-600 text-white"
                : "bg-black/30 text-gray-400"
            }`}
          >
            SOC & DEV
          </button>
        </Link>
        <Link href="/customer">
          <button
            className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
              role === "customer"
                ? "bg-purple-600 text-white"
                : "bg-black/30 text-gray-400"
            }`}
          >
            CUSTOMER
          </button>
        </Link>
      </div>
    </footer>
  );
}

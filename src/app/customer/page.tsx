import OverviewCard from "../components/OverviewCard";
import AttackTypeCard from "../components/AttackTypeCard";
import { RecommendationCard } from "../components/RecommendationCard";
import { ChecklistItem } from "../components/ChecklistItem";
import CustomerToolsCard from "../components/CustomerToolsCard";
import ExecutiveSummaryItem from "../components/ExecutiveSummaryItem";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
    <main className="grid grid-cols-2 gap-6 p-6">
      <div>
        <OverviewCard />
        <RecommendationCard title="Reset password immediately" content="..." />
        <RecommendationCard
          title="Enable Endpoint Detection & Response (EDR)"
          content="..."
        />
        <CustomerToolsCard />
      </div>
      <div>
        <AttackTypeCard />
        <ExecutiveSummaryItem
          title="What happened"
          content="มีการเข้าถึงบัญชีผิดปกติในช่วงนอกเวลางาน..."
        />
        <ExecutiveSummaryItem
          title="why it matter"
          content="มีการเข้าถึงบัญชีผิดปกติในช่วงนอกเวลางาน..."
        />
        <ExecutiveSummaryItem
          title="What we found"
          content="มีการเข้าถึงบัญชีผิดปกติในช่วงนอกเวลางาน..."
        />
      </div>
    </main>
    <Footer role="customer" />
    </>
  );
}

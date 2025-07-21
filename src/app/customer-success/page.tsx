import OverviewCard from '../components/OverviewCard'
import AttackTypeCard from '../components/AttackTypeCard'
import { RecommendationCard } from '../components/RecommendationCard'
import { ChecklistItem } from '../components/ChecklistItem'
import CustomerToolsCard from '../components/CustomerToolsCard'

export default function Page() {
  return (
    <main className="grid grid-cols-2 gap-6 p-6">
      <div>
        <OverviewCard />
        <RecommendationCard title="Reset password immediately" content="..." />
        <RecommendationCard title="Enable Endpoint Detection & Response (EDR)" content="..." />
        <CustomerToolsCard />
      </div>
      <div>
        <AttackTypeCard />
        <ChecklistItem title="Check login time vs work hours" content="..." />
        <ChecklistItem title="Review MFA logs" content="..." />
        <ChecklistItem title="Correlate with phishing alerts" content="..." />
      </div>
    </main>
  )
}

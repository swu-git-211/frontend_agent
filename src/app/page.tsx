'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  useWebSocket,
  AttackTypeCard,
  ChecklistItem,
  CustomerToolsCard,
  ExecutiveSummaryItem,
  Footer,
  OverviewCard,
  RecommendationCard,
} from './AgentSummary/componentsAgent';
import type { ToolStatus } from './AgentSummary/componentsAgent';
import { layout, textStyles } from './AgentSummary/styles_AgentSummary';
import { Paper, Typography, Box } from '@mui/material';
// -------------------- Interfaces --------------------

interface Recommendation {
  title: string
  content: string | React.ReactNode
}

interface ChecklistItemData {
  title: string
  content: string | React.ReactNode
}

interface AttackType {
  tacticId: string
  tacticName: string
  confidence: number
}

interface OverviewData {
  description: string
}

interface TimelineData {
  stage: string
  progress?: number
}

interface PageProps {
  role: 'soc-dev' | 'customer' | 'customer-success'
  setRole: React.Dispatch<React.SetStateAction<PageProps['role']>>
}

// -------------------- Mock Data --------------------

const timelineStages = [
  'Received Alert',
  'TypeAgent',
  'Specified Type',
  'Threat Analysis',
  'Analyze Context',
  'Summary',
  'Recommendation',
];


const timelineMockData: TimelineData[] = [
  { stage: 'Received Alert', progress: 1 },
  { stage: 'TypeAgent', progress: 0.3 },
  // ...ถ้าต้องการ mock หลายสถานะพร้อมกัน กรณีนี้แค่ตัวอย่าง 2 ข้อมูลพอ
]

const overviewMock: OverviewData = {
  description:
    'After analyzing recent incidents, the system detected sophisticated attack patterns that successfully evade traditional detection methods. Several security tools remain uninstalled or outdated. The SOC team should follow the prescribed checklist to enhance the overall organizational security posture.',
}

const toolsMock: ToolStatus[] = [
  { name: 'EDR', status: 'missing' },
  { name: 'Antivirus', status: 'active' },
  { name: 'Firewall', status: 'inactive' },
  { name: 'MFA', status: 'enabled' },
]

const recommendationsMock: Recommendation[] = [
  {
    title: 'Reset password immediately',
    content: 'Please reset your password within 24 hours to ensure account safety.',
  },
  {
    title: 'Enable Endpoint Detection & Response (EDR)',
    content: 'Activate EDR solutions to monitor and respond to threats in real-time.',
  },
]

const checklistMock: ChecklistItemData[] = [
  {
    title: 'Check login time vs work hours',
    content: 'Review logs to confirm all access was during expected hours.',
  },
  {
    title: 'Review MFA logs',
    content: 'Verify multi-factor authentication attempts and failures.',
  },
  {
    title: 'Correlate with phishing alerts',
    content: 'Check if recent phishing campaigns align with suspicious activities.',
  },
]

const attackTypeMock: AttackType = {
  tacticId: 'TA0006',
  tacticName: 'Credential Access',
  confidence: 0.345,
}

// -------------------- Utility Components --------------------

/**
 * 🔍 Highlight keywords ในข้อความ
 */
function highlightKeyword(
  text: string,
  keywords: string[] = ['attack', 'tools', 'checklist']
): React.ReactNode[] {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    lowerKeywords.includes(part.toLowerCase()) ? (
      <mark key={i} style={{ backgroundColor: '#fde68a', fontWeight: 600 }}>{part}</mark>
    ) : (
      part
    )
  );
}

/**
 * 📦 SectionWrapper: ใช้ครอบ Section ต่าง ๆ
 */
const SectionWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Paper sx={{ ...layout.sectionPaper, mb: 3 }}>
    <Typography sx={textStyles.sectionTitle}>{title}</Typography>
    {children}
  </Paper>
);

/**
 * 🧱 SectionCardList: สำหรับแสดง list ของ card ที่ต้องใช้ loop
 */
const SectionCardList = <T,>({
  items,
  renderItem,
}: {
  items: T[]
  renderItem: (item: T, idx: number) => React.ReactNode
}) => <div className="space-y-4">{items.map(renderItem)}</div>

// -------------------- Local Components for Static Data --------------------

/**
 * 🪪 OverviewCardLocal: Clone จาก OverviewCard ที่รับ prop ได้โดยตรง
 */
function OverviewCardLocal({ description }: { description: React.ReactNode }) {
  return (
    <Paper sx={{ ...layout.sectionPaper, mb: 3 }}>
      <Typography sx={textStyles.contentText}>{description}</Typography>
    </Paper>
  );
}

/**
 * 🛡️ RecommendationCardLocal
 */
function RecommendationCardLocal({
  title,
  content,
}: Recommendation) {
  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#164e63' }}>
      <Typography sx={{ color: '#22d3ee', fontWeight: 600, mb: 1 }}>{title}</Typography>
      <Typography sx={textStyles.contentText}>{content}</Typography>
    </Paper>
  );
}

/**
 * 🧰 ChecklistItemLocal
 */
function ChecklistItemLocal({
  title,
  content,
}: ChecklistItemData) {
  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#4c1d95' }}>
      <Typography sx={{ color: '#ddd6fe', fontWeight: 600, mb: 1 }}>{title}</Typography>
      <Typography sx={textStyles.contentText}>{content}</Typography>
    </Paper>
  );
}
/**
 * 🛠️ CustomerToolsCardLocal
 */
function CustomerToolsCardLocal({ tools }: { tools: ToolStatus[] }) {
  const getStatusColor = (status: ToolStatus['status']) =>
    ({
      active: '#4ade80',
      enabled: '#4ade80',
      inactive: '#facc15',
      missing: '#f87171',
    }[status] ?? '#e5e7eb');

  return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: '#1e293b' }}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tools.map((tool) => (
          <li key={tool.name} style={{ marginBottom: 8 }}>
            <strong style={{ color: '#f3f4f6' }}>{tool.name}</strong>:{' '}
            <span style={{ color: getStatusColor(tool.status) }}>{tool.status}</span>
          </li>
        ))}
      </ul>
    </Paper>
  );
}


/**
 * 🔐 AttackTypeCardLocal
 */
function AttackTypeCardLocal({ tacticId, tacticName, confidence }: AttackType) {
  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: '#312e81' }}>
      <Typography sx={textStyles.contentText}>
        {tacticId} - {tacticName}
      </Typography>
      <Typography sx={textStyles.contentText}>
        Confidence Score:{' '}
        <Box component="span" sx={{ color: '#facc15', fontWeight: 600 }}>{confidence}</Box>
      </Typography>
    </Paper>
  );
}

function TimelineProcess() {
  const [progress, setProgress] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)
  const requestRef = useRef<number | null>(null)

  // ดึงข้อมูลจริงจาก WebSocket
  const { data } = useWebSocket<TimelineData>('timeline')

  // กรณี WebSocket ยังไม่มา ให้ใช้ mock แทน
  const timelineData = data ?? timelineMockData[0]

  useEffect(() => {
    if (!timelineData) return

    const stepIndex = timelineStages.findIndex((s) => s === timelineData.stage)
    if (stepIndex === -1) return

    const stageProgress = stepIndex / (timelineStages.length - 1)
    const normalizedProgress = Math.max(stageProgress, timelineData.progress ?? 0)

    setTargetProgress(normalizedProgress)
  }, [timelineData])

  useEffect(() => {
    const animate = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev
        if (Math.abs(diff) < 0.005) return targetProgress
        return prev + diff * 0.1
      })
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current)
    }
  }, [targetProgress])

return (
  <Box sx={{ overflowX: 'auto', width: '100%' }}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 3,
        py: 3,
        px: 2,
        minWidth: 800,
        background: 'linear-gradient(to right, #1e293b, #4b0082)',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: '1px solid #8b5cf6',
      }}
    >
      {timelineStages.map((stage, idx) => {
        const stageThreshold = idx / (timelineStages.length - 1);
        const isActive = progress >= stageThreshold;
        const nextThreshold = (idx + 1) / (timelineStages.length - 1);

        return (
          <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            {/* Dot */}
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '4px solid',
                backgroundColor: isActive ? '#a855f7' : '#374151',
                borderColor: isActive ? '#d8b4fe' : '#6b7280',
                zIndex: 10,
                mb: 1,
                transition: 'background 0.3s, border-color 0.3s',
              }}
            />
            {/* Label */}
            <Typography
              sx={{
                color: isActive ? '#fff' : '#a1a1aa',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem',
                textAlign: 'center',
                minWidth: 90,
                mb: 1,
                transition: 'color 0.3s, font-weight 0.3s',
              }}
            >
              {stage}
            </Typography>
            {/* Line */}
            {idx < timelineStages.length - 1 && (
              <Box sx={{ width: '100%', height: 8, position: 'relative', mt: '-16px', mb: 1 }}>
                {/* Base line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 10,
                    right: -10,
                    height: 4,
                    background: '#6b7280',
                    borderRadius: 2,
                    zIndex: 1,
                  }}
                />
                {/* Progress line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 10,
                    height: 4,
                    background: '#a855f7',
                    borderRadius: 2,
                    zIndex: 2,
                    width:
                      progress <= stageThreshold
                        ? '0%'
                        : progress >= nextThreshold
                        ? '100%'
                        : `${((progress - stageThreshold) * (timelineStages.length - 1)) * 100}%`,
                    transition: 'width 0.3s',
                  }}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  </Box>
);
}
// -------------------- DevSocPage --------------------

function DevSocPage({ role, setRole }: { role: any; setRole: any }) {
  const { data: overviewLive } = useWebSocket<any>('overview');
  const { data: toolsLive } = useWebSocket<ToolStatus[]>('tools');
  const { data: recommendationsLive } = useWebSocket<any[]>('recommendations');
  const { data: checklistLive } = useWebSocket<any[]>('checklist');
  const { data: attackTypeLive } = useWebSocket<any>('attack');

  const overview = overviewLive || overviewMock
  const tools = toolsLive || toolsMock
  const recommendations = recommendationsLive || recommendationsMock
  const checklist = checklistLive || checklistMock
  const attackType = attackTypeLive || attackTypeMock

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ color: 'white', fontSize: '20px', fontWeight: 600, mb: 2 }}>
          🔍 Agent Summary Prototype
        </Typography>
      </Box>

      <Box sx={layout.gridTwoColumn}>
        <Box>
          <SectionWrapper title="Overview">
            <OverviewCardLocal description={highlightKeyword(overview.description)} />
          </SectionWrapper>

          <SectionWrapper title="Contextual Recommendations">
            {recommendations.map((rec, idx) => (
              <OverviewCardLocal key={idx} description={<><strong>{rec.title}:</strong> {rec.content}</>} />
            ))}
          </SectionWrapper>

          <SectionWrapper title="Customer Tools">
            <OverviewCardLocal
              description={
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {tools.map((tool) => (
                    <li key={tool.name}>
                      <strong>{tool.name}</strong>: {tool.status}
                    </li>
                  ))}
                </ul>
              }
            />
          </SectionWrapper>
        </Box>

        <Box>
          <SectionWrapper title="Attack Type Summary">
            <OverviewCardLocal
              description={`TA0006 - Credential Access\nConfidence Score: 0.345`}
            />
          </SectionWrapper>

          <SectionWrapper title="SOC Analyst Checklist">
            {checklist.map((item, idx) => (
              <OverviewCardLocal
                key={idx}
                description={<><strong>{item.title}:</strong> {item.content}</>}
              />
            ))}
          </SectionWrapper>
        </Box>
      </Box>
    </Box>
  );
}

// -------------------- Other Pages --------------------

function CustomerPage() {
  return (
    <main className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Customer Page</h2>
      <p>เนื้อหาของหน้า CUSTOMER จะใส่ตรงนี้</p>
    </main>
  )
}

function CustomerSuccessPage() {
  return (
    <main className="p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Customer Success Page</h2>
      <p>เนื้อหาของหน้า CUSTOMER SUCCESS จะใส่ตรงนี้</p>
    </main>
  )
}

// -------------------- Main HomePage --------------------

export default function HomePage() {
  const [role, setRole] = useState<'soc-dev' | 'customer' | 'customer-success'>('soc-dev');
  return (
    <Box sx={{ backgroundColor: '#111827', minHeight: '100vh' }}>
      <DevSocPage role={role} setRole={setRole} />
      <Footer role={role} setRole={setRole} />
    </Box>
  );
}
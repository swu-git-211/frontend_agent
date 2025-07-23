// components/index.tsx
// import * as styles from '../AgentSummary/styles_AgentSummary';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Paper, Chip, List, ListItem, ListItemText, Button, Stack, Stepper, Step, StepLabel } from '@mui/material';
// import React, { useEffect, useRef, useState, useCallback } from 'react';

// ------------------------------------------------------------
// Custom Hook: useWebSocket
// - เปิด connection WebSocket ไปยัง URL ที่ระบุ
// - รับข้อความ, แปลง JSON, และส่งข้อมูลให้ component
// - คืนค่าข้อมูลล่าสุด และฟังก์ชันสำหรับส่งข้อความ (optional)
// ------------------------------------------------------------

// 🌐 WebSocket URL ที่กำหนดตายตัว (สามารถแก้เป็นของจริงได้)
const FIXED_WS_URL = 'ws://localhost:8080'

// 🔌 ใช้งาน: const { data, sendMessage } = useWebSocket<DataType>('overview')
export function useWebSocket<T>(expectedType: string): {
  data: T | null
  sendMessage: (msg: any) => void
} {
  const [data, setData] = useState<T | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    let reconnectAttempts = 0
    let reconnectTimeout: NodeJS.Timeout | null = null

    const connect = () => {
      const ws = new WebSocket(FIXED_WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        console.log(`✅ WebSocket connected to ${FIXED_WS_URL}`)
        reconnectAttempts = 0
      }

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data)

          if (parsed.type === expectedType) {
            // ✅ ถ้า type ตรงกับที่ต้องการ → เก็บข้อมูลเข้า state
            setData(parsed.data)
          } else {
            // ℹ️ รับ type อื่นที่ไม่สนใจ → log ไว้
            console.debug(
              `ℹ️ Received "${parsed.type}" but expected "${expectedType}"`
            )
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
        }
      }

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event)
      }

      ws.onclose = () => {
        console.warn('🔌 WebSocket disconnected')
        // ♻️ ลอง reconnect ถ้ายังไม่ครบ 5 ครั้ง
        if (reconnectAttempts < 5) {
          const delay = Math.min(5000, 1000 * 2 ** reconnectAttempts)
          reconnectTimeout = setTimeout(() => {
            reconnectAttempts++
            connect()
          }, delay)
        }
      }
    }

    connect()

    // 🧹 Cleanup ตอน component ถูกถอดออก
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
    }
  }, [expectedType])

  /**
   * 📨 ฟังก์ชันส่งข้อความ (object หรือ string) กลับไปยัง server ผ่าน WebSocket
   */
  const sendMessage = useCallback((msg: any) => {
    const json = typeof msg === 'string' ? msg : JSON.stringify(msg)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(json)
    } else {
      console.warn('⚠️ Cannot send message. WebSocket is not open.')
    }
  }, [])

  return { data, sendMessage }
}

// ------------------------------------------------------------
// AttackTypeCard: แสดง tactic และ confidence
// รับข้อมูล array ของ tactic ผ่าน WebSocket URL ที่ส่งเข้ามา
// ------------------------------------------------------------
interface AttackTypeData {
  tacticId: string;
  tacticName: string;
  confidence: number;
}

export function AttackTypeCard() {
  // รับข้อมูลเป็น array ของ AttackTypeData
  const { data } = useWebSocket<AttackTypeData[]>('attack-type');
  if (!data) return <Typography color="white">Loading AttackType...</Typography>;

  if (!data) return <p>Loading AttackType...</p>;

  return (
    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', mb: 2 }}>
      {data.map((item) => (
        <Box key={item.tacticId} mb={2}>
          <Typography color="white">{item.tacticId} - {item.tacticName}</Typography>
          <Typography>
            Confidence Score: <Box component="span" sx={{ color: '#facc15', fontWeight: 600 }}>{item.confidence}</Box>
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

// ------------------------------------------------------------
// ChecklistItem: แสดงรายการ checklist
// รับข้อมูล array ของ checklist ผ่าน WebSocket
// ------------------------------------------------------------
interface ChecklistData {
  title: React.ReactNode;
  content: React.ReactNode;
}

export function ChecklistItem() {
  const { data } = useWebSocket<ChecklistData[]>('checklist');

  if (!data) return <Typography color="white">Loading Checklist...</Typography>;

  return (
    <Stack spacing={2}>
      {data.map((item, idx) => (
        <Paper key={idx} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <Typography sx={{ color: '#ddd6fe', fontWeight: 600 }}>{item.title}</Typography>
          <Typography color="white">{item.content}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}

// ------------------------------------------------------------
// CustomerToolsCard: แสดงสถานะของ tools ที่ลูกค้าใช้
// รับข้อมูล array ของ tools ผ่าน WebSocket
// ------------------------------------------------------------
export interface ToolStatus {
  name: string;
  status: 'active' | 'inactive' | 'enabled' | 'missing';
}

export function CustomerToolsCard() {
  const { data: tools } = useWebSocket<ToolStatus[]>('tools');

  if (!tools) return <Typography color="white">Loading Tools Status...</Typography>;

    const getStatusColor = (status: ToolStatus['status']) => {
    const map: Record<string, string> = {
      active: '#4ade80',
      enabled: '#4ade80',
      inactive: '#facc15',
      missing: '#f87171',
    };
    return map[status] || '#e5e7eb';
  };

    return (
    <Paper sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
      <List dense>
        {tools.map((tool) => (
          <ListItem key={tool.name}>
            <ListItemText
              primary={<><strong style={{ color: '#f3f4f6' }}>{tool.name}</strong>: <span style={{ color: getStatusColor(tool.status) }}>{tool.status}</span></>}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

// ------------------------------------------------------------
// ExecutiveSummaryItem: ใช้ในรายงานสรุปผู้บริหาร
// รับข้อมูล array ของ executive summary ผ่าน WebSocket
// ------------------------------------------------------------
export function ExecutiveSummaryItem() {
  const { data } = useWebSocket<ChecklistData[]>('executive-summary');

  if (!data) return <Typography color="white">Loading Executive Summary...</Typography>;

  return (
    <Stack spacing={2}>
      {data.map((item, idx) => (
        <Paper key={idx} sx={{ p: 2, mt: 2, bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <Typography sx={{ color: '#c084fc', fontWeight: 600 }}>{item.title}</Typography>
          <Typography color="white">{item.content}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}

// ------------------------------------------------------------
// Footer และ RoleButton: สำหรับเปลี่ยนบริบทผู้ใช้งาน
// ไม่มีข้อมูลจาก WebSocket
// ------------------------------------------------------------
interface FooterProps {
  role: 'soc-dev' | 'customer' | 'customer-success';
  setRole: (role: FooterProps['role']) => void;
}

interface RoleButtonProps {
  roleName: FooterProps['role'];
  currentRole: FooterProps['role'];
  onClick: (role: FooterProps['role']) => void;
  children: React.ReactNode;
}

function RoleButton({ roleName, currentRole, onClick, children }: RoleButtonProps) {
  const isActive = roleName === currentRole;
  // เนื่องจากไม่ใช้ classnames จึงใช้ template literal แบบตรงๆ
  // const btnClass = `${styles.roleButtonBase} ${isActive ? styles.roleButtonActive : styles.roleButtonInactive}`;

  return (
    <Button
      variant="contained"
      color={isActive ? 'secondary' : 'inherit'}
      size="small"
      onClick={() => onClick(roleName)}
    >
      {children}
    </Button>
  );
}

export function Footer({ role, setRole }: FooterProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2} mt={5} sx={{ bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="gray">Role:</Typography>
        <RoleButton roleName="soc-dev" currentRole={role} onClick={setRole}>SOC & DEV</RoleButton>
        <RoleButton roleName="customer" currentRole={role} onClick={setRole}>CUSTOMER</RoleButton>
        <RoleButton roleName="customer-success" currentRole={role} onClick={setRole}>CUSTOMER SUCCESS</RoleButton>
      </Stack>
    </Box>
  );
}

// ------------------------------------------------------------
// OverviewCard: แสดงคำอธิบายเบื้องต้น
// รับข้อมูล description ผ่าน WebSocket (single object)
// ------------------------------------------------------------
interface OverviewData {
  description: React.ReactNode;
}

export function OverviewCard() {
  const { data } = useWebSocket<OverviewData>('overview');

  if (!data) return <Typography color="white">Loading Overview...</Typography>;

  return (
    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', mb: 2 }}>
      <Typography color="white">{data.description}</Typography>
    </Paper>
  );
}

// ------------------------------------------------------------
// RecommendationCard: แสดงคำแนะนำด้านความปลอดภัย
// รับข้อมูล array ของ recommendation ผ่าน WebSocket
// ------------------------------------------------------------
interface RecommendationData {
  title: React.ReactNode;
  content: React.ReactNode;
}

export function RecommendationCard() {
  const { data } = useWebSocket<RecommendationData[]>('recommendation');

  if (!data) return <Typography color="white">Loading Recommendation...</Typography>;

  return (
    <Stack spacing={2}>
      {data.map((rec, idx) => (
        <Paper key={idx} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <Typography sx={{ color: '#22d3ee', fontWeight: 600 }}>{rec.title}</Typography>
          <Typography color="white">{rec.content}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}

// ------------------------------------------------------------
// TimelineProcess:
// - แสดง Timeline process แบบ dynamic
// - รับข้อมูลแบบ real-time ผ่าน WebSocket URL
// - ใช้ requestAnimationFrame สำหรับ animation progress
// ------------------------------------------------------------
const stages = [
  'Received Alert',
  'TypeAgent',
  'Specified Type',
  'Threat Analysis',
  'Analyze Context',
  'Summary',
  'Recommendation',
];

// รูปแบบข้อมูลที่รับจาก WebSocket สำหรับ timeline
interface TimelineData {
  stage: string;       // ชื่อ stage ปัจจุบัน
  progress?: number;   // ค่าความคืบหน้า (optional, 0.0 - 1.0)
}

export function TimelineProcess() {
  // current progress ที่แสดงใน UI (0.0 - 1.0)
  const [progress, setProgress] = useState(0);
  // target progress ที่จะค่อยๆ เคลื่อนมาหา
  const [targetProgress, setTargetProgress] = useState(0);
  const requestRef = useRef<number | null>(null);

  // ใช้ custom hook รอรับข้อมูล timeline แบบ realtime
  const { data } = useWebSocket<TimelineData>('timeline');

  // เมื่อข้อมูลจาก WebSocket มาใหม่ ให้คำนวณ progress เป้าหมาย
  useEffect(() => {
    if (!data) return;

    // หา index ของ stage ปัจจุบันในลิสต์ stages
    const stepIndex = stages.findIndex((s) => s === data.stage);
    if (stepIndex === -1) return;

    // คำนวณ progress แบบ normalized (0 ถึง 1)
    const stageProgress = stepIndex / (stages.length - 1);
    const normalizedProgress = Math.max(stageProgress, data.progress ?? 0);

    setTargetProgress(normalizedProgress);
  }, [data]);

  // animation แบบ smooth โดยใช้ requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      setProgress((prev) => {
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.005) return targetProgress; // หากใกล้เคียงแล้ว ให้หยุด
        return prev + diff * 0.1; // เดินทีละ 10% ของระยะห่าง
      });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // ล้าง animation frame เมื่อ component unmount หรือ targetProgress เปลี่ยน
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [targetProgress]);

  const currentStep = Math.round(progress * (stages.length - 1));

  // สร้าง UI timeline แสดงแต่ละ stage ตาม progress ปัจจุบัน
  return (
    <Box sx={{ width: '100%', overflowX: 'auto', px: 2, py: 3 }}>
      <Stepper activeStep={currentStep} alternativeLabel>
        {stages.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
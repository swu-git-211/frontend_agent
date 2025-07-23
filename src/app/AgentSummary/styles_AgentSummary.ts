/**
 * 🎨 MUI-based Styles Reference (No Tailwind)
 * ใช้ใน Component ที่ถูกแปลงจาก Tailwind เป็น MUI แล้ว
 */

// ==== Color Map for Tool Status ==== 
export const statusColorMap = {
  active: '#4ade80',
  enabled: '#4ade80',
  inactive: '#facc15',
  missing: '#f87171',
  fallback: '#e5e7eb',
};

// ==== Layout and Container Helpers ====
export const layout = {
  gridTwoColumn: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    padding: '24px',
    backgroundColor: '#1f2937',
    borderRadius: '12px',
  },
  sectionPaper: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    border: '1px solid #374151',
  },
  warningBox: {
    backgroundColor: '#f59e0b',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
};

// ==== Typography ====
export const textStyles = {
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '0.75rem',
  },
  contentText: {
    fontSize: '0.875rem',
    color: '#e5e7eb',
  },
  smallLabel: {
    fontSize: '0.75rem',
    color: '#d1d5db',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  centered: {
    textAlign: 'center',
    color: '#fff',
  },
};

// ==== Footer & Role Buttons ====
export const footerStyles = {
  wrapper: {
    width: '100%',
    marginTop: '3rem',
    padding: '12px 24px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875rem',
    color: '#e5e7eb',
  },
  roleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
};

// ==== Timeline (if MUI not used) ====
export const timelineLegacy = {
  wrapper: {
    display: 'flex',
    minWidth: '800px',
    justifyContent: 'space-between',
    padding: '24px',
    borderRadius: '12px',
    background: 'linear-gradient(to right, #1e293b, #4b0082)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    border: '1px solid #8b5cf6',
  },
  dot: {
    width: '20px',
    height: '20px',
    borderRadius: '9999px',
    border: '4px solid',
    zIndex: 10,
  },
  dotActive: {
    backgroundColor: '#a855f7',
    borderColor: '#d8b4fe',
  },
  dotInactive: {
    backgroundColor: '#374151',
    borderColor: '#6b7280',
  },
};

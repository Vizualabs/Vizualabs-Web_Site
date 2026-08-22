import type { LucideIcon } from 'lucide-react'
import {
  Bot,
  Brain,
  CalendarClock,
  ClipboardList,
  CookingPot,
  LineChart,
  MonitorSmartphone,
  Stethoscope,
  UtensilsCrossed,
  Workflow,
  Users,
  ShieldCheck,
} from 'lucide-react'

export type ProductId = 'odeasy' | 'dine-mate' | 'doc-channeling'

export type ProductFeature = {
  title: string
  description: string
  icon: LucideIcon
}

export type Product = {
  id: ProductId
  number: string
  name: string
  category: string
  tagline: string
  description: string
  accent: string
  accentSoft: string
  contactParam: string
  highlights: string[]
  features: ProductFeature[]
  metrics: Array<{ label: string; value: string }>
  mockUrl: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'odeasy',
    number: '01',
    name: 'Odeasy',
    category: 'Business AI Agent',
    tagline: 'Autonomous workflows. Actionable intelligence.',
    description:
      'Odeasy is an always-on business AI agent that orchestrates operations, surfaces decisions, and closes the loop between insight and execution — without waiting on a human bottleneck.',
    accent: '#FF5E4D',
    accentSoft: 'rgba(255, 94, 77, 0.14)',
    contactParam: 'odeasy',
    highlights: [
      'Autonomous workflow automation',
      'Business intelligence copilots',
      'Multi-system orchestration',
      'Audit-ready action trails',
    ],
    features: [
      {
        title: 'Workflow Autopilot',
        description:
          'Trigger multi-step business processes across CRM, ERP, and messaging — with guardrails and human escalation when needed.',
        icon: Workflow,
      },
      {
        title: 'Decision Intelligence',
        description:
          'Turn operational noise into ranked recommendations, forecasts, and next-best actions your team can trust.',
        icon: Brain,
      },
      {
        title: 'Agent Observability',
        description:
          'Full visibility into every agent decision, tool call, and outcome — built for ops leaders, not only engineers.',
        icon: LineChart,
      },
      {
        title: 'Enterprise Controls',
        description:
          'Role-based permissions, policy hooks, and compliance logging so autonomy never outruns governance.',
        icon: ShieldCheck,
      },
    ],
    metrics: [
      { label: 'Manual ops reduced', value: '60%' },
      { label: 'Decision latency', value: '<2m' },
      { label: 'Systems connected', value: '20+' },
    ],
    mockUrl: 'odeasy.vizualabs.com',
  },
  {
    id: 'dine-mate',
    number: '02',
    name: 'Dine Mate',
    category: 'Restaurant POS',
    tagline: 'Floor to kitchen. One seamless system.',
    description:
      'Dine Mate is a modern restaurant POS built for speed — smart ordering, kitchen display, and dining management that keeps service flowing from first seat to last check.',
    accent: '#FF8A6B',
    accentSoft: 'rgba(255, 138, 107, 0.14)',
    contactParam: 'dine-mate',
    highlights: [
      'Smart table & QR ordering',
      'Real-time kitchen display',
      'Staff & shift control',
      'Payments & reporting',
    ],
    features: [
      {
        title: 'Unified Ordering',
        description:
          'Table-side, QR, and counter orders land in one queue — modifiers, courses, and fire timing included.',
        icon: UtensilsCrossed,
      },
      {
        title: 'Kitchen Display',
        description:
          'Station-aware KDS with bump timers, course pacing, and clear priority so the pass never stalls.',
        icon: CookingPot,
      },
      {
        title: 'Floor Control',
        description:
          'Live table status, server sections, and turn tracking so hosts and managers see the room in real time.',
        icon: MonitorSmartphone,
      },
      {
        title: 'Ops Insights',
        description:
          'Sales, voids, ticket times, and item performance — dashboards that help you run a tighter service.',
        icon: ClipboardList,
      },
    ],
    metrics: [
      { label: 'Faster ticket times', value: '35%' },
      { label: 'Order accuracy', value: '99%' },
      { label: 'Stations synced', value: 'Live' },
    ],
    mockUrl: 'dinemate.vizualabs.com',
  },
  {
    id: 'doc-channeling',
    number: '03',
    name: 'Doc Channeling',
    category: 'Healthcare AI Agent',
    tagline: 'Scheduling, queues, and triage — intelligently.',
    description:
      'Doc Channeling is an AI agent for clinics and hospitals that schedules appointments, manages patient queues, and supports digital triage so care teams focus on patients — not paperwork.',
    accent: '#FFB4A8',
    accentSoft: 'rgba(255, 180, 168, 0.14)',
    contactParam: 'doc-channeling',
    highlights: [
      'Smart appointment scheduling',
      'Live patient queue mgmt',
      'Digital triage assistant',
      'Clinic-wide coordination',
    ],
    features: [
      {
        title: 'Intelligent Scheduling',
        description:
          'Match patients to the right doctor, slot, and specialty — accounting for urgency, follow-ups, and no-show risk.',
        icon: CalendarClock,
      },
      {
        title: 'Queue Orchestration',
        description:
          'Real-time waiting-room intelligence with ETA updates, room routing, and balanced clinician load.',
        icon: Users,
      },
      {
        title: 'Digital Triage',
        description:
          'Structured intake and symptom routing that flags high-priority cases before they hit the front desk.',
        icon: Stethoscope,
      },
      {
        title: 'Care Copilot',
        description:
          'An always-available agent for staff and patients — reminders, prep instructions, and status answers around the clock.',
        icon: Bot,
      },
    ],
    metrics: [
      { label: 'No-show reduction', value: '28%' },
      { label: 'Triage response', value: '<30s' },
      { label: 'Queue clarity', value: 'Real-time' },
    ],
    mockUrl: 'doc.vizualabs.com',
  },
]

export function getProduct(id: ProductId) {
  return PRODUCTS.find((p) => p.id === id)
}

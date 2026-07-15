import { Lead, Agent, Unit, PipelineData, Role } from './types';
import { leads as allLeads, units as allUnits, agents as allAgents, getPipelineData } from './mockData';
import { formatCurrency } from './utils';


interface ChatContext {
  role: Role;
  userName: string;
  leads: Lead[];
  units: Unit[];
  agents: Agent[];
}

export function generateAIResponse(message: string, context: ChatContext): { text: string; data?: any } {
  const msg = message.toLowerCase().trim();
  const { role, userName, leads, units, agents } = context;

  // Helper: filter leads for agent/manager
  const visibleLeads = leads;

  // 1. Hot / Warm leads
  if (msg.includes('hot') && (msg.includes('lead') || msg.includes('leads'))) {
    const hot = visibleLeads.filter(l => l.tags.includes('Hot') && !['Closed','Lost'].includes(l.stage));
    if (hot.length === 0) return { text: "No hot leads currently in your scope." };
    return {
      text: `Here are the current hot leads (${hot.length}):`,
      data: hot.slice(0, 5).map(l => `${l.name} — ${formatCurrency(l.budget)} (${l.project}, ${l.stage})`)
    };
  }

  // 2. No activity in N days
  if ((msg.includes('no activity') || msg.includes('stale') || msg.includes('untouched')) && (msg.includes('day') || msg.includes('days'))) {
    const stale = visibleLeads.filter(l => {
      const last = new Date(l.lastActivity);
      const days = (Date.now() - last.getTime()) / (1000 * 3600 * 24);
      return days >= 5 && !['Booked', 'Closed', 'Lost'].includes(l.stage);
    });
    if (stale.length === 0) return { text: "All active leads have had recent activity. Great work!" };
    return {
      text: `${stale.length} lead(s) with 5+ days of no activity:`,
      data: stale.map(l => `${l.name} (${l.assignedTo}) — last active ${l.lastActivity}`)
    };
  }

  // 3. Inventory query
  if ((msg.includes('bhk') || msg.includes('unit') || msg.includes('available')) && msg.includes('tower')) {
    const towerMatch = msg.match(/tower\s*([a-z])/i);
    const bhkMatch = msg.match(/(\d)\s*bhk/i);
    let filtered = units.filter(u => u.status === 'Available');
    
    if (towerMatch) filtered = filtered.filter(u => u.tower.toLowerCase() === towerMatch[1].toLowerCase());
    if (bhkMatch) filtered = filtered.filter(u => u.type.toLowerCase().includes(bhkMatch[1]));
    
    if (filtered.length === 0) return { text: "No matching available units right now." };
    
    return {
      text: `Found ${filtered.length} available unit(s):`,
      data: filtered.slice(0, 4).map(u => `${u.unitNumber} • ${u.type} • ${u.area} sqft • ${formatCurrency(u.price)}`)
    };
  }

  if (msg.includes('available') && (msg.includes('3bhk') || msg.includes('2bhk'))) {
    const bhk = msg.includes('3bhk') ? '3BHK' : '2BHK';
    const avail = units.filter(u => u.type === bhk && u.status === 'Available');
    return {
      text: `${avail.length} ${bhk} units available across projects.`,
      data: avail.map(u => `${u.project} ${u.tower}-${u.floor}${u.unitNumber.split('-')[1]} — ${formatCurrency(u.price)}`)
    };
  }

  // 4. Leads by source
  if (msg.includes('instagram') || msg.includes('meta') || msg.includes('google') || msg.includes('source')) {
    const sources = ['Meta Ads', 'Google Ads', 'Website', '99acres'] as const;
    const source = sources.find(s => msg.includes(s.toLowerCase().split(' ')[0]));
    const filtered = visibleLeads.filter(l => source ? l.source === source : true);
    
    return {
      text: source ? `${filtered.length} leads from ${source}` : `${filtered.length} leads total`,
      data: filtered.slice(0, 4).map(l => `${l.name} — ${l.source} — ${l.stage}`)
    };
  }

  // 5. Budget based
  if (msg.includes('above') || msg.includes('budget') || msg.includes('cr') || msg.includes('lakh')) {
    const numMatch = msg.match(/(\d+(?:\.\d+)?)\s*(cr|l|lakh|k)?/i);
    let min = 8000000;
    if (numMatch) {
      let val = parseFloat(numMatch[1]);
      const unit = (numMatch[2] || '').toLowerCase();
      if (unit === 'cr') min = val * 10000000;
      else if (unit.includes('l')) min = val * 100000;
      else min = val;
    }
    const filtered = visibleLeads.filter(l => l.budget >= min && !['Lost'].includes(l.stage));
    return {
      text: `${filtered.length} lead(s) with budget ≥ ${formatCurrency(min)}`,
      data: filtered.slice(0, 4).map(l => `${l.name} • ${formatCurrency(l.budget)} • ${l.stage}`)
    };
  }

  // 6. Team conversion / performance
  if ((msg.includes('conversion') || msg.includes('team') || msg.includes('performance')) && (role !== 'Agent')) {
    const total = visibleLeads.length;
    const booked = visibleLeads.filter(l => l.stage === 'Booked' || l.stage === 'Closed').length;
    const rate = total ? Math.round((booked / total) * 100) : 0;
    
    const top = [...agents].sort((a, b) => b.bookings - a.bookings).slice(0, 3);
    
    return {
      text: `Overall conversion: ${rate}% (${booked}/${total} booked or closed). Top performers:`,
      data: top.map(a => `${a.name}: ${a.bookings} bookings`)
    };
  }

  // 7. Write follow-up message
  if (msg.includes('follow') || msg.includes('write') || msg.includes('whatsapp') || msg.includes('message') || msg.includes('draft')) {
    // Try to identify lead
    const leadName = visibleLeads.find(l => msg.toLowerCase().includes(l.name.toLowerCase().split(' ')[0]));
    const name = leadName ? leadName.name : 'the lead';
    const text = `Hi ${name.split(' ')[0]}, following up on your recent visit to ${leadName?.project || 'the project'}. Would you like me to send over the updated cost sheet and availability for your preferred unit? Happy to schedule a quick call this week.`;
    return { text: "Here's a contextual follow-up you can send:", data: [text] };
  }

  // 8. Revenue
  if (msg.includes('revenue') || msg.includes('target')) {
    const current = 13950000;
    const target = 17200000;
    const pct = Math.round((current / target) * 100);
    return { 
      text: `Revenue collected this month: ${formatCurrency(current)} of ${formatCurrency(target)} target (${pct}%). ${pct < 85 ? 'We need to push pipeline hard this week.' : 'Solid progress.'}` 
    };
  }

  // 9. General pipeline overview
  if (msg.includes('pipeline') || msg.includes('funnel')) {
    const pipeline = getPipelineData(visibleLeads);
    const total = visibleLeads.length;
    const bookedValue = pipeline.find(p => p.stage === 'Booked')?.value || 0;
    return {
      text: `Current pipeline: ${total} leads. Booked value: ${formatCurrency(bookedValue)}`,
      data: pipeline.filter(p => p.count > 0).map(p => `${p.stage}: ${p.count} (${formatCurrency(p.value)})`)
    };
  }

  // 10. My leads or agent specific
  if (msg.includes('my lead') || msg.includes('assigned')) {
    const my = visibleLeads.filter(l => l.assignedTo.toLowerCase().includes(userName.toLowerCase().split(' ')[0]));
    return {
      text: `You have ${my.length} leads assigned.`,
      data: my.slice(0, 5).map(l => `${l.name} — ${l.stage} — ${l.source}`)
    };
  }

  // Fallback — helpful generic + suggestions
  const fallbacks = [
    "I can pull live data on leads, inventory, pipeline, and performance. Try asking: 'Show hot leads above 80L' or 'Available 3BHK in Tower A'.",
    "Need help drafting messages, checking stale leads, or reviewing your team's pipeline?",
  ];
  return { text: fallbacks[Math.floor(Math.random() * fallbacks.length)] };
}

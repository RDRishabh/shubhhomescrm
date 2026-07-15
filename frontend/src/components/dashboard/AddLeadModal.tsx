'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Building, 
  Target, 
  Calendar, 
  Sparkles, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Flame,
  Tag,
  Briefcase,
  FileText,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Lead, LeadSource, LeadStage } from '@/lib/types';
import { agents } from '@/lib/mockData';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded?: (lead?: Lead) => void;
}

type TabType = 'contact' | 'requirements' | 'marketing' | 'action';

export default function AddLeadModal({ isOpen, onClose, onLeadAdded }: AddLeadModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    // Contact Info
    name: '',
    phone: '',
    sameWhatsapp: true,
    whatsapp: '',
    email: '',
    alternatePhone: '',
    city: '',
    preferredContact: 'Call',
    preferredTime: 'Morning (9 AM - 12 PM)',

    // Property & Requirement
    project: 'Aether Heights',
    configuration: '3BHK',
    budget: '8500000',
    purpose: 'End Use',
    possessionTimeframe: 'Ready to Move',
    financingStatus: 'Bank Loan Required',

    // Marketing & Assignment
    source: 'Website' as LeadSource,
    campaignDetails: '',
    temperature: 'Hot' as 'Hot' | 'Warm' | 'Cold',
    stage: 'New' as LeadStage,
    assignedTo: 'Rohan Sharma',

    // Notes & Action
    notes: '',
    nextAction: 'Schedule Callback',
    nextFollowUpDate: '',
    nextFollowUpTime: '10:30',
    priority: 'High' as 'High' | 'Medium' | 'Low',
    sendWelcomeMsg: true,
  });

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhoneChange = (val: string) => {
    setForm(prev => ({
      ...prev,
      phone: val,
      whatsapp: prev.sameWhatsapp ? val : prev.whatsapp
    }));
  };

  const handleSameWhatsappToggle = (checked: boolean) => {
    setForm(prev => ({
      ...prev,
      sameWhatsapp: checked,
      whatsapp: checked ? prev.phone : prev.whatsapp
    }));
  };

  const formatBudgetDisplay = (amountStr: string) => {
    const num = parseInt(amountStr, 10);
    if (isNaN(num) || num <= 0) return '₹0';
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(num / 100000).toFixed(1)} Lakhs`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and Phone are required', {
        description: 'Please provide full contact details to save the lead.'
      });
      setActiveTab('contact');
      return;
    }

    setIsSubmitting(true);

    const budgetNum = parseInt(form.budget, 10) || 7500000;
    
    // Tag generation based on selections
    const tags: string[] = [form.temperature];
    if (form.configuration) tags.push(form.configuration);
    if (form.purpose === 'Investment') tags.push('Investor');

    const newLeadPayload: Partial<Lead> = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || `${form.name.toLowerCase().replace(/\s+/g, '.')}@client.com`,
      source: form.source,
      stage: form.stage,
      budget: budgetNum,
      project: form.project,
      assignedTo: form.assignedTo,
      tags: tags,
      value: budgetNum,
      whatsapp: form.sameWhatsapp ? form.phone.trim() : form.whatsapp.trim(),
      alternatePhone: form.alternatePhone.trim(),
      city: form.city.trim(),
      preferredContact: form.preferredContact,
      preferredTime: form.preferredTime,
      configuration: form.configuration,
      purpose: form.purpose,
      possessionTimeframe: form.possessionTimeframe,
      financingStatus: form.financingStatus,
      campaignDetails: form.campaignDetails.trim(),
      temperature: form.temperature,
      notes: form.notes.trim(),
      nextAction: form.nextAction,
      nextFollowUp: form.nextFollowUpDate ? `${form.nextFollowUpDate}T${form.nextFollowUpTime}` : undefined,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to save to database');
      }

      const createdData = await res.json();

      toast.success('Lead captured successfully! 🎉', {
        description: `${createdData.name || form.name} • ${form.project} (${formatBudgetDisplay(form.budget)}) • Assigned to ${form.assignedTo}`,
      });

      if (form.sendWelcomeMsg) {
        toast.info('Automated WhatsApp Welcome Queued', {
          description: `Sent property brochure for ${form.project} to ${form.phone}`
        });
      }

      onLeadAdded?.(createdData);
      onClose();

      // Reset form to clean state
      setForm({
        name: '',
        phone: '',
        sameWhatsapp: true,
        whatsapp: '',
        email: '',
        alternatePhone: '',
        city: '',
        preferredContact: 'Call',
        preferredTime: 'Morning (9 AM - 12 PM)',
        project: 'Aether Heights',
        configuration: '3BHK',
        budget: '8500000',
        purpose: 'End Use',
        possessionTimeframe: 'Ready to Move',
        financingStatus: 'Bank Loan Required',
        source: 'Website',
        campaignDetails: '',
        temperature: 'Hot',
        stage: 'New',
        assignedTo: 'Rohan Sharma',
        notes: '',
        nextAction: 'Schedule Callback',
        nextFollowUpDate: '',
        nextFollowUpTime: '10:30',
        priority: 'High',
        sendWelcomeMsg: true,
      });
      setActiveTab('contact');
    } catch (err) {
      console.error(err);
      toast.error('Could not create lead in database. Simulating offline save...');
      
      // Fallback local notification
      onLeadAdded?.({
        id: 'L' + Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        ...newLeadPayload
      } as Lead);

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'contact', label: '1. Contact Details', icon: User, desc: 'Name, phone & preferred channel' },
    { id: 'requirements', label: '2. Requirements', icon: Building, desc: 'Project, configuration & budget' },
    { id: 'marketing', label: '3. Attribution & Agent', icon: Target, desc: 'Source, lead score & assignee' },
    { id: 'action', label: '4. Notes & Follow-up', icon: Calendar, desc: 'Remarks & automated next task' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] overflow-hidden">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Slide-in Drawer Right Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="fixed inset-y-0 right-0 z-[101] w-full max-w-2xl bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--surface-2)]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 flex items-center justify-center shadow-xs">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg tracking-tight">Capture New Lead</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)] text-white tracking-wide uppercase">
                    Detailed Drawer
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Complete real estate buyer profile & automated CRM workflow engine
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-foreground hover:bg-[var(--surface-2)] transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Stepper / Tab Selector Bar */}
          <div className="grid grid-cols-4 border-b border-[var(--border)] bg-[var(--surface)] text-xs font-medium">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-3 px-2 border-b-2 transition text-center ${
                    isActive 
                      ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5 font-semibold' 
                      : 'border-transparent text-[var(--text-muted)] hover:text-foreground hover:bg-[var(--surface-2)]/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 mb-1 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                  <span className="truncate w-full">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* TAB 1: CONTACT DETAILS */}
            {activeTab === 'contact' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <User className="h-4 w-4 text-[var(--accent)]" />
                  <h4 className="font-semibold text-sm">Personal & Primary Contact Information</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Vikram Malhotra"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      Primary Phone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Checkbox & Input */}
                <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-medium">WhatsApp Number</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text-muted)]">
                      <input
                        type="checkbox"
                        checked={form.sameWhatsapp}
                        onChange={(e) => handleSameWhatsappToggle(e.target.checked)}
                        className="rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                      />
                      Same as phone
                    </label>
                  </div>

                  {!form.sameWhatsapp && (
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                      placeholder="Enter alternate WhatsApp number"
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="vikram@example.com"
                        className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Secondary / Alternate Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="tel"
                        value={form.alternatePhone}
                        onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })}
                        placeholder="+91 98111 22233 (Spouse/Office)"
                        className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-medium text-foreground">City / Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="e.g. Gurugram / Delhi"
                        className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-medium text-foreground">Preferred Channel</label>
                    <select
                      value={form.preferredContact}
                      onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="Call">Phone Call</option>
                      <option value="WhatsApp">WhatsApp Chat</option>
                      <option value="Email">Email</option>
                      <option value="Site Visit">In-Person Meeting</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-medium text-foreground">Best Contact Time</label>
                    <select
                      value={form.preferredTime}
                      onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                    >
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROPERTY REQUIREMENTS */}
            {activeTab === 'requirements' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <Building className="h-4 w-4 text-[var(--accent)]" />
                  <h4 className="font-semibold text-sm">Property Preferences & Budget Range</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Target Project</label>
                    <select
                      value={form.project}
                      onChange={(e) => setForm({ ...form, project: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] font-medium"
                    >
                      <option value="Aether Heights">Aether Heights (Luxury High-rise)</option>
                      <option value="Skyline Villas">Skyline Villas (Gated Community)</option>
                      <option value="Riverfront Residences">Riverfront Residences (Scenic Apartments)</option>
                      <option value="Emerald Estate">Emerald Estate (Ultra Luxury)</option>
                      <option value="Grand Horizon">Grand Horizon (Commercial & Suites)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Configuration / Typology</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse', 'Studio'].map((cfg) => (
                        <button
                          key={cfg}
                          type="button"
                          onClick={() => setForm({ ...form, configuration: cfg })}
                          className={`py-1.5 px-2 text-xs rounded-lg border transition text-center ${
                            form.configuration === cfg
                              ? 'bg-[var(--accent)] text-white border-[var(--accent)] font-semibold shadow-xs'
                              : 'border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-muted)]'
                          }`}
                        >
                          {cfg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Budget Slider & Display */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-[var(--accent)]" />
                      Target Budget (INR)
                    </label>
                    <span className="text-sm font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full border border-[var(--accent)]/20">
                      {formatBudgetDisplay(form.budget)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="3000000"
                    max="30000000"
                    step="500000"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full accent-[var(--accent)] cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                    <span>₹30 Lakhs</span>
                    <span>₹1 Crore</span>
                    <span>₹2 Crores</span>
                    <span>₹3 Crores+</span>
                  </div>

                  <div className="pt-2">
                    <input
                      type="number"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      placeholder="Enter exact budget in INR"
                      className="w-full px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Purchase Purpose</label>
                    <select
                      value={form.purpose}
                      onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm"
                    >
                      <option value="End Use">End Use (Self Residence)</option>
                      <option value="Investment">High-Yield Investment</option>
                      <option value="Rental Yield">Rental Income</option>
                      <option value="NRI Purchase">NRI / Offshore</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Possession Timeframe</label>
                    <select
                      value={form.possessionTimeframe}
                      onChange={(e) => setForm({ ...form, possessionTimeframe: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm"
                    >
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Within 3 Months">Within 3 Months</option>
                      <option value="Within 6 Months">Within 6 Months</option>
                      <option value="Under Construction (1+ Yr)">Under Construction (1+ Yr)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Home Loan Status</label>
                    <select
                      value={form.financingStatus}
                      onChange={(e) => setForm({ ...form, financingStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm"
                    >
                      <option value="Self-Funded">Self-Funded / Cash</option>
                      <option value="Bank Loan Required">Bank Loan Needed</option>
                      <option value="Pre-Approved Loan">Pre-Approved Loan</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MARKETING & ASSIGNMENT */}
            {activeTab === 'marketing' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <Target className="h-4 w-4 text-[var(--accent)]" />
                  <h4 className="font-semibold text-sm">Marketing Attribution & Team Allocation</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Lead Source Channel</label>
                    <select
                      value={form.source}
                      onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium"
                    >
                      <option value="Website">Organic Website</option>
                      <option value="Meta Ads">Meta Ads (Instagram/FB)</option>
                      <option value="Google Ads">Google Search Ads</option>
                      <option value="99acres">99acres Portal</option>
                      <option value="MagicBricks">MagicBricks Portal</option>
                      <option value="WhatsApp">WhatsApp Inbound</option>
                      <option value="Walk-in">Walk-in Sales Gallery</option>
                      <option value="Referral">Client Referral / Partner</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Campaign / Partner Ref Code</label>
                    <input
                      type="text"
                      value={form.campaignDetails}
                      onChange={(e) => setForm({ ...form, campaignDetails: e.target.value })}
                      placeholder="e.g. META_SUMMER_2026 / CP_KAPOOR"
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Temperature Rating */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1">
                    <Flame className="h-4 w-4 text-amber-500" />
                    Lead Rating & Purchase Intent
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Hot', label: 'Hot 🔥', desc: 'High urgency, ready to visit this week' },
                      { id: 'Warm', label: 'Warm ☀️', desc: 'Active buyer, evaluating options' },
                      { id: 'Cold', label: 'Cold ❄️', desc: 'Early research, 3+ months out' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm({ ...form, temperature: item.id as any })}
                        className={`p-3 rounded-xl border text-left transition ${
                          form.temperature === item.id
                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 ring-1 ring-[var(--accent)] font-semibold'
                            : 'border-[var(--border)] hover:bg-[var(--surface-2)]/60'
                        }`}
                      >
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Initial Pipeline Stage</label>
                    <select
                      value={form.stage}
                      onChange={(e) => setForm({ ...form, stage: e.target.value as LeadStage })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm"
                    >
                      <option value="New">New Enquiry</option>
                      <option value="Contacted">Contacted / Validated</option>
                      <option value="Visit">Site Visit Scheduled</option>
                      <option value="Negotiation">Negotiation / Offer</option>
                      <option value="Booked">Booked Unit</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      <UserCheck className="h-4 w-4 text-[var(--accent)]" />
                      Assigned Relationship Manager
                    </label>
                    <select
                      value={form.assignedTo}
                      onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium"
                    >
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.name}>
                          {agent.name} ({agent.team || 'Sales'} • {agent.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NOTES & FIRST ACTION */}
            {activeTab === 'action' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <Calendar className="h-4 w-4 text-[var(--accent)]" />
                  <h4 className="font-semibold text-sm">Enquiry Remarks & Automated Next Action</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1">
                    <FileText className="h-4 w-4 text-[var(--text-muted)]" />
                    Customer Remarks & Special Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. Interested in East facing high floor flat with 2 parking spots. Prefers weekend site visit with family..."
                    className="w-full p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Schedule Next Action Task</label>
                    <select
                      value={form.nextAction}
                      onChange={(e) => setForm({ ...form, nextAction: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm font-medium"
                    >
                      <option value="Schedule Callback">Phone Follow-up Call</option>
                      <option value="Schedule Site Tour">Book Site Visit</option>
                      <option value="Send WhatsApp Brochure">Send Digital Brochure</option>
                      <option value="Send Cost Sheet">Generate Quotation / Price Sheet</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                      Follow-up Date & Time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={form.nextFollowUpDate}
                        onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })}
                        className="w-2/3 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs"
                      />
                      <input
                        type="time"
                        value={form.nextFollowUpTime}
                        onChange={(e) => setForm({ ...form, nextFollowUpTime: e.target.value })}
                        className="w-1/3 px-2 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Automated WhatsApp Welcome Checkbox */}
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="sendWelcomeMsg"
                    checked={form.sendWelcomeMsg}
                    onChange={(e) => setForm({ ...form, sendWelcomeMsg: e.target.checked })}
                    className="mt-1 rounded border-emerald-500 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="sendWelcomeMsg" className="cursor-pointer">
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" /> Trigger Instant WhatsApp Welcome & Brochure
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Automatically dispatches a personalized welcome message with floor plan PDF & location pin to {form.phone || 'the customer'}.
                    </div>
                  </label>
                </div>
              </div>
            )}
          </form>

          {/* Drawer Live Summary Bar */}
          <div className="px-6 py-2.5 bg-[var(--surface-2)]/60 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-foreground truncate">{form.name || 'New Lead Name'}</span>
              <span>•</span>
              <span className="truncate">{form.project}</span>
              <span>•</span>
              <span className="font-semibold text-[var(--accent)]">{formatBudgetDisplay(form.budget)}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded bg-[var(--surface)] border">
              <span>{form.temperature === 'Hot' ? '🔥' : form.temperature === 'Warm' ? '☀️' : '❄️'}</span>
              <span>{form.temperature}</span>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3">
            <div>
              {activeTab !== 'contact' ? (
                <button
                  type="button"
                  onClick={() => {
                    const order: TabType[] = ['contact', 'requirements', 'marketing', 'action'];
                    const idx = order.indexOf(activeTab);
                    if (idx > 0) setActiveTab(order[idx - 1]);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-medium hover:bg-[var(--surface-2)] transition"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--text-muted)] hover:text-foreground hover:bg-[var(--surface-2)] transition"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeTab !== 'action' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'contact' && (!form.name.trim() || !form.phone.trim())) {
                      toast.error('Please enter Name and Phone number before proceeding');
                      return;
                    }
                    const order: TabType[] = ['contact', 'requirements', 'marketing', 'action'];
                    const idx = order.indexOf(activeTab);
                    if (idx < order.length - 1) setActiveTab(order[idx + 1]);
                  }}
                  className="flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--border)] hover:bg-[var(--border)]/50 px-5 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Next Section <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md hover:opacity-95 active:scale-[0.98] transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Lead...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Save & Create Lead</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/**
 * Column Mapper Service
 *
 * Handles fuzzy matching of Excel column headers to CRM Lead fields,
 * and transforms raw row data using a column mapping.
 */

// CRM Lead fields that can be mapped to
export const CRM_FIELDS = [
  { key: 'name', label: 'Name', required: true },
  { key: 'phone', label: 'Phone', required: true },
  { key: 'email', label: 'Email', required: false },
  { key: 'source', label: 'Source', required: false },
  { key: 'stage', label: 'Stage', required: false },
  { key: 'budget', label: 'Budget', required: false },
  { key: 'project', label: 'Project', required: false },
  { key: 'assignedTo', label: 'Assigned To', required: false },
  { key: 'tags', label: 'Tags', required: false },
  { key: 'value', label: 'Value', required: false },
  { key: 'createdAt', label: 'Created Date', required: false },
] as const;

export type CrmFieldKey = (typeof CRM_FIELDS)[number]['key'];

// Known aliases for fuzzy matching
const FIELD_ALIASES: Record<CrmFieldKey, string[]> = {
  name: ['name', 'full name', 'fullname', 'contact name', 'contact person', 'lead name', 'customer name', 'buyer name', 'client name', 'person'],
  phone: ['phone', 'phone number', 'mobile', 'mobile number', 'mobile no', 'mob', 'contact', 'contact number', 'cell', 'cell number', 'tel', 'telephone'],
  email: ['email', 'email id', 'e-mail', 'email address', 'mail', 'emailid'],
  source: ['source', 'lead source', 'channel', 'platform', 'medium', 'ad campaign', 'campaign', 'origin', 'referred by'],
  stage: ['stage', 'status', 'lead status', 'lead stage', 'pipeline stage', 'disposition'],
  budget: ['budget', 'budget range', 'price range', 'expected budget', 'max budget', 'min budget'],
  project: ['project', 'project name', 'property', 'property name', 'site', 'location', 'project interest'],
  assignedTo: ['assigned to', 'assignedto', 'agent', 'salesperson', 'sales person', 'executive', 'team member', 'owner'],
  tags: ['tags', 'label', 'labels', 'category', 'type', 'priority'],
  value: ['value', 'deal value', 'expected value', 'lead value', 'amount'],
  createdAt: ['date', 'created at', 'createdat', 'created date', 'form submitted at', 'submission date', 'enquiry date', 'inquiry date', 'visit date'],
};

/**
 * Normalize a string for comparison: lowercase, trim, remove extra spaces
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[_\-\.]/g, ' ').replace(/\s+/g, ' ');
}

/**
 * Auto-detect column mapping by fuzzy matching Excel headers to CRM fields.
 * Returns a mapping: { "Excel Column Name": "crmFieldKey" | null }
 */
export function autoDetectMapping(headers: string[]): Record<string, string | null> {
  const mapping: Record<string, string | null> = {};
  const usedCrmFields = new Set<string>();

  for (const header of headers) {
    const normalizedHeader = normalize(header);
    let matched = false;

    for (const [fieldKey, aliases] of Object.entries(FIELD_ALIASES)) {
      if (usedCrmFields.has(fieldKey)) continue;

      const isMatch = aliases.some((alias) => {
        const normalizedAlias = normalize(alias);
        return (
          normalizedHeader === normalizedAlias ||
          normalizedHeader.includes(normalizedAlias) ||
          normalizedAlias.includes(normalizedHeader)
        );
      });

      if (isMatch) {
        mapping[header] = fieldKey;
        usedCrmFields.add(fieldKey);
        matched = true;
        break;
      }
    }

    if (!matched) {
      mapping[header] = null; // Will go to customFields
    }
  }

  return mapping;
}

export interface TransformedLead {
  name: string;
  phone: string;
  email?: string | null;
  source?: string;
  stage?: string;
  budget?: number | null;
  project?: string | null;
  assignedTo?: string | null;
  tags?: string[];
  value?: number;
  createdAt?: Date;
  customFields: Record<string, unknown>;
}

export interface TransformResult {
  lead: TransformedLead | null;
  error: string | null;
}

/**
 * Transform a raw Excel row into a structured Lead object using the provided column mapping.
 * Unmapped columns go into customFields.
 */
export function transformRow(
  rawData: Record<string, unknown>,
  columnMapping: Record<string, string | null>
): TransformResult {
  const lead: Partial<TransformedLead> = {};
  const customFields: Record<string, unknown> = {};

  for (const [excelCol, crmField] of Object.entries(columnMapping)) {
    const value = rawData[excelCol];

    if (value === null || value === undefined || value === '') continue;

    if (!crmField) {
      // Unmapped → customFields
      customFields[excelCol] = value;
      continue;
    }

    switch (crmField) {
      case 'name':
        lead.name = String(value).trim();
        break;
      case 'phone':
        lead.phone = String(value).replace(/\D/g, '').trim(); // Strip non-digits
        break;
      case 'email':
        lead.email = String(value).trim();
        break;
      case 'source':
        lead.source = String(value).trim();
        break;
      case 'stage':
        lead.stage = String(value).trim();
        break;
      case 'budget':
        lead.budget = parseFloat(String(value).replace(/[^0-9.]/g, '')) || null;
        break;
      case 'project':
        lead.project = String(value).trim();
        break;
      case 'assignedTo':
        lead.assignedTo = String(value).trim();
        break;
      case 'tags':
        // Try to split by comma if it's a string
        if (typeof value === 'string') {
          lead.tags = value.split(',').map((t) => t.trim()).filter(Boolean);
        } else {
          lead.tags = [String(value)];
        }
        break;
      case 'value':
        lead.value = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
        break;
      case 'createdAt':
        const parsed = new Date(value as string);
        if (!isNaN(parsed.getTime())) {
          lead.createdAt = parsed;
        }
        break;
    }
  }

  // Also capture any Excel columns that weren't in the mapping at all
  for (const [key, val] of Object.entries(rawData)) {
    if (!(key in columnMapping) && val !== null && val !== undefined && val !== '') {
      customFields[key] = val;
    }
  }

  lead.customFields = Object.keys(customFields).length > 0 ? customFields : {};

  // Validation: name and phone are required
  if (!lead.name) {
    return { lead: null, error: 'Missing required field: name' };
  }
  if (!lead.phone) {
    return { lead: null, error: 'Missing required field: phone' };
  }

  return {
    lead: lead as TransformedLead,
    error: null,
  };
}

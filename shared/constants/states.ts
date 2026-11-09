export interface StateInfo {
  name: string;
  region: 'South' | 'North' | 'West' | 'East' | 'Central' | 'North-East' | 'Union Territory';
}

export const ALL_INDIAN_STATES: StateInfo[] = [
  // South India
  { name: 'Andhra Pradesh', region: 'South' },
  { name: 'Karnataka', region: 'South' },
  { name: 'Kerala', region: 'South' },
  { name: 'Tamil Nadu', region: 'South' },
  { name: 'Telangana', region: 'South' },

  // North India
  { name: 'Delhi', region: 'North' },
  { name: 'Haryana', region: 'North' },
  { name: 'Himachal Pradesh', region: 'North' },
  { name: 'Jammu and Kashmir', region: 'North' },
  { name: 'Ladakh', region: 'North' },
  { name: 'Punjab', region: 'North' },
  { name: 'Rajasthan', region: 'North' },
  { name: 'Uttar Pradesh', region: 'North' },
  { name: 'Uttarakhand', region: 'North' },

  // West India
  { name: 'Goa', region: 'West' },
  { name: 'Gujarat', region: 'West' },
  { name: 'Maharashtra', region: 'West' },

  // Central India
  { name: 'Chhattisgarh', region: 'Central' },
  { name: 'Madhya Pradesh', region: 'Central' },

  // East India
  { name: 'Bihar', region: 'East' },
  { name: 'Jharkhand', region: 'East' },
  { name: 'Odisha', region: 'East' },
  { name: 'West Bengal', region: 'East' },

  // North-East India
  { name: 'Arunachal Pradesh', region: 'North-East' },
  { name: 'Assam', region: 'North-East' },
  { name: 'Manipur', region: 'North-East' },
  { name: 'Meghalaya', region: 'North-East' },
  { name: 'Mizoram', region: 'North-East' },
  { name: 'Nagaland', region: 'North-East' },
  { name: 'Sikkim', region: 'North-East' },
  { name: 'Tripura', region: 'North-East' },

  // Union Territories
  { name: 'Andaman and Nicobar Islands', region: 'Union Territory' },
  { name: 'Chandigarh', region: 'Union Territory' },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', region: 'Union Territory' },
  { name: 'Lakshadweep', region: 'Union Territory' },
  { name: 'Puducherry', region: 'Union Territory' },
];

export const STATE_NAMES = ALL_INDIAN_STATES.map((s) => s.name).sort();

export const STATE_SELECT_OPTIONS = [
  { value: 'All India', label: 'All India (Central Schemes)' },
  ...STATE_NAMES.map((name) => ({ value: name, label: name })),
];

export const CATALOG_STATE_FILTER_OPTIONS = [
  { value: 'ALL', label: 'All Regions / States' },
  { value: 'All India', label: 'All-India National Schemes' },
  ...STATE_NAMES.map((name) => ({ value: name, label: name })),
];


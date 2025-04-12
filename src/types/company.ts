export interface Company {
  id: string;
  name: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  employees: Employee[];
  establishments: Establishment[];
  parcels?: Parcel[];
  subscription?: Subscription;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
}

export interface Establishment {
  id: string;
  name: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  employees: Employee[];
  parcels?: Parcel[];
}

export interface Parcel {
  id: string | number;
  name: string;
}

export interface Subscription {
  id: string | number;
  status: string;
  plan: Plan;
  trial_end?: string;
  current_period_end: string;
  used_productions?: number;
  scan_count?: number;
  used_storage_gb?: number;
}

export interface Plan {
  id: string | number;
  name: string;
  interval: string;
  price: number;
  features: {
    max_establishments: number;
    max_parcels: number;
    max_productions_per_year: number;
    monthly_scan_limit: number;
    storage_limit_gb: number;
    [key: string]: any;
  };
}

// export { Company, Employee, Establishment };

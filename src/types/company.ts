interface Company {
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
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
}

interface Establishment {
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
}

export type { Company, Employee, Establishment };
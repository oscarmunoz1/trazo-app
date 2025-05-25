interface Route {
  id: string;
  name: string;
  path: string;
  category?: string;
  component?: React.ComponentType<any>;
  collapse?: boolean;
  establishmentId?: string;
  authIcon?: JSX.Element;
  icon?: JSX.Element;
  layout: string;
  isDashboard?: boolean;
  regex: RegExp;
  isCertifications?: boolean;
  isCommercial?: boolean;
  isCarbonDashboard?: boolean;
  isCompanySettings?: boolean;
  items?: Route[];
  secondaryNavbar?: boolean | undefined;
  isHome?: boolean;
}

export type { Route };

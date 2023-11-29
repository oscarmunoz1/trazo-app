import { ComponentWithAs, IconProps } from "@chakra-ui/react";

interface Route {
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
    items: Route[];
    secondaryNavbar?: boolean | undefined;
    isHome?: boolean;
}

export type { Route };

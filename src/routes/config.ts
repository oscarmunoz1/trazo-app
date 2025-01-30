import SignInConsumer from 'views/Authentication/SignIn/SignInConsumer';
import VerifyEmailConsumer from 'views/Authentication/SignUp/VerifyEmailConsumer';
import { CONSUMER, PRODUCER, SUPERUSER } from '../config';
import { ComponentType } from 'react';
import SignUpConsumer from 'views/Authentication/SignUp/SignUpConsumer';
import SignInApp from 'views/Authentication/SignIn/SignInBasic';
import SignUp from 'views/Authentication/SignUp/SignUpBasic';
import VerifyEmail from 'views/Authentication/SignUp/VerifyEmail';

type RouteConfig = {
  auth: {
    path: string;
    signin: ComponentType;
    signup: ComponentType;
    verifyEmail: ComponentType;
  };
  defaultRedirect: string;
  protected: {
    path: string;
    roles: number[];
    adminRoles?: number[];
    requiresCompanyAdmin?: boolean;
  };
};

type AppConfig = {
  producer: RouteConfig;
  consumer: RouteConfig;
};

export const routeConfig: AppConfig = {
  producer: {
    auth: {
      path: '/auth',
      signin: SignInApp,
      signup: SignUp,
      verifyEmail: VerifyEmail
    },
    defaultRedirect: '/admin/dashboard',
    protected: {
      path: '/admin/dashboard',
      roles: [PRODUCER, SUPERUSER],
      adminRoles: [PRODUCER, SUPERUSER],
      requiresCompanyAdmin: true
    }
  },
  consumer: {
    auth: {
      path: '/auth',
      signin: SignInConsumer,
      signup: SignUpConsumer,
      verifyEmail: VerifyEmailConsumer
    },
    defaultRedirect: '/admin/dashboard/scans',
    protected: {
      path: '/admin/dashboard',
      roles: [CONSUMER, SUPERUSER, PRODUCER]
    }
  }
};

import React from 'react';
import LoginCard from '../organisms/Login';
import { Footer } from '../../layouts/Footer';
import Header from '../../layouts/Header';

export interface LoginTemplateProps {
  email: string;
  password: string;
  error?: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

const LoginTemplate: React.FC<LoginTemplateProps> = (props) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <Header />
    <LoginCard {...props}>
      {props.children}
    </LoginCard>
    <Footer />
  </div>
);

export default LoginTemplate;
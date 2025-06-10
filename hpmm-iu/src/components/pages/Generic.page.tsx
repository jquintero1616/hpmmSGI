// src/components/GenericPage.tsx
import React from "react";
import GenericTemplate from "../templates/Generic.template";

interface GenericPageProps {
  children: React.ReactNode;
  title?: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ children }) => (
  <div className="flex flex-col h-full w-full">
    <div className="flex-1 flex flex-col w-full">
      <main className="flex-1 p-6 overflow-auto bg-gray-50 w-full">
        <div className="w-full mx-auto">
          <GenericTemplate>{children}</GenericTemplate>
        </div>
      </main>
    </div>
  </div>
);

export default GenericPage;

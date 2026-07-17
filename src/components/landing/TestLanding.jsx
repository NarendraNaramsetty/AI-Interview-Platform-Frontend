// Simple test component to verify landing page components work
import React from 'react';

export default function TestLanding() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">
        ✅ Landing Components Test Page
      </h1>
      <p className="mt-4 text-gray-600">
        If you can see this message, the basic components are working.
      </p>
      <div className="mt-4 p-4 bg-green-100 rounded-lg">
        <p className="text-sm">
          This means the error is likely in the Hero or FeatureCard components.
        </p>
      </div>
    </div>
  );
}
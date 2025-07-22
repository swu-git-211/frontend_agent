// 🎯 TimelineProcess.tsx
'use client'
import { useState, useEffect } from 'react';
import classNames from 'classnames';

const stages = [
  'Received Alert',
  'TypeAgent',
  'Specified Type',
  'Threat Analysis',
  'Analyze Context',
  'Summary',
  'Recommendation'
];

export default function TimelineProcess() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stages.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[800px] items-center justify-between px-6 py-6 rounded-xl bg-gradient-to-r from-slate-800 to-purple-900 text-white shadow-lg border border-purple-600">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex flex-col items-center relative flex-1 min-w-[100px]">
            {/* Dot */}
            <div
              className={classNames(
                'w-5 h-5 rounded-full z-10 border-4 transition-all duration-500 shadow-md bg-opacity-90',
                idx <= currentStep ? 'bg-purple-500 border-purple-300' : 'bg-gray-700 border-gray-500'
              )}
            ></div>
            {/* Label */}
            <span className={classNames(
              'text-sm mt-2 text-center font-medium transition-opacity duration-700 whitespace-nowrap',
              idx <= currentStep ? 'text-purple-300 opacity-100' : 'text-gray-400 opacity-100'
            )}>{stage}</span>

            {/* Line after each dot except the last one */}
            {idx < stages.length - 1 && (
              <div className="absolute top-2.5 left-1/2 w-full h-1 z-0 overflow-visible -translate-x-0.5">
                <div className="w-full h-full bg-gray-700 rounded-full"></div>
                <div
                  className={classNames(
                    'absolute top-0 left-0 h-full bg-yellow-400 rounded-full transition-all duration-700 ease-linear origin-left',
                    {
                      'w-full': idx < currentStep,
                      'w-0': idx >= currentStep,
                    }
                  )}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

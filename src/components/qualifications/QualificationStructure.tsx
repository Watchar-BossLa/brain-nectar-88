
import React from 'react';

interface Module {
  code: string;
  name: string;
  status: string;
}

interface LevelModule {
  level: string;
  modules: Module[];
}

interface QualificationStructureProps {
  modules: LevelModule[];
  getStatusBadge: (status: string) => React.ReactNode;
}

export const QualificationStructure: React.FC<QualificationStructureProps> = ({ 
  modules,
  getStatusBadge
}) => {
  return (
    <>
      {modules.map((level, index) => (
        <div key={index} className="mb-6 last:mb-0">
          <h3 className="font-medium mb-3">{level.level}</h3>
          <div className="space-y-2">
            {level.modules.map((module, moduleIndex) => (
              <div 
                key={moduleIndex} 
                className="flex items-center justify-between p-3 border border-border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="font-medium min-w-[40px]">{module.code}</div>
                  <div>{module.name}</div>
                </div>
                {getStatusBadge(module.status)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

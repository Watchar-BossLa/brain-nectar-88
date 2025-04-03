import React, { useState } from 'react';
import { AccountSectionProps } from '@/types/components';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from 'lucide-react';

const AccountSection: React.FC<AccountSectionProps> = ({
  title,
  components,
  updateComponent,
  componentType,
  totalValue,
}) => {
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState(0);

  const handleAddComponent = () => {
    if (newName && newValue) {
      const id = `${componentType.slice(0, -1)}-${Date.now()}`;
      updateComponent(componentType, id, newValue, newName);
      setNewName('');
      setNewValue(0);
    }
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="font-medium mb-3 flex justify-between">
        <span>{title}</span>
        <span className="text-primary">${totalValue.toLocaleString()}</span>
      </h3>
      
      {components.map(component => (
        <div key={component.id} className="flex items-center gap-2 mb-2">
          <Input 
            value={component.name}
            onChange={(e) => updateComponent(componentType, component.id, component.value, e.target.value)}
            className="flex-1"
          />
          <Input 
            type="number"
            value={component.value}
            onChange={(e) => updateComponent(componentType, component.id, parseFloat(e.target.value) || 0)}
            className="w-24"
          />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => updateComponent(componentType, component.id, 0, '', true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <div className="flex items-center gap-2 mt-4">
        <Input 
          placeholder={`New ${title.toLowerCase()} name`}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1"
        />
        <Input 
          type="number"
          placeholder="Value"
          value={newValue || ''}
          onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
          className="w-24"
        />
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleAddComponent}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AccountSection;

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Trash2, EyeIcon, EyeOffIcon } from 'lucide-react';

const FunctionInput = ({ func, updateFunction, removeFunction, canRemove }) => {
  const handleExpressionChange = (e) => {
    updateFunction(func.id, { expression: e.target.value });
  };

  const handleColorChange = (e) => {
    updateFunction(func.id, { color: e.target.value });
  };

  const handleVisibilityToggle = () => {
    updateFunction(func.id, { visible: !func.visible });
  };

  return (
    <div className="flex items-center space-x-2 mb-2">
      <div className="flex-1">
        <div className="relative">
          <Input
            value={func.expression}
            onChange={handleExpressionChange}
            placeholder="Enter a function (e.g., x^2)"
            className={func.error ? 'border-red-500' : ''}
          />
          {func.error && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}
        </div>
        {func.error && (
          <p className="text-xs text-red-500 mt-1">{func.error}</p>
        )}
      </div>
      
      <Input
        type="color"
        value={func.color}
        onChange={handleColorChange}
        className="w-10 h-10 p-1 cursor-pointer"
      />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleVisibilityToggle}
        title={func.visible ? 'Hide function' : 'Show function'}
      >
        {func.visible ? (
          <EyeIcon className="h-4 w-4" />
        ) : (
          <EyeOffIcon className="h-4 w-4" />
        )}
      </Button>
      
      {canRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFunction(func.id)}
          title="Remove function"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FunctionInput;

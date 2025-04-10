import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PieChart = ({ data, config }) => {
  // For pie charts, we need a category (name) and a value
  const prepareData = () => {
    if (!data || data.length === 0) return [];
    
    // If xAxis and yAxis are specified, use them
    if (config.xAxis && config.yAxis) {
      return data.map(item => ({
        name: item[config.xAxis],
        value: Number(item[config.yAxis])
      }));
    }
    
    // Otherwise, try to find a suitable pair of columns
    const keys = Object.keys(data[0]);
    const nameKey = keys.find(key => typeof data[0][key] === 'string');
    const valueKey = keys.find(key => typeof data[0][key] === 'number');
    
    if (nameKey && valueKey) {
      return data.map(item => ({
        name: item[nameKey],
        value: Number(item[valueKey])
      }));
    }
    
    return [];
  };
  
  const pieData = prepareData();
  
  // Generate colors for pie slices
  const getColors = () => {
    const baseColor = config.color || '#3b82f6';
    const colors = [
      baseColor,
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
    ];
    
    // For more slices, generate variations of the base color
    if (pieData.length > colors.length) {
      const hsl = hexToHSL(baseColor);
      for (let i = colors.length; i < pieData.length; i++) {
        const h = (hsl.h + (i * 30)) % 360;
        colors.push(hslToHex(h, hsl.s, hsl.l));
      }
    }
    
    return colors;
  };
  
  // Helper function to convert hex to HSL
  const hexToHSL = (hex) => {
    // Remove the # if present
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find the min and max values
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    
    // Calculate HSL values
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = h * 60;
    }
    
    return { h, s, l };
  };
  
  // Helper function to convert HSL to hex
  const hslToHex = (h, s, l) => {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, (h / 360) + 1/3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360) - 1/3);
    }
    
    // Convert to hex
    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  
  const colors = getColors();
  
  if (pieData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select data to visualize</p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill={config.color}
          dataKey="value"
          animationDuration={config.animation ? 1500 : 0}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => value.toLocaleString()} />
        {config.showLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;

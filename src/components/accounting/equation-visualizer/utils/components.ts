
import { AccountComponent } from '../types';

export interface ComponentManager {
  updateComponent: (
    type: 'assets' | 'liabilities' | 'equity',
    id: string,
    value: number,
    components: {
      assetComponents: AccountComponent[];
      liabilityComponents: AccountComponent[];
      equityComponents: AccountComponent[];
    },
    name?: string,
    remove?: boolean
  ) => {
    assetComponents: AccountComponent[];
    liabilityComponents: AccountComponent[];
    equityComponents: AccountComponent[];
  };
}

export const componentManager: ComponentManager = {
  updateComponent: (type, id, value, components, name, remove = false) => {
    const { assetComponents, liabilityComponents, equityComponents } = components;
    let newAssetComponents = [...assetComponents];
    let newLiabilityComponents = [...liabilityComponents];
    let newEquityComponents = [...equityComponents];

    if (type === 'assets') {
      if (remove) {
        newAssetComponents = assetComponents.filter(comp => comp.id !== id);
      } else if (name !== undefined) {
        newAssetComponents = assetComponents.map(comp => 
          comp.id === id ? { ...comp, value, name } : comp
        );
      } else {
        const exists = assetComponents.some(comp => comp.id === id);
        if (exists) {
          newAssetComponents = assetComponents.map(comp => 
            comp.id === id ? { ...comp, value } : comp
          );
        } else {
          newAssetComponents = [
            ...assetComponents, 
            { id, name: `Asset ${assetComponents.length + 1}`, value }
          ];
        }
      }
    } else if (type === 'liabilities') {
      if (remove) {
        newLiabilityComponents = liabilityComponents.filter(comp => comp.id !== id);
      } else if (name !== undefined) {
        newLiabilityComponents = liabilityComponents.map(comp => 
          comp.id === id ? { ...comp, value, name } : comp
        );
      } else {
        const exists = liabilityComponents.some(comp => comp.id === id);
        if (exists) {
          newLiabilityComponents = liabilityComponents.map(comp => 
            comp.id === id ? { ...comp, value } : comp
          );
        } else {
          newLiabilityComponents = [
            ...liabilityComponents, 
            { id, name: `Liability ${liabilityComponents.length + 1}`, value }
          ];
        }
      }
    } else { // equity
      if (remove) {
        newEquityComponents = equityComponents.filter(comp => comp.id !== id);
      } else if (name !== undefined) {
        newEquityComponents = equityComponents.map(comp => 
          comp.id === id ? { ...comp, value, name } : comp
        );
      } else {
        const exists = equityComponents.some(comp => comp.id === id);
        if (exists) {
          newEquityComponents = equityComponents.map(comp => 
            comp.id === id ? { ...comp, value } : comp
          );
        } else {
          newEquityComponents = [
            ...equityComponents, 
            { id, name: `Equity ${equityComponents.length + 1}`, value }
          ];
        }
      }
    }

    return {
      assetComponents: newAssetComponents,
      liabilityComponents: newLiabilityComponents,
      equityComponents: newEquityComponents
    };
  }
};

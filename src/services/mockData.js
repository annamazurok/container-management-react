// Mock data for testing without backend API
// This file contains one sample entry for each entity

export const mockContainerTypes = [
  {
    id: 1,
    name: "Barrel",
    Name: "Barrel",
    volume: 200,
    unitId: 1,
    productTypeIds: [1],
  },
];

export const mockProductTypes = [
  {
    id: 1,
    title: "Liquid",
    Title: "Liquid",
  },
];

export const mockUnits = [
  {
    id: 1,
    title: "Liters",
    Title: "Liters",
  },
];

export const mockProducts = [
  {
    id: 1,
    name: "Red Wine",
    Name: "Red Wine",
    typeId: 1,
    description: "Premium red wine from local vineyard",
    Description: "Premium red wine from local vineyard",
    produced: "2024-01-15T00:00:00Z",
    expirationDate: "2026-01-15T00:00:00Z",
  },
];

export const mockContainers = [
  {
    id: 1,
    code: "CONT-001",
    name: "Wine Barrel Alpha",
    Name: "Wine Barrel Alpha",
    typeId: 1,
    productId: 1,
    quantity: 180,
    unitId: 1,
    status: "Active",
    notes: "Primary storage barrel for red wine aging",
  },
];

export const mockContainerHistory = [
  {
    id: 1,
    containerId: 1,
    productId: 1,
    actionType: "Fill",
    actionDate: "2024-02-01T10:30:00Z",
    notes: "Filled with 180L of red wine",
    userId: 1,
    createdAt: "2024-02-01T10:30:00Z",
    updatedAt: "2024-02-01T10:30:00Z",
  },
  {
    id: 2,
    containerId: 1,
    productId: 1,
    actionType: "Check",
    actionDate: "2024-03-15T14:20:00Z",
    notes: "Quality check - wine aging well",
    userId: 1,
    createdAt: "2024-03-15T14:20:00Z",
    updatedAt: "2024-03-15T14:20:00Z",
  },
];

// Helper function to simulate API delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Container Types
  getAllContainerTypes: async () => {
    await delay();
    return mockContainerTypes;
  },
  createContainerType: async (data) => {
    await delay();
    const newType = {
      id: Date.now(),
      name: data.name,
      Name: data.name,
      volume: data.volume,
      unitId: data.unitId,
      productTypeIds: data.productTypeIds,
    };
    mockContainerTypes.push(newType);
    return newType;
  },
  updateContainerType: async (data) => {
    await delay();
    const index = mockContainerTypes.findIndex(t => t.id === data.id);
    if (index !== -1) {
      mockContainerTypes[index] = { ...mockContainerTypes[index], ...data, Name: data.name };
    }
    return mockContainerTypes[index];
  },
  deleteContainerType: async (id) => {
    await delay();
    const index = mockContainerTypes.findIndex(t => t.id === id);
    if (index !== -1) {
      mockContainerTypes.splice(index, 1);
    }
    return { success: true };
  },

  // Product Types
  getAllProductTypes: async () => {
    await delay();
    return mockProductTypes;
  },
  createProductType: async (data) => {
    await delay();
    const newType = {
      id: Date.now(),
      title: data.title,
      Title: data.title,
    };
    mockProductTypes.push(newType);
    return newType;
  },
  updateProductType: async (data) => {
    await delay();
    const index = mockProductTypes.findIndex(t => t.id === data.id);
    if (index !== -1) {
      mockProductTypes[index] = { ...mockProductTypes[index], ...data, Title: data.title };
    }
    return mockProductTypes[index];
  },
  deleteProductType: async (id) => {
    await delay();
    const index = mockProductTypes.findIndex(t => t.id === id);
    if (index !== -1) {
      mockProductTypes.splice(index, 1);
    }
    return { success: true };
  },

  // Units
  getAllUnits: async () => {
    await delay();
    return mockUnits;
  },

  // Products
  getAllProducts: async () => {
    await delay();
    return mockProducts;
  },
  getProductById: async (id) => {
    await delay();
    return mockProducts.find(p => p.id === parseInt(id));
  },

  // Containers
  getAllContainers: async () => {
    await delay();
    return mockContainers;
  },
  getContainerById: async (id) => {
    await delay();
    return mockContainers.find(c => c.id === parseInt(id));
  },
  deleteContainer: async (id) => {
    await delay();
    const index = mockContainers.findIndex(c => c.id === id);
    if (index !== -1) {
      mockContainers.splice(index, 1);
    }
    return { success: true };
  },

  // Container History
  getContainerHistoryByContainerId: async (containerId) => {
    await delay();
    return mockContainerHistory.filter(h => h.containerId === parseInt(containerId));
  },
};

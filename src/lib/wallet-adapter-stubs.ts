
// Stub implementations for wallet adapters
// These interfaces satisfy the TypeScript requirements without needing the actual implementations

export class BackpackWalletAdapter {
  name = "Backpack";
  url = "https://backpack.app";
  icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=";
  readyState = "Installed";
  connecting = false;
  connected = false;
  publicKey = null;
  
  connect() {
    return Promise.resolve();
  }
  
  disconnect() {
    return Promise.resolve();
  }
  
  sendTransaction() {
    return Promise.resolve("stub_transaction_signature");
  }
}

export class BraveWalletAdapter {
  name = "Brave";
  url = "https://brave.com/wallet";
  icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=";
  readyState = "Installed";
  connecting = false;
  connected = false;
  publicKey = null;
  
  connect() {
    return Promise.resolve();
  }
  
  disconnect() {
    return Promise.resolve();
  }
  
  sendTransaction() {
    return Promise.resolve("stub_transaction_signature");
  }
}

export class CoinbaseWalletAdapter {
  name = "Coinbase";
  url = "https://www.coinbase.com/wallet";
  icon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=";
  readyState = "Installed";
  connecting = false;
  connected = false;
  publicKey = null;
  
  connect() {
    return Promise.resolve();
  }
  
  disconnect() {
    return Promise.resolve();
  }
  
  sendTransaction() {
    return Promise.resolve("stub_transaction_signature");
  }
}

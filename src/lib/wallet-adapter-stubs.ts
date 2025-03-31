
// Mock wallet adapter implementations

export class BackpackWalletAdapter {
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  get publicKey() { return null; }
}

export class BraveWalletAdapter {
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  get publicKey() { return null; }
}

export class CoinbaseWalletAdapter {
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  get publicKey() { return null; }
}

export class PhantomWalletAdapter {
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  get publicKey() { return null; }
}

export class SolflareWalletAdapter {
  connect() { return Promise.resolve(); }
  disconnect() { return Promise.resolve(); }
  get publicKey() { return null; }
}

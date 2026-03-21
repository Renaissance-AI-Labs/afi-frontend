// src/services/contracts.js
import { walletState } from './wallet';

export const CONTRACT_ADDRESSES = {
  USDT: {
    testnet: '0xE593d2fB93cfe3c2a7b56F6ed7bE6400b75e3e10',
    mainnet: '0x55d398326f99059fF775485246999027B3197955',
  },
  Router: {
    testnet: '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
    mainnet: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
  },
  Referral: {
    testnet: '0x54fd2e30F1df426F1555E83bb7c2bc15743C6667',
    mainnet: '', // To be filled later
  },
  node: {
    testnet: '0xd10f6abA776974D3aA107838802894e0Fb113424',
    mainnet: '', // To be filled later
  },
  NodePool: {
    testnet: '0x13ccDdd74b3D29D6Fe07391885d465d380942BF6',
    mainnet: '', // To be filled later
  }
};

export const getContractAddress = (name) => {
  const network = import.meta.env.VITE_NETWORK || 'testnet';
  return CONTRACT_ADDRESSES[name]?.[network] || '';
};

/**
 * Initializes all contract instances.
 * Cleaned up for new project structure.
 */
export const initializeContracts = async () => {
  if (!walletState.isConnected || !walletState.signer) {
    return;
  }
  console.log("Contracts initialization skipped (Cleaned).");
  walletState.contractsInitialized = true;
};

export const resetContracts = () => {
  console.log("Contracts reset.");
};

// Placeholder for referrer check to prevent wallet.js errors
export const checkIfUserHasReferrer = async () => {
  return true; // Default to true or false depending on desired default behavior
};

// Exporting other potential placeholders if wallet.js calls them directly, 
// though wallet.js mainly calls initializeContracts and checkIfUserHasReferrer in the connect flow.

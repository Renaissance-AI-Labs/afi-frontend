// src/services/contracts.js
import { APP_ENV } from './environment';
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
    mainnet: '0x8b81fF0FeFa6Cd889ab7942eeeae6C8ea66d061F',
  },
  node: {
    testnet: '0xd10f6abA776974D3aA107838802894e0Fb113424',
    mainnet: '0x54fd2e30F1df426F1555E83bb7c2bc15743C6667',
  },
  NodePool: {
    testnet: '0x13ccDdd74b3D29D6Fe07391885d465d380942BF6',
    mainnet: '0xd10f6abA776974D3aA107838802894e0Fb113424',
  },
  A5Pool: {
    testnet: '0x8e46eFEd268aEEA9F268339601b51BaC18B6c31A',
    mainnet: '',
  },
  A6Pool: {
    testnet: '0x56f116510d1F48dD275804163eAE20646da3bAe8',
    mainnet: '',
  },
  A7Pool: {
    testnet: '0xDed835BCc0c81eeb729BAD0885d6d5F5a18d69f9',
    mainnet: '',
  },
  Staking: {
    testnet: '0xf118cEE105FEb74aB34fbC1B5b00A0D6Dce74C41',
    mainnet: '',
  },
  AFI: {
    testnet: '0x62726C353d45843185EbB8943379B093e6fea7F4',
    mainnet: '',
  },
  AFI_USDT_LP: {
    testnet: '0x64a8B0F8b3A3448Dc77E81C2331b49207B0d84d5',
    mainnet: '',
  },
  Stock: {
    testnet: '0x2f34aEEEA3D0fe9dF68101b52ee24eFBc5B45544',
    mainnet: '',
  },
  StakingView: {
    testnet: '0x0941890665bC76C4dF1D83cdf49cC2294359BdE8', 
    mainnet: '',
  }
};

export const getContractAddress = (name) => {
  const network = APP_ENV === 'PROD' ? 'mainnet' : 'testnet';
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

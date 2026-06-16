// src/services/environment.js

/**
 * Determines the application's current running environment.
 * Priority:
 *   1. VITE_APP_ENV (explicit override, e.g. 'PROD' / 'test')
 *   2. VITE_VERCEL_ENV (Vercel-provided: 'production' / 'preview')
 *   3. Fallback: 'PROD'
 */
const getAppEnv = () => {
  const appEnv = import.meta.env.VITE_APP_ENV;
  if (appEnv === 'PROD' || appEnv === 'test') {
    return appEnv;
  }
  const vercelEnv = import.meta.env.VITE_VERCEL_ENV;
  if (vercelEnv === 'production') {
    return 'PROD';
  }
  if (vercelEnv === 'preview') {
    return 'test';
  }
  return 'test';
};

export const APP_ENV = getAppEnv();
export const IS_PROD = APP_ENV === 'PROD';

/**
 * Returns the public RPC endpoint that matches the configured APP_ENV.
 * Used as a read-only fallback when the user's wallet provider is unavailable.
 */
export const getDefaultRpcUrl = () =>
  IS_PROD ? 'https://bsc-rpc.publicnode.com' : 'https://bsc-testnet-rpc.publicnode.com';

/**
 * Claimable order actions
 * When disabled, claimable order redeem/compound buttons keep the current
 * behavior: clickable, but only show an unavailable toast.
 */
export const ENABLE_CLAIMABLE_ORDER_ACTIONS_TEST = true;
export const ENABLE_CLAIMABLE_ORDER_ACTIONS_PROD = true;
export const ENABLE_CLAIMABLE_ORDER_ACTIONS = IS_PROD
  ? ENABLE_CLAIMABLE_ORDER_ACTIONS_PROD
  : ENABLE_CLAIMABLE_ORDER_ACTIONS_TEST;

/**
 * Global Dashboard Whitelist
 * Addresses that can see all global data on the homepage.
 */
export const GLOBAL_DASHBOARD_WHITELIST = [
  // Add whitelisted addresses here
  '0xdd8c7d63fa18faefba74be22e69cfa43c7bbe6d6',
  '0x9B651D652B747ba7821f27B92Dd65c68b9dd30C8',
  '0x56063c541a05f320519e7af9ac5d43becb2ea699',
  '0x502b565F317E26376c0B63369BfDee262BC75D7D'
].map(addr => addr.toLowerCase());

/**
 * Disable console logs in production
 */
export const DISABLE_CONSOLE_IN_PROD = true;

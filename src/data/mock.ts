import type { BankAccount, Customer, Mandate, PaymentPlan, Payment, Wallet, LedgerEntry, Payout, CryptoWallet } from '@/types';

export const mockBankAccounts: BankAccount[] = [
  { id: '1', business_id: 'b1', iban: 'FR76 3000 6000 0112 3456 7890 189', bank_name: 'Qonto', is_primary: true, is_verified: true, status: 'verified', created_at: '2024-01-15' },
  { id: '2', business_id: 'b1', iban: 'DE89 3704 0044 0532 0130 00', bank_name: 'N26', is_primary: false, is_verified: true, status: 'verified', created_at: '2024-02-20' },
  { id: '3', business_id: 'b1', iban: 'GB29 NWBK 6016 1331 9268 19', bank_name: 'Wise', is_primary: false, is_verified: false, status: 'pending', created_at: '2024-03-01' },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', business_id: 'b1', name: 'Marie Dupont', email: 'marie@example.com', iban: 'FR76 1234 5678 9012 3456 7890 123', created_at: '2024-01-20' },
  { id: 'c2', business_id: 'b1', name: 'Hans Mueller', email: 'hans@example.com', iban: 'DE89 3704 0044 0532 0130 00', created_at: '2024-02-10' },
  { id: 'c3', business_id: 'b1', name: 'Sofia Garcia', email: 'sofia@example.com', iban: 'ES91 2100 0418 4502 0005 1332', created_at: '2024-02-28' },
  { id: 'c4', business_id: 'b1', name: 'Luca Rossi', email: 'luca@example.com', iban: 'IT60 X054 2811 1010 0000 0123 456', created_at: '2024-03-05' },
];

export const mockMandates: Mandate[] = [
  { id: 'm1', customer_id: 'c1', status: 'active', gocardless_id: 'MD000123', created_at: '2024-01-22' },
  { id: 'm2', customer_id: 'c2', status: 'active', gocardless_id: 'MD000124', created_at: '2024-02-12' },
  { id: 'm3', customer_id: 'c3', status: 'pending', gocardless_id: 'MD000125', created_at: '2024-03-01' },
  { id: 'm4', customer_id: 'c4', status: 'active', gocardless_id: 'MD000126', created_at: '2024-03-07' },
];

export const mockPaymentPlans: PaymentPlan[] = [
  { id: 'pp1', customer_id: 'c1', mandate_id: 'm1', amount: 500, currency: 'EUR', frequency: 'monthly', start_date: '2024-02-01', status: 'active', next_payment_date: '2024-04-01' },
  { id: 'pp2', customer_id: 'c2', mandate_id: 'm2', amount: 1200, currency: 'EUR', frequency: 'monthly', start_date: '2024-03-01', status: 'active', next_payment_date: '2024-04-01' },
  { id: 'pp3', customer_id: 'c4', mandate_id: 'm4', amount: 250, currency: 'EUR', frequency: 'weekly', start_date: '2024-03-10', status: 'active', next_payment_date: '2024-03-24' },
];

export const mockPayments: Payment[] = [
  { id: 'p1', plan_id: 'pp1', amount: 500, currency: 'EUR', status: 'confirmed', created_at: '2024-02-01' },
  { id: 'p2', plan_id: 'pp1', amount: 500, currency: 'EUR', status: 'confirmed', created_at: '2024-03-01' },
  { id: 'p3', plan_id: 'pp2', amount: 1200, currency: 'EUR', status: 'confirmed', created_at: '2024-03-01' },
  { id: 'p4', plan_id: 'pp3', amount: 250, currency: 'EUR', status: 'pending', created_at: '2024-03-10' },
  { id: 'p5', plan_id: 'pp3', amount: 250, currency: 'EUR', status: 'failed', created_at: '2024-03-17' },
];

export const mockWallet: Wallet = {
  id: 'w1', user_id: 'u1', available_balance: 18450.00, pending_balance: 1450.00, reserved_balance: 500.00, currency: 'EUR',
};

export const mockLedger: LedgerEntry[] = [
  { id: 'l1', wallet_id: 'w1', type: 'credit', amount: 500, status: 'confirmed', source: 'gocardless', reference_id: 'p1', description: 'SEPA collection – Marie Dupont', created_at: '2024-02-01' },
  { id: 'l2', wallet_id: 'w1', type: 'credit', amount: 500, status: 'confirmed', source: 'gocardless', reference_id: 'p2', description: 'SEPA collection – Marie Dupont', created_at: '2024-03-01' },
  { id: 'l3', wallet_id: 'w1', type: 'credit', amount: 1200, status: 'confirmed', source: 'gocardless', reference_id: 'p3', description: 'SEPA collection – Hans Mueller', created_at: '2024-03-01' },
  { id: 'l4', wallet_id: 'w1', type: 'debit', amount: 2000, status: 'confirmed', source: 'crypto', reference_id: 'po1', description: 'Crypto payout – 0xABC...DEF', created_at: '2024-03-05' },
  { id: 'l5', wallet_id: 'w1', type: 'credit', amount: 250, status: 'pending', source: 'gocardless', reference_id: 'p4', description: 'SEPA collection – Luca Rossi', created_at: '2024-03-10' },
  { id: 'l6', wallet_id: 'w1', type: 'debit', amount: 1500, status: 'confirmed', source: 'iban_payout', reference_id: 'po2', description: 'IBAN payout – DE89 ****0130 00', created_at: '2024-03-12' },
];

export const mockPayouts: Payout[] = [
  { id: 'po1', user_id: 'u1', amount: 2000, currency: 'EUR', method: 'crypto', status: 'completed', destination: '0xABC123DEF456', created_at: '2024-03-05' },
  { id: 'po2', user_id: 'u1', amount: 1500, currency: 'EUR', method: 'iban', status: 'completed', destination: 'DE89 3704 0044 0532 0130 00', created_at: '2024-03-12' },
  { id: 'po3', user_id: 'u1', amount: 800, currency: 'EUR', method: 'crypto', status: 'processing', destination: '0xDEF789ABC012', created_at: '2024-03-20' },
];

export const mockCryptoWallets: CryptoWallet[] = [
  { id: 'cw1', user_id: 'u1', address: '0xABC123DEF456789012345678901234567890ABCD', network: 'ethereum', label: 'Main ETH Wallet' },
  { id: 'cw2', user_id: 'u1', address: '0xDEF789ABC012345678901234567890123456CDEF', network: 'polygon', label: 'Polygon USDC' },
];

export const mockRevenueData = [
  { month: 'Oct', collected: 8200, payouts: 5100 },
  { month: 'Nov', collected: 12400, payouts: 8200 },
  { month: 'Dec', collected: 15600, payouts: 10300 },
  { month: 'Jan', collected: 11800, payouts: 7600 },
  { month: 'Feb', collected: 18200, payouts: 12100 },
  { month: 'Mar', collected: 22450, payouts: 15500 },
];

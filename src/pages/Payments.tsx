import { mockPayments, mockPaymentPlans, mockCustomers } from '@/data/mock';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const statusColors: Record<string, string> = {
  confirmed: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Track SEPA direct debit payments</p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {mockPayments.map((payment, i) => {
                const plan = mockPaymentPlans.find(p => p.id === payment.plan_id);
                const customer = plan ? mockCustomers.find(c => c.id === plan.customer_id) : null;
                return (
                  <motion.tr key={payment.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground">{customer?.name ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-foreground">€{payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge className={statusColors[payment.status]}>{payment.status}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{payment.created_at}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;

import { mockMandates, mockCustomers } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  expired: 'bg-muted text-muted-foreground',
};

const MandatesPage = () => {
  const handleCreate = () => {
    toast.info('GoCardless redirect flow would start here', { description: 'In production, the customer would be redirected to authorize the SEPA mandate.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mandates</h1>
          <p className="text-sm text-muted-foreground mt-1">SEPA Direct Debit mandates</p>
        </div>
        <Button size="sm" onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />Create Mandate</Button>
      </div>

      <div className="space-y-2">
        {mockMandates.map((mandate, i) => {
          const customer = mockCustomers.find(c => c.id === mandate.customer_id);
          return (
            <motion.div key={mandate.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">{customer?.name ?? 'Unknown'}</p>
                  <Badge className={statusColors[mandate.status]}>{mandate.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{mandate.gocardless_id}</p>
                <p className="text-xs text-muted-foreground">Created {mandate.created_at}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ExternalLink className="w-3 h-3 mr-1" /> View
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MandatesPage;

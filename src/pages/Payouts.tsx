import { useState } from 'react';
import { mockPayouts, mockWallet, mockBankAccounts, mockCryptoWallets } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUpRight, Bitcoin, Building2, CreditCard, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  completed: 'bg-success/10 text-success border-success/20',
  processing: 'bg-warning/10 text-warning border-warning/20',
  pending: 'bg-muted text-muted-foreground',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
};

const methodIcons: Record<string, any> = {
  crypto: Bitcoin,
  iban: Building2,
  stripe: CreditCard,
};

const PayoutsPage = () => {
  const [method, setMethod] = useState('crypto');

  const handlePayout = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payout request submitted (mock)', { description: 'In production, this would trigger the payout flow.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
          <p className="text-sm text-muted-foreground mt-1">Withdraw to crypto, IBAN, or Stripe</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />New Payout</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader><DialogTitle>Request Payout</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={handlePayout}>
              <div className="glass-card rounded-lg p-3 bg-muted/50">
                <p className="text-xs text-muted-foreground">Available balance</p>
                <p className="text-lg font-bold font-mono text-success">€{mockWallet.available_balance.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label>Amount (EUR)</Label>
                <Input type="number" placeholder="1000" className="bg-muted border-border font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Payout Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="bg-muted border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Crypto Wallet</SelectItem>
                    <SelectItem value="iban">External IBAN</SelectItem>
                    <SelectItem value="stripe">Stripe Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {method === 'crypto' && (
                <div className="space-y-2">
                  <Label>Destination Wallet</Label>
                  <Select>
                    <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select wallet" /></SelectTrigger>
                    <SelectContent>
                      {mockCryptoWallets.map(w => (
                        <SelectItem key={w.id} value={w.id}>{w.label} ({w.network})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {method === 'iban' && (
                <div className="space-y-2">
                  <Label>Destination IBAN</Label>
                  <Select>
                    <SelectTrigger className="bg-muted border-border"><SelectValue placeholder="Select IBAN" /></SelectTrigger>
                    <SelectContent>
                      {mockBankAccounts.filter(a => !a.is_primary && a.is_verified).map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.bank_name} – {a.iban.slice(-8)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {method === 'stripe' && (
                <div className="space-y-2">
                  <Label>Stripe Account ID</Label>
                  <Input placeholder="acct_123..." className="bg-muted border-border font-mono text-sm" />
                </div>
              )}
              <Button className="w-full">Submit Payout Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {mockPayouts.map((payout, i) => {
          const Icon = methodIcons[payout.method] ?? ArrowUpRight;
          return (
            <motion.div key={payout.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">€{payout.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{payout.destination}</p>
                  <p className="text-xs text-muted-foreground">{payout.created_at}</p>
                </div>
              </div>
              <Badge className={statusColors[payout.status]}>{payout.status}</Badge>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PayoutsPage;

import { mockWallet, mockLedger } from '@/data/mock';
import { Badge } from '@/components/ui/badge';
import { Wallet as WalletIcon, Clock, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const WalletPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">Your internal ledger balances</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Available', value: mockWallet.available_balance, icon: WalletIcon, cls: 'text-success' },
          { label: 'Pending', value: mockWallet.pending_balance, icon: Clock, cls: 'text-warning' },
          { label: 'Reserved', value: mockWallet.reserved_balance, icon: Lock, cls: 'text-muted-foreground' },
        ].map(b => (
          <motion.div key={b.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <b.icon className={`w-4 h-4 ${b.cls}`} />
              <span className="text-xs text-muted-foreground">{b.label}</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${b.cls}`}>€{b.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Ledger History</h2>
        <div className="space-y-2">
          {mockLedger.map(entry => (
            <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${entry.type === 'credit' ? 'bg-success' : 'bg-warning'}`} />
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{entry.source}</Badge>
                    <span className="text-xs text-muted-foreground">{entry.created_at}</span>
                  </div>
                </div>
              </div>
              <span className={`text-sm font-mono font-medium shrink-0 ml-3 ${entry.type === 'credit' ? 'text-success' : 'text-foreground'}`}>
                {entry.type === 'credit' ? '+' : '-'}€{entry.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

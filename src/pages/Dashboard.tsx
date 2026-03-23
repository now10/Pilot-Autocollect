import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Users, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockWallet, mockCustomers, mockMandates, mockLedger, mockRevenueData } from '@/data/mock';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ label, value, icon: Icon, trend, trendUp }: { label: string; value: string; icon: any; trend?: string; trendUp?: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4 md:p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      {trend && (
        <span className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </motion.div>
);

const Dashboard = () => {
  const recentLedger = mockLedger.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your collections & payouts</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Available Balance" value={`€${mockWallet.available_balance.toLocaleString()}`} icon={Wallet} trend="+12.5%" trendUp />
        <StatCard label="Pending" value={`€${mockWallet.pending_balance.toLocaleString()}`} icon={TrendingUp} trend="+3.2%" trendUp />
        <StatCard label="Customers" value={mockCustomers.length.toString()} icon={Users} trend="+2" trendUp />
        <StatCard label="Active Mandates" value={mockMandates.filter(m => m.status === 'active').toString().length.toString()} icon={FileText} />
      </div>

      <div className="glass-card rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Revenue Overview</h2>
        <div className="h-56 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(162, 72%, 46%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(162, 72%, 46%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(215, 12%, 50%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215, 12%, 50%)' }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 18%, 9%)', border: '1px solid hsl(220, 14%, 16%)', borderRadius: '8px', color: 'hsl(210, 20%, 92%)' }} />
              <Area type="monotone" dataKey="collected" stroke="hsl(162, 72%, 46%)" fill="url(#colorCollected)" strokeWidth={2} />
              <Area type="monotone" dataKey="payouts" stroke="hsl(215, 12%, 50%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 md:p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentLedger.map(entry => (
            <div key={entry.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${entry.type === 'credit' ? 'bg-success' : 'bg-warning'}`} />
                <div>
                  <p className="text-sm text-foreground">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{entry.created_at}</p>
                </div>
              </div>
              <span className={`text-sm font-mono font-medium ${entry.type === 'credit' ? 'text-success' : 'text-foreground'}`}>
                {entry.type === 'credit' ? '+' : '-'}€{entry.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

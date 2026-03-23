import { useState } from 'react';
import { mockCustomers, mockMandates } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const filtered = mockCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your SEPA debit customers</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4 mr-2" />Add Customer</Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-border">
            <DialogHeader><DialogTitle>Add New Customer</DialogTitle></DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Marie Dupont" className="bg-muted border-border" /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="marie@example.com" className="bg-muted border-border" /></div>
              <div className="space-y-2"><Label>IBAN</Label><Input placeholder="FR76 1234 5678 ..." className="bg-muted border-border font-mono text-sm" /></div>
              <Button className="w-full">Create Customer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="pl-10 bg-muted border-border" />
      </div>

      <div className="space-y-2">
        {filtered.map((customer, i) => {
          const mandate = mockMandates.find(m => m.customer_id === customer.id);
          return (
            <motion.div key={customer.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{customer.name}</p>
                <p className="text-xs text-muted-foreground">{customer.email}</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">{customer.iban}</p>
              </div>
              <div className="flex items-center gap-2">
                {mandate && (
                  <Badge variant={mandate.status === 'active' ? 'default' : 'secondary'} className={mandate.status === 'active' ? 'bg-success/10 text-success border-success/20' : ''}>
                    {mandate.status}
                  </Badge>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomersPage;

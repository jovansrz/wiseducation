import React, { useState, useMemo } from 'react';
import type { Transaction } from '../context/PortfolioContext';

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    transactions: Transaction[];
}

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ isOpen, onClose, transactions }) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const txDate = new Date(tx.timestamp);
            txDate.setHours(0, 0, 0, 0);

            let matchesStart = true;
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                matchesStart = txDate >= start;
            }

            let matchesEnd = true;
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0);
                matchesEnd = txDate <= end;
            }

            return matchesStart && matchesEnd;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [transactions, startDate, endDate]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(Math.round(value));
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-card-dark border border-card-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-card-border flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Investment History</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 bg-background-dark/50 border-b border-card-border flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">From:</span>
                        <input
                            type="date"
                            className="bg-card-dark border border-card-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">To:</span>
                        <input
                            type="date"
                            className="bg-card-dark border border-card-border rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="text-xs text-primary hover:text-primary/80"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 flex-1">
                    {filteredTransactions.length > 0 ? (
                        <div className="divide-y divide-card-border border border-card-border rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm text-text-secondary">
                                <thead className="bg-card-border/30 text-white font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Asset</th>
                                        <th className="px-4 py-3 text-right">Qty (Lots)</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-card-border">
                                    {filteredTransactions.map(tx => (
                                        <tr key={tx.id} className="hover:bg-card-border/20 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap">{formatDate(tx.timestamp)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${tx.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-white">
                                                {tx.ticker}
                                                <span className="block text-xs text-text-secondary font-normal truncate max-w-[150px]">{tx.name}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-white">{tx.quantity}</td>
                                            <td className="px-4 py-3 text-right">Rp {formatCurrency(tx.price)}</td>
                                            <td className={`px-4 py-3 text-right font-bold ${tx.type === 'BUY' ? 'text-white' : 'text-green-500'}`}>
                                                {tx.type === 'BUY' ? '-' : '+'}Rp {formatCurrency(tx.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <span className="material-symbols-outlined text-4xl text-card-border mb-3">history_toggle_off</span>
                            <p className="text-text-secondary">No transactions found for the selected period.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-card-border bg-background-dark/30 flex justify-between items-center text-xs text-text-secondary">
                    <span>Showing {filteredTransactions.length} transactions</span>
                    <span>Total Volume: Rp {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.total, 0))}</span>
                </div>
            </div>
        </div>
    );
};

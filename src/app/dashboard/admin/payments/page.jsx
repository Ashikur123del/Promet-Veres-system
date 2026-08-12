"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-foreground">All Payments</h1>
      <p className="mt-1 text-sm text-muted">View all Premium subscription transactions.</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-background/40 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-muted">
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="border-b border-border/50 hover:bg-background/20">
                  <td className="px-6 py-4 font-mono text-xs text-surface-foreground">
                    {payment.transactionId?.slice(0, 24)}...
                  </td>
                  <td className="px-6 py-4 text-surface-foreground">{payment.email}</td>
                  <td className="px-6 py-4 text-surface-foreground">${payment.amount?.toFixed(2)}</td>
                  <td className="px-6 py-4 text-muted">
                    {payment.date ? new Date(payment.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                      {payment.status || "completed"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;

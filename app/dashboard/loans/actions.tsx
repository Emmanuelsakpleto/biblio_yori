"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface Loan {
  id: number;
  book_id: number;
  loan_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  renewals_count: number;
  late_fee: number;
  notes?: string;
  book?: { title: string; author: string; };
}

export default function LoanActionsPage() {
  const { token } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLoans(data);
      } catch {
        setLoans([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, [token, message]);

  async function handleReturn(loanId: number) {
    setActionLoading(loanId);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/${loanId}/return`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMessage('Livre retourné avec succès !');
      else setMessage(data.error || 'Erreur lors du retour.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleExtend(loanId: number) {
    setActionLoading(loanId);
    setMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/${loanId}/extend`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMessage('Emprunt prolongé !');
      else setMessage(data.error || 'Erreur lors de la prolongation.');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <h2 className="center">Mes emprunts</h2>
          {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}
          {loading ? (
            <div>Chargement...</div>
          ) : loans.length === 0 ? (
            <div>Aucun emprunt en cours.</div>
          ) : (
            <ul>
              {loans.map(loan => (
                <li key={loan.id} style={{ marginBottom: 16 }}>
                  <b>{loan.book?.title}</b> par {loan.book?.author}<br />
                  Emprunté le : {loan.loan_date}<br />
                  À rendre avant : {loan.due_date}<br />
                  Statut : {loan.status}<br />
                  {loan.status === 'active' && (
                    <>
                      <button onClick={() => handleReturn(loan.id)} disabled={actionLoading === loan.id} className="saveButton">
                        {actionLoading === loan.id ? 'Retour...' : 'Retourner'}
                      </button>
                      <button onClick={() => handleExtend(loan.id)} disabled={actionLoading === loan.id || loan.renewals_count >= 2} className="saveButton">
                        {actionLoading === loan.id ? 'Prolongation...' : 'Prolonger'}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
    </ProtectedRoute>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfig } from '../../../contexts/ConfigContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { loanService, utils, type Loan } from '../../../lib/api';

export default function LoansPage() {
  const { user } = useAuth();
  const config = useConfig();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await loanService.getMyLoans();
      if (response.success && response.data) {
        setLoans(response.data);
      } else {
        setError(response.message || 'Erreur lors du chargement des emprunts');
      }
    } catch (err) {
      setError('Erreur lors du chargement des emprunts');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      const response = await loanService.returnLoan(loanId);
      if (response.success) {
        await fetchLoans(); // Recharger la liste
      } else {
        alert(response.message || 'Erreur lors du retour du livre');
      }
    } catch (error) {
      alert('Erreur lors du retour du livre');
    }
  };

  const handleExtend = async (loanId: number) => {
    try {
      const response = await loanService.extendLoan(loanId);
      if (response.success) {
        await fetchLoans(); // Recharger la liste
      } else {
        alert(response.message || 'Erreur lors de la prolongation');
      }
    } catch (error) {
      alert('Erreur lors de la prolongation');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return '#ff4444';
      case 'active': return '#44aa44';
      case 'returned': return '#888888';
      default: return '#333333';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'returned': return 'Rendu';
      case 'overdue': return 'En retard';
      case 'reserved': return 'Réservé';
      default: return status;
    }
  };

  return (
    <ProtectedRoute>
      <main className="bookContainer">
        <aside>
          <h2 className="center">Mes emprunts</h2>
          <p className="small">
            Vous pouvez emprunter jusqu'à {config.MAX_BOOKS_PER_USER} livres simultanément
          </p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div>Chargement de vos emprunts...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>
              {error}
              <button 
                onClick={fetchLoans}
                className="saveButton"
                style={{ display: 'block', margin: '10px auto' }}
              >
                Réessayer
              </button>
            </div>
          ) : loans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p>Aucun emprunt en cours.</p>
              <p>Explorez notre collection pour découvrir de nouveaux livres !</p>
            </div>
          ) : (
            <div>
              {loans.map(loan => {
                const isOverdue = utils.isOverdue(loan.due_date);
                const daysUntilDue = utils.getDaysUntilDue(loan.due_date);
                const canRenew = loan.renewals_count < config.MAX_RENEWALS && loan.status === 'active';
                
                return (
                  <div key={loan.id} className="hover-card" style={{ 
                    marginBottom: '20px', 
                    padding: '15px', 
                    borderRadius: '10px',
                    border: isOverdue ? '2px solid #ff4444' : '1px solid #ddd'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                          {loan.book?.title || 'Livre inconnu'}
                        </h3>
                        <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                          par {loan.book?.author || 'Auteur inconnu'}
                        </p>
                        
                        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                          <p><strong>Emprunté le :</strong> {utils.formatDate(loan.loan_date)}</p>
                          <p><strong>À rendre avant :</strong> {utils.formatDate(loan.due_date)}</p>
                          <p>
                            <strong>Statut :</strong> 
                            <span style={{ 
                              color: getStatusColor(loan.status),
                              fontWeight: 'bold',
                              marginLeft: '5px'
                            }}>
                              {getStatusText(loan.status)}
                            </span>
                          </p>
                          
                          {isOverdue && (
                            <p style={{ color: '#ff4444', fontWeight: 'bold' }}>
                              ⚠️ Retard de {Math.abs(daysUntilDue)} jour(s)
                            </p>
                          )}
                          
                          {!isOverdue && daysUntilDue <= 3 && loan.status === 'active' && (
                            <p style={{ color: '#ff8800', fontWeight: 'bold' }}>
                              ⏰ À rendre dans {daysUntilDue} jour(s)
                            </p>
                          )}
                          
                          <p><strong>Prolongations :</strong> {loan.renewals_count}/{config.MAX_RENEWALS}</p>
                          
                          {loan.late_fee && loan.late_fee > 0 && (
                            <p style={{ color: '#ff4444' }}>
                              <strong>Frais de retard :</strong> {loan.late_fee}€
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {loan.status === 'active' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <button
                            onClick={() => handleReturn(loan.id)}
                            className="saveButton"
                            style={{ 
                              background: '#44aa44',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              fontSize: '12px'
                            }}
                          >
                            Retourner
                          </button>
                          
                          {canRenew && (
                            <button
                              onClick={() => handleExtend(loan.id)}
                              className="saveButton"
                              style={{ 
                                background: '#4488ff',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                fontSize: '12px'
                              }}
                            >
                              Prolonger
                            </button>
                          )}
                          
                          {!canRenew && loan.renewals_count >= config.MAX_RENEWALS && (
                            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
                              Prolongations épuisées
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </main>
    </ProtectedRoute>
  );
}

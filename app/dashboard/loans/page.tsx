"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useConfig } from '../../../contexts/ConfigContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { loanService, utils, type Loan } from '../../../lib/api';
import { AlertCircle, CheckCircle, Search, Filter, User, BookOpen, Clock, Check, XCircle } from 'lucide-react';
import clsx from 'clsx';


export default function LoansPage() {
  const { user } = useAuth();
  const config = useConfig();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchLoans();
  }, [user, statusFilter, currentPage]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      if (user?.role === 'admin') {
        response = await loanService.getAllLoans({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          page: currentPage,
          limit: 20
        });
        if (response.success && response.data) {
          if (Array.isArray(response.data.loans)) {
            setLoans(response.data.loans);
            setTotalPages(response.data.pagination?.totalPages || 1);
          } else {
            setLoans([]);
            setTotalPages(1);
          }
        }
      } else {
        response = await loanService.getMyLoans();
        if (response.success && response.data) {
          if (Array.isArray(response.data)) {
            setLoans(response.data);
          } else if (Array.isArray(response.data.loans)) {
            setLoans(response.data.loans);
          } else {
            setLoans([]);
          }
        }
      }
      if (!response.success) setError(response.message || 'Erreur lors du chargement des emprunts');
    } catch (err) {
      setError('Erreur lors du chargement des emprunts');
    } finally {
      setLoading(false);
    }
  };


  // Actions communes
  const handleReturn = async (loanId: number) => {
    try {
      const response = await loanService.returnLoan(loanId);
      if (response.success) {
        setMessage({ text: 'Livre retourné avec succès', type: 'success' });
        await fetchLoans();
      } else {
        setMessage({ text: response.message || 'Erreur lors du retour', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors du retour du livre', type: 'error' });
    }
  };

  // Actions admin
  const handleValidate = async (loanId: number) => {
    try {
      const response = await loanService.validateLoan(loanId);
      if (response.success) {
        setMessage({ text: 'Réservation validée', type: 'success' });
        await fetchLoans();
      } else {
        setMessage({ text: response.message || 'Erreur lors de la validation', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la validation', type: 'error' });
    }
  };

  const handleMarkOverdue = async (loanId: number) => {
    try {
      const response = await loanService.markAsOverdue(loanId);
      if (response.success) {
        setMessage({ text: 'Emprunt marqué en retard', type: 'success' });
        await fetchLoans();
      } else {
        setMessage({ text: response.message || 'Erreur lors du signalement', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors du signalement', type: 'error' });
    }
  };


  const handleExtend = async (loanId: number) => {
    try {
      const response = await loanService.extendLoan(loanId);
      if (response.success) {
        setMessage({ text: 'Emprunt prolongé', type: 'success' });
        await fetchLoans();
      } else {
        setMessage({ text: response.message || 'Erreur lors de la prolongation', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de la prolongation', type: 'error' });
    }
  };

  // Annuler une réservation (étudiant)
  const handleCancel = async (loanId: number) => {
    try {
      const response = await loanService.cancelLoan(loanId);
      if (response.success) {
        setMessage({ text: 'Réservation annulée', type: 'success' });
        await fetchLoans();
      } else {
        setMessage({ text: response.message || 'Erreur lors de l\'annulation', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de l\'annulation', type: 'error' });
    }
  };

  // Refuser une réservation (admin)
  const handleRefuse = async (loanId: number) => {
    try {
      const response = await loanService.refuseLoan(loanId);
      if (response.success) {
        setMessage({ text: 'Réservation refusée', type: 'success' });
        await fetchLoans();
      } else {
        setMessage({ text: response.message || 'Erreur lors du refus', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors du refus', type: 'error' });
    }
  };

  // Envoyer un rappel (admin)
  const handleReminder = async (loanId: number) => {
    try {
      const response = await loanService.sendReminder(loanId);
      if (response.success) {
        setMessage({ text: 'Rappel envoyé', type: 'success' });
      } else {
        setMessage({ text: response.message || 'Erreur lors de l\'envoi du rappel', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Erreur lors de l\'envoi du rappel', type: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return '#ff4444';
      case 'active': return '#44aa44';
      case 'returned': return '#888888';
      case 'pending': return '#facc15';
      case 'cancelled': return '#eab308';
      case 'refused': return '#f87171';
      default: return '#333333';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'returned': return 'Rendu';
      case 'overdue': return 'En retard';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'refused': return 'Refusé';
      default: return status;
    }
  };

  // Affichage moderne, admin ou étudiant
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-main)] via-[var(--color-bg-alt)] to-[var(--color-bg-main)]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-2">
                {user?.role === 'admin' ? 'Gestion des Emprunts' : 'Mes Emprunts'}
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                {user?.role === 'admin'
                  ? 'Administration des emprunts et réservations de la bibliothèque'
                  : `Vous pouvez emprunter jusqu'à ${config.MAX_BOOKS_PER_USER} livres simultanément`}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, auteur... (à venir)"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] text-[var(--color-text-primary)]"
                  disabled
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] text-[var(--color-text-primary)]"
                >
                  <option value="all">Tous statuts</option>
                  <option value="pending">En attente</option>
                  <option value="active">En cours</option>
                  <option value="overdue">En retard</option>
                  <option value="returned">Rendu</option>
                  <option value="cancelled">Annulé</option>
                  <option value="refused">Refusé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
              <button onClick={() => setMessage(null)} className="ml-auto text-gray-500 hover:text-gray-700">×</button>
            </div>
          )}

          {/* Tableau des emprunts */}
          <div className="glass-effect-strong rounded-2xl border border-white/20 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-[var(--color-accent-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[var(--color-text-secondary)]">Chargement des emprunts...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-600">
                {error}
                <button onClick={fetchLoans} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Réessayer</button>
              </div>
            ) : loans.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                  Aucun emprunt trouvé
                </h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  Aucun emprunt ne correspond à vos critères.
                </p>
              </div>
            ) : (
              <>
                {/* En-tête du tableau */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-white/10 backdrop-blur-sm border-b border-white/20 font-semibold text-[var(--color-text-primary]">
                  <div className="col-span-3">Livre</div>
                  <div className="col-span-2">Utilisateur</div>
                  <div className="col-span-2">Dates</div>
                  <div className="col-span-1">Statut</div>
                  <div className="col-span-2">Actions</div>
                  <div className="col-span-2">Infos</div>
                </div>
                {/* Lignes des emprunts */}
                {loans.map((loan, index) => {
                  const isOverdue = utils.isOverdue(loan.due_date);
                  const daysUntilDue = utils.getDaysUntilDue(loan.due_date);
                  const canRenew = loan.renewals_count < config.MAX_RENEWALS && loan.status === 'active';
                  return (
                    <div key={loan.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 hover:bg-white/5 transition-colors items-center">
                      {/* Livre */}
                      <div className="col-span-3">
                        <div className="font-semibold text-[var(--color-text-primary)] truncate">{loan.book?.title || loan.title || 'Livre inconnu'}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">{loan.book?.author || loan.author || 'Auteur inconnu'}</div>
                      </div>
                      {/* Utilisateur */}
                      <div className="col-span-2">
                        {user?.role === 'admin' ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{loan.user?.first_name} {loan.user?.last_name}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">Moi</span>
                        )}
                      </div>
                      {/* Dates */}
                      <div className="col-span-2 text-sm">
                        <div>Début : {utils.formatDate(loan.loan_date)}</div>
                        <div>Fin : {utils.formatDate(loan.due_date)}</div>
                        {loan.return_date && <div>Rendu : {utils.formatDate(loan.return_date)}</div>}
                      </div>
                      {/* Statut */}
                      <div className="col-span-1">
                        <span className={clsx('px-2 py-1 rounded-lg text-sm', {
                          'bg-yellow-100 text-yellow-800': loan.status === 'pending',
                          'bg-green-100 text-green-800': loan.status === 'active',
                          'bg-red-100 text-red-800': loan.status === 'overdue',
                          'bg-gray-200 text-gray-800': loan.status === 'returned',
                          'bg-orange-100 text-orange-800': loan.status === 'cancelled',
                          'bg-pink-100 text-pink-800': loan.status === 'refused',
                        })}>
                          {getStatusText(loan.status)}
                        </span>
                      </div>
                      {/* Actions */}
                      <div className="col-span-2 flex gap-2 flex-wrap">
                        {/* Admin actions */}
                        {user?.role === 'admin' && loan.status === 'pending' && (
                          <>
                            <button onClick={() => handleValidate(loan.id)} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-xs">
                              <Check className="w-4 h-4" /> Valider
                            </button>
                            <button onClick={() => handleRefuse(loan.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs">
                              Refuser
                            </button>
                          </>
                        )}
                        {user?.role === 'admin' && loan.status === 'active' && (
                          <button onClick={() => handleMarkOverdue(loan.id)} className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-1 text-xs"><Clock className="w-4 h-4" /> Retard</button>
                        )}
                        {/* Retourner : seulement admin */}
                        {user?.role === 'admin' && (loan.status === 'active' || loan.status === 'overdue') && (
                          <button onClick={() => handleReturn(loan.id)} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-xs"><XCircle className="w-4 h-4" /> Retourner</button>
                        )}
                        {/* Prolonger : étudiant ou admin, mais visible seulement si possible */}
                        {canRenew && user?.role !== 'admin' && (
                          <button onClick={() => handleExtend(loan.id)} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1 text-xs">Prolonger</button>
                        )}
                        {/* Étudiant : annuler une réservation */}
                        {/* Annuler : étudiant seulement, si pending */}
                        {user?.role !== 'admin' && loan.status === 'pending' && (
                          <button onClick={() => handleCancel(loan.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs">
                            Annuler
                          </button>
                        )}
                        {/* Désactiver les actions pour les statuts annulé/refusé */}
                        {user?.role !== 'admin' && (loan.status === 'cancelled' || loan.status === 'refused') && (
                          <span className="px-3 py-2 bg-gray-300 text-gray-600 rounded-lg text-xs cursor-not-allowed">Aucune action</span>
                        )}
                        {/* Admin : valider/refuser une réservation */}
                        {user?.role === 'admin' && loan.status === 'pending' && (
                          <>
                            <button onClick={() => handleValidate(loan.id)} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 text-xs">
                              <Check className="w-4 h-4" /> Valider
                            </button>
                            <button onClick={() => handleRefuse(loan.id)} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1 text-xs">
                              Refuser
                            </button>
                          </>
                        )}
                        {/* Admin : envoyer un rappel */}
                        {user?.role === 'admin' && loan.status === 'overdue' && (
                          <button onClick={() => handleReminder(loan.id)} className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-1 text-xs">
                            Rappel
                          </button>
                        )}
                      </div>
                      {/* Infos */}
                      <div className="col-span-2 text-xs text-gray-500">
                        {isOverdue && <div className="text-red-600 font-bold">⚠️ Retard de {Math.abs(daysUntilDue)} jour(s)</div>}
                        {!isOverdue && daysUntilDue <= 3 && loan.status === 'active' && <div className="text-orange-600 font-bold">⏰ À rendre dans {daysUntilDue} jour(s)</div>}
                        <div>Prolongations : {loan.renewals_count}/{config.MAX_RENEWALS}</div>
                        {loan.late_fee && loan.late_fee > 0 && <div className="text-red-600">Frais de retard : {loan.late_fee}€</div>}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Pagination admin */}
          {user?.role === 'admin' && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[var(--color-accent-primary)] text-white'
                        : 'bg-white/20 text-[var(--color-text-primary)] hover:bg-white/30'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

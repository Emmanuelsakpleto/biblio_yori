"use client";

import { useState } from "react";
import { Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
interface Claim {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  orderId?: string;
  subject: string;
  description: string;
  date: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  responseHistory?: {
    author: string;
    isAdmin: boolean;
    message: string;
    date: string;
  }[];
}

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-001",
      customer: {
        id: "USR-002",
        name: "Marie Konan",
        email: "marie.konan@example.com"
      },
      orderId: "ORD-006",
      subject: "Commande incomplète",
      description: "Ma commande ne contenait que 4 bouteilles d'eau au lieu des 6 commandées.",
      date: "2023-05-10",
      status: 'open',
      priority: 'medium',
    },
    {
      id: "CLM-002",
      customer: {
        id: "USR-003",
        name: "Sophie Laurent",
        email: "sophie.laurent@example.com"
      },
      orderId: "ORD-009",
      subject: "Problème de livraison",
      description: "Le livreur n'a pas respecté le créneau horaire convenu et j'ai dû attendre plus de 2 heures.",
      date: "2023-05-11",
      status: 'in-progress',
      priority: 'low',
      responseHistory: [
        {
          author: "Support Client",
          isAdmin: true,
          message: "Nous nous excusons pour ce désagrément. Nous vérifions actuellement la situation avec notre service de livraison.",
          date: "2023-05-11"
        }
      ]
    },
    {
      id: "CLM-003",
      customer: {
        id: "USR-007",
        name: "Aminata Diallo",
        email: "aminata.diallo@example.com"
      },
      orderId: "ORD-015",
      subject: "Produit endommagé",
      description: "Les bouteilles d'eau gazeuse étaient endommagées à la livraison. Le carton était complètement mouillé.",
      date: "2023-05-12",
      status: 'resolved',
      priority: 'high',
      responseHistory: [
        {
          author: "Support Client",
          isAdmin: true,
          message: "Nous sommes désolés pour cet incident. Pouvez-vous nous envoyer des photos des produits endommagés ?",
          date: "2023-05-12"
        },
        {
          author: "Aminata Diallo",
          isAdmin: false,
          message: "J'ai envoyé les photos par email. Merci.",
          date: "2023-05-12"
        },
        {
          author: "Support Client",
          isAdmin: true,
          message: "Nous avons bien reçu vos photos. Un remplacement des produits endommagés sera livré demain sans frais supplémentaires.",
          date: "2023-05-13"
        }
      ]
    },
    {
      id: "CLM-004",
      customer: {
        id: "USR-010",
        name: "Paul Kouamé",
        email: "paul.kouame@example.com"
      },
      orderId: "ORD-022",
      subject: "Double facturation",
      description: "J'ai été facturé deux fois pour ma dernière commande. Merci de vérifier et de procéder au remboursement.",
      date: "2023-05-13",
      status: 'closed',
      priority: 'high',
      responseHistory: [
        {
          author: "Support Client",
          isAdmin: true,
          message: "Nous avons vérifié votre compte et constaté cette erreur. Le remboursement a été initié et sera effectif sous 3 jours ouvrables.",
          date: "2023-05-13"
        },
        {
          author: "Paul Kouamé",
          isAdmin: false,
          message: "Merci pour votre réactivité.",
          date: "2023-05-13"
        },
        {
          author: "Support Client",
          isAdmin: true,
          message: "Le remboursement a bien été effectué. Veuillez vérifier votre compte bancaire.",
          date: "2023-05-15"
        }
      ]
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  
  const getStatusLabel = (status: Claim['status']) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'in-progress': return 'En cours';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };
  
  const getPriorityLabel = (priority: Claim['priority']) => {
    switch (priority) {
      case 'low': return 'Basse';
      case 'medium': return 'Moyenne';
      case 'high': return 'Haute';
      default: return priority;
    }
  };
  
  const getStatusColor = (status: Claim['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPriorityColor = (priority: Claim['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const filteredClaims = claims.filter(claim => {
    // Apply status filter
    if (statusFilter !== 'all' && claim.status !== statusFilter) {
      return false;
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all' && claim.priority !== priorityFilter) {
      return false;
    }
    
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      claim.customer.name.toLowerCase().includes(searchLower) ||
      claim.subject.toLowerCase().includes(searchLower) ||
      claim.description.toLowerCase().includes(searchLower) ||
      (claim.orderId && claim.orderId.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Réclamations</h1>
        <p className="text-gray-500">Traiter les requêtes et problèmes clients</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des réclamations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="open">Ouvert</option>
            <option value="in-progress">En cours</option>
            <option value="resolved">Résolu</option>
            <option value="closed">Fermé</option>
          </select>
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">Toutes priorités</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredClaims.map((claim) => (
          <Card key={claim.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {getStatusIcon(claim.status)}
                    {getStatusLabel(claim.status)}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(claim.priority)}`}>
                    Priorité {getPriorityLabel(claim.priority)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {claim.date}
                </div>
              </div>
              <CardTitle className="text-base mt-2">{claim.subject}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-1">
                  <span>{claim.customer.name}</span>
                  {claim.orderId && (
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      Commande #{claim.orderId}
                    </span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="text-sm">{claim.description}</p>
              </div>
              
              {claim.responseHistory && claim.responseHistory.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="text-sm font-medium">Historique de communication:</h4>
                  {claim.responseHistory.map((response, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md text-sm ${
                        response.isAdmin 
                          ? 'bg-blue-50 dark:bg-blue-900/20 ml-4' 
                          : 'bg-gray-50 dark:bg-gray-900 mr-4'
                      }`}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{response.author}</span>
                        <span className="text-xs text-gray-500">{response.date}</span>
                      </div>
                      <p>{response.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3">
              {claim.status !== 'closed' && (
                <Button size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" /> Répondre
                </Button>
              )}
              
              {claim.status === 'open' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <Clock className="h-4 w-4 mr-1" /> Passer en cours
                </Button>
              )}
              
              {(claim.status === 'open' || claim.status === 'in-progress') && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Marquer comme résolu
                </Button>
              )}
              
              {claim.status === 'resolved' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-700"
                >
                  <XCircle className="h-4 w-4 mr-1" /> Fermer la réclamation
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredClaims.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune réclamation ne correspond aux critères de recherche.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Filter, MessageSquare, CheckCircle, XCircle, Star } from "lucide-react";
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
interface Feedback {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  orderId?: string;
  productId?: string;
  productName?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'rejected';
  adminResponse?: string;
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: "FB-001",
      customer: {
        id: "USR-002",
        name: "Marie Konan",
        email: "marie.konan@example.com"
      },
      orderId: "ORD-006",
      productId: "PRD-001",
      productName: "Eau minérale 1.5L",
      rating: 5,
      comment: "Livraison rapide et produit de qualité. Je suis très satisfait du service.",
      date: "2023-05-10",
      status: 'published'
    },
    {
      id: "FB-002",
      customer: {
        id: "USR-003",
        name: "Sophie Laurent",
        email: "sophie.laurent@example.com"
      },
      orderId: "ORD-009",
      productId: "PRD-003",
      productName: "Jus d'orange 1L",
      rating: 3,
      comment: "Le produit est bon mais la livraison a pris beaucoup de temps.",
      date: "2023-05-11",
      status: 'pending'
    },
    {
      id: "FB-003",
      customer: {
        id: "USR-005",
        name: "Luc Bedi",
        email: "luc.bedi@example.com"
      },
      orderId: "ORD-012",
      productId: "PRD-005",
      productName: "Yaourt nature 125g",
      rating: 4,
      comment: "Produit frais et savoureux. Très bon rapport qualité-prix.",
      date: "2023-05-12",
      status: 'published',
      adminResponse: "Merci pour votre commentaire. Nous sommes ravis que vous appréciiez nos produits !"
    },
    {
      id: "FB-004",
      customer: {
        id: "USR-007",
        name: "Aminata Diallo",
        email: "aminata.diallo@example.com"
      },
      orderId: "ORD-015",
      productId: "PRD-002",
      productName: "Eau gazeuse 75cl",
      rating: 1,
      comment: "La bouteille était endommagée à l'arrivée. Très déçue du service.",
      date: "2023-05-12",
      status: 'rejected'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const getStatusLabel = (status: Feedback['status']) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Apply status filter
    if (statusFilter !== 'all' && feedback.status !== statusFilter) {
      return false;
    }

    // Apply rating filter
    if (ratingFilter !== 'all' && feedback.rating !== parseInt(ratingFilter)) {
      return false;
    }

    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      feedback.customer.name.toLowerCase().includes(searchLower) ||
      feedback.comment.toLowerCase().includes(searchLower) ||
      (feedback.productName && feedback.productName.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Avis Clients</h1>
        <p className="text-gray-500">Gérer les avis et commentaires des clients</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des avis..."
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
            <option value="published">Publiés</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejetés</option>
          </select>
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">Toutes étoiles</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedbacks.map((feedback) => (
          <Card key={feedback.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center mb-2">
                <div>
                  {renderStars(feedback.rating)}
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(feedback.status)}`}>
                  {getStatusLabel(feedback.status)}
                </span>
              </div>
              <CardTitle className="text-base">{feedback.customer.name}</CardTitle>
              <CardDescription>
                {feedback.productName && (
                  <span className="block">
                    Produit: {feedback.productName}
                  </span>
                )}
                <span className="text-xs">{feedback.date}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md mb-3">
                <div className="flex gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{feedback.comment}</p>
                </div>
              </div>
              {feedback.adminResponse && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md mt-2 ml-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <span className="font-medium block mb-1">Réponse admin:</span>
                    {feedback.adminResponse}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-3">
              {feedback.status === 'pending' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Rejeter
                  </Button>
                </>
              )}
              {feedback.status !== 'pending' && !feedback.adminResponse && (
                <Button size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" /> Répondre
                </Button>
              )}
              {feedback.adminResponse && (
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-1" /> Modifier la réponse
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredFeedbacks.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucun avis ne correspond aux critères de recherche.</p>
        </div>
      )}
    </div>
  );
}

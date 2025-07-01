"use client";

import { useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  status: "preparation" | "en-route" | "livree" | "annulee";
  total: number;
  paymentMethod: "mobile-money" | "especes";
  paymentStatus: "paid" | "pending" | "failed";
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress?: string;
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly";
    nextDelivery?: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: {
        name: "Jean Dupont",
        email: "jean@example.com",
        phone: "+225 0101010101"
      },
      date: "2023-05-12",
      status: "preparation",
      total: 25.50,
      paymentMethod: "mobile-money",
      paymentStatus: "paid",
      items: [
        { id: "1", name: "Eau minérale", quantity: 5, price: 1.5 },
        { id: "2", name: "Jus d'orange", quantity: 2, price: 2.8 }
      ],
      deliveryAddress: "Abidjan, Cocody"
    },
    {
      id: "ORD-002",
      customer: {
        name: "Marie Konan",
        email: "marie@example.com",
        phone: "+225 0707070707"
      },
      date: "2023-05-12",
      status: "en-route",
      total: 18.00,
      paymentMethod: "especes",
      paymentStatus: "pending",
      items: [
        { id: "3", name: "Yaourt nature", quantity: 6, price: 1.0 },
        { id: "4", name: "Pain complet", quantity: 2, price: 2.5 }
      ],
      deliveryAddress: "Abidjan, Yopougon",
      recurrence: {
        frequency: "weekly",
        nextDelivery: "2023-05-19"
      }
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "preparation": return "En préparation";
      case "en-route": return "En route";
      case "livree": return "Livrée";
      case "annulee": return "Annulée";
      default: return status;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "preparation": return "bg-blue-100 text-blue-800";
      case "en-route": return "bg-orange-100 text-orange-800";
      case "livree": return "bg-green-100 text-green-800";
      case "annulee": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Apply status filter
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer.name.toLowerCase().includes(searchLower) ||
      order.customer.email.toLowerCase().includes(searchLower) ||
      order.customer.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Commandes</h1>
        <p className="text-gray-500">Suivez et gérez les commandes client</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des commandes..."
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
            <option value="preparation">En préparation</option>
            <option value="en-route">En route</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Commande #{order.id}
                    {order.recurrence && (
                      <span className="text-xs font-normal bg-purple-100 text-purple-800 rounded-full px-2 py-0.5">
                        Programmée ({order.recurrence.frequency})
                      </span>
                    )}
                  </CardTitle>
                  <div className="text-sm text-gray-500">{order.customer.name} • {order.date}</div>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Méthode de paiement</span>
                  <span className="font-medium">
                    {order.paymentMethod === "mobile-money" ? "Mobile Money" : "Espèces"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Statut du paiement</span>
                  <span className={`font-medium ${
                    order.paymentStatus === "paid" ? "text-green-600" : 
                    order.paymentStatus === "pending" ? "text-orange-600" : "text-red-600"
                  }`}>
                    {order.paymentStatus === "paid" ? "Payé" : 
                     order.paymentStatus === "pending" ? "En attente" : "Échoué"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold">{order.total.toFixed(2)} €</span>
                </div>
                <div className="border-t pt-3 flex justify-end">
                  <Button size="sm" variant="outline" className="text-blue-600">
                    <Eye className="h-4 w-4 mr-1" /> Détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune commande trouvée</p>
        </div>
      )}
    </div>
  );
}

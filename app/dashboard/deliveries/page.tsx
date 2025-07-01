"use client";

import { useState } from "react";
import { Search, Filter, Calendar, Package, Truck, MapPin, RefreshCw, Clock, CheckCircle, XCircle } from "lucide-react";
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
interface Delivery {
  id: string;
  orderId: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  deliveryDate: string;
  deliveryWindow?: {
    start: string;
    end: string;
  };
  scheduledDeliveryDate?: string;
  address: string;
  area: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered' | 'failed' | 'rescheduled';
  courier?: {
    id: string;
    name: string;
    phone: string;
  };
  trackingNotes?: string[];
  priority: 'normal' | 'high' | 'express';
  type: 'one-time' | 'recurring';
  recurrencePattern?: string;
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "DEL-001",
      orderId: "ORD-006",
      customer: {
        id: "USR-002",
        name: "Marie Konan",
        phone: "+225 0707070707"
      },
      deliveryDate: "2023-05-14",
      deliveryWindow: {
        start: "09:00",
        end: "12:00"
      },
      address: "Rue des Jardins 45, Cocody",
      area: "Cocody",
      status: 'assigned',
      courier: {
        id: "COU-001",
        name: "Ibrahim Diallo",
        phone: "+225 0101010101"
      },
      priority: 'normal',
      type: 'one-time'
    },
    {
      id: "DEL-002",
      orderId: "ORD-009",
      customer: {
        id: "USR-003",
        name: "Sophie Laurent",
        phone: "+225 0505050505"
      },
      deliveryDate: "2023-05-14",
      deliveryWindow: {
        start: "14:00",
        end: "17:00"
      },
      address: "Avenue des Flamboyants 12, Plateau",
      area: "Plateau",
      status: 'in-transit',
      courier: {
        id: "COU-002",
        name: "Amadou Koné",
        phone: "+225 0202020202"
      },
      trackingNotes: [
        "En route pour la livraison (14:15)",
        "Tentative d'appel au client - aucune réponse (14:45)"
      ],
      priority: 'high',
      type: 'one-time'
    },
    {
      id: "DEL-003",
      orderId: "ORD-012",
      customer: {
        id: "USR-004",
        name: "Luc Bedi",
        phone: "+225 0606060606"
      },
      deliveryDate: "2023-05-14",
      address: "Boulevard de la République 78, Treichville",
      area: "Treichville",
      status: 'pending',
      priority: 'normal',
      type: 'one-time'
    },
    {
      id: "DEL-004",
      orderId: "ORD-015",
      customer: {
        id: "USR-007",
        name: "Aminata Diallo",
        phone: "+225 0808080808"
      },
      deliveryDate: "2023-05-13",
      deliveryWindow: {
        start: "10:00",
        end: "13:00"
      },
      address: "Rue des Manguiers 23, Yopougon",
      area: "Yopougon",
      status: 'delivered',
      courier: {
        id: "COU-003",
        name: "Fatoumata Bamba",
        phone: "+225 0303030303"
      },
      trackingNotes: [
        "En route pour la livraison (10:15)",
        "Arrivée à l'adresse (10:55)",
        "Livraison effectuée (11:05)"
      ],
      priority: 'normal',
      type: 'one-time'
    },
    {
      id: "DEL-005",
      orderId: "ORD-018",
      customer: {
        id: "USR-005",
        name: "Jean Kouassi",
        phone: "+225 0909090909"
      },
      deliveryDate: "2023-05-13",
      deliveryWindow: {
        start: "15:00",
        end: "18:00"
      },
      address: "Avenue des Acacias 56, Adjamé",
      area: "Adjamé",
      status: 'failed',
      courier: {
        id: "COU-001",
        name: "Ibrahim Diallo",
        phone: "+225 0101010101"
      },
      trackingNotes: [
        "En route pour la livraison (15:30)",
        "Arrivée à l'adresse (16:05)",
        "Client absent, tentative d'appel - aucune réponse (16:10)",
        "Livraison reportée (16:20)"
      ],
      priority: 'normal',
      type: 'one-time'
    },
    {
      id: "DEL-006",
      orderId: "ORD-022",
      customer: {
        id: "USR-010",
        name: "Paul Kouamé",
        phone: "+225 0404040404"
      },
      deliveryDate: "2023-05-17",
      scheduledDeliveryDate: "2023-05-17",
      deliveryWindow: {
        start: "09:00",
        end: "12:00"
      },
      address: "Rue des Hibiscus 34, Marcory",
      area: "Marcory",
      status: 'pending',
      priority: 'express',
      type: 'recurring',
      recurrencePattern: 'Hebdomadaire - Chaque mercredi'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Extract unique areas from deliveries
  const areas = Array.from(new Set(deliveries.map((delivery) => delivery.area)));

  const getStatusLabel = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'assigned': return 'Assignée';
      case 'in-transit': return 'En cours';
      case 'delivered': return 'Livrée';
      case 'failed': return 'Échouée';
      case 'rescheduled': return 'Reportée';
      default: return status;
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'in-transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Delivery['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 mr-1" />;
      case 'assigned': return <Package className="h-4 w-4 mr-1" />;
      case 'in-transit': return <Truck className="h-4 w-4 mr-1" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'failed': return <XCircle className="h-4 w-4 mr-1" />;
      case 'rescheduled': return <Calendar className="h-4 w-4 mr-1" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: Delivery['priority']) => {
    switch (priority) {
      case 'normal': return 'bg-gray-100 text-gray-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'express': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusCount = (status: Delivery['status']) => {
    return deliveries.filter(delivery => delivery.status === status).length;
  };

  const getTodayDeliveries = () => {
    const today = new Date().toISOString().split('T')[0];
    return deliveries.filter(delivery => delivery.deliveryDate === today).length;
  };

  // Filter deliveries based on search query and filters
  const filteredDeliveries = deliveries.filter((delivery) => {
    // Apply status filter
    if (statusFilter !== 'all' && delivery.status !== statusFilter) {
      return false;
    }

    // Apply area filter
    if (areaFilter !== 'all' && delivery.area !== areaFilter) {
      return false;
    }

    // Apply date filter
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    
    if (dateFilter === 'today' && delivery.deliveryDate !== today) {
      return false;
    } else if (dateFilter === 'tomorrow' && delivery.deliveryDate !== tomorrow) {
      return false;
    } else if (dateFilter === 'future' && (delivery.deliveryDate <= today)) {
      return false;
    } else if (dateFilter === 'past' && (delivery.deliveryDate >= today)) {
      return false;
    }

    // Apply type filter
    if (typeFilter !== 'all' && delivery.type !== typeFilter) {
      return false;
    }

    // Apply search filter
    const searchLower = searchQuery.toLowerCase();
    return (
      delivery.id.toLowerCase().includes(searchLower) ||
      delivery.orderId.toLowerCase().includes(searchLower) ||
      delivery.customer.name.toLowerCase().includes(searchLower) ||
      delivery.address.toLowerCase().includes(searchLower) ||
      delivery.area.toLowerCase().includes(searchLower) ||
      (delivery.courier?.name && delivery.courier.name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Livraisons</h1>
        <p className="text-gray-500">Planifier et suivre les livraisons des commandes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Aujourd'hui</p>
                <h3 className="text-2xl font-bold mt-1">{getTodayDeliveries()}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-md">
                <Calendar className="h-5 w-5 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">En cours</p>
                <h3 className="text-2xl font-bold mt-1">{getDeliveryStatusCount('in-transit')}</h3>
              </div>
              <div className="bg-orange-100 p-2 rounded-md">
                <Truck className="h-5 w-5 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Livrées</p>
                <h3 className="text-2xl font-bold mt-1">{getDeliveryStatusCount('delivered')}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-md">
                <Package className="h-5 w-5 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Problèmes</p>
                <h3 className="text-2xl font-bold mt-1">{getDeliveryStatusCount('failed')}</h3>
              </div>
              <div className="bg-red-100 p-2 rounded-md">
                <XCircle className="h-5 w-5 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des livraisons..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="assigned">Assignées</option>
            <option value="in-transit">En cours</option>
            <option value="delivered">Livrées</option>
            <option value="failed">Échouées</option>
            <option value="rescheduled">Reportées</option>
          </select>
          
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="all">Toutes zones</option>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Toutes dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="tomorrow">Demain</option>
            <option value="future">À venir</option>
            <option value="past">Passées</option>
          </select>

          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tous types</option>
            <option value="one-time">Standard</option>
            <option value="recurring">Récurrente</option>
          </select>

          <Button variant="outline" size="sm" className="ml-auto">
            <RefreshCw className="h-4 w-4 mr-1" /> Actualiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(delivery.status)}`}>
                    {getStatusIcon(delivery.status)}
                    {getStatusLabel(delivery.status)}
                  </span>
                  
                  {delivery.type === 'recurring' && (
                    <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-2.5 py-0.5">
                      Récurrente
                    </span>
                  )}
                  
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(delivery.priority)}`}>
                    {delivery.priority === 'express' ? 'Express' : 
                     delivery.priority === 'high' ? 'Prioritaire' : 'Standard'}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  {delivery.deliveryDate}
                </div>
              </div>
              <CardTitle className="text-base mt-2">
                Commande #{delivery.orderId}
              </CardTitle>
              <CardDescription>
                <div className="flex gap-1 items-center">
                  Client: {delivery.customer.name} • {delivery.customer.phone}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">{delivery.address}</div>
                  <div className="text-xs text-gray-500">Zone: {delivery.area}</div>
                </div>
              </div>
              
              {delivery.deliveryWindow && (
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    Créneau: {delivery.deliveryWindow.start} - {delivery.deliveryWindow.end}
                  </div>
                </div>
              )}
              
              {delivery.courier && (
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    Livreur: {delivery.courier.name} • {delivery.courier.phone}
                  </div>
                </div>
              )}

              {delivery.trackingNotes && delivery.trackingNotes.length > 0 && (
                <div className="mt-3 bg-gray-50 p-2 rounded-md">
                  <h4 className="text-xs font-medium mb-1">Suivi de livraison:</h4>
                  <ul className="text-xs space-y-1">
                    {delivery.trackingNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {delivery.recurrencePattern && (
                <div className="mt-3 bg-purple-50 p-2 rounded-md">
                  <div className="text-xs font-medium text-purple-800">
                    Récurrence: {delivery.recurrencePattern}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0 border-t flex justify-between">
              {delivery.status === 'pending' && (
                <>
                  <Button size="sm" variant="outline">
                    <Package className="h-4 w-4 mr-1" /> Assigner un livreur
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="h-4 w-4 mr-1" /> Annuler
                  </Button>
                </>
              )}
              
              {delivery.status === 'assigned' && (
                <>
                  <Button size="sm">
                    <Truck className="h-4 w-4 mr-1" /> Démarrer livraison
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" /> Reprogrammer
                  </Button>
                </>
              )}
              
              {delivery.status === 'in-transit' && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                    <CheckCircle className="h-4 w-4 mr-1" /> Marquer comme livrée
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                    <XCircle className="h-4 w-4 mr-1" /> Problème de livraison
                  </Button>
                </>
              )}
              
              {delivery.status === 'failed' && (
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-1" /> Reprogrammer
                </Button>
              )}
              
              {delivery.status === 'delivered' && (
                <Button size="sm" variant="outline">
                  <MapPin className="h-4 w-4 mr-1" /> Voir détails
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune livraison ne correspond aux critères de recherche.</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, Filter, RefreshCw, AlertTriangle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unitPrice: number;
  lastRestocked: string;
  location?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "INV-001",
      productId: "PRD-001",
      productName: "Eau minérale 1.5L",
      category: "Boissons",
      currentStock: 234,
      minStockLevel: 50,
      maxStockLevel: 500,
      unitPrice: 1.5,
      lastRestocked: "2023-05-05",
      location: "Zone A - Étagère 3",
      status: 'in-stock'
    },
    {
      id: "INV-002",
      productId: "PRD-002",
      productName: "Eau gazeuse 75cl",
      category: "Boissons",
      currentStock: 116,
      minStockLevel: 30,
      maxStockLevel: 300,
      unitPrice: 1.8,
      lastRestocked: "2023-05-07",
      location: "Zone A - Étagère 2",
      status: 'in-stock'
    },
    {
      id: "INV-003",
      productId: "PRD-003",
      productName: "Jus d'orange 1L",
      category: "Boissons",
      currentStock: 42,
      minStockLevel: 40,
      maxStockLevel: 200,
      unitPrice: 2.8,
      lastRestocked: "2023-05-01",
      location: "Zone A - Étagère 4",
      status: 'low-stock'
    },
    {
      id: "INV-004",
      productId: "PRD-004",
      productName: "Lait frais 1L",
      category: "Produits laitiers",
      currentStock: 53,
      minStockLevel: 50,
      maxStockLevel: 150,
      unitPrice: 2.1,
      lastRestocked: "2023-05-10",
      location: "Zone B - Réfrigérateur 2",
      status: 'low-stock'
    },
    {
      id: "INV-005",
      productId: "PRD-005",
      productName: "Yaourt nature 125g",
      category: "Produits laitiers",
      currentStock: 0,
      minStockLevel: 30,
      maxStockLevel: 100,
      unitPrice: 0.9,
      lastRestocked: "2023-04-28",
      location: "Zone B - Réfrigérateur 1",
      status: 'out-of-stock'
    },
    {
      id: "INV-006",
      productId: "PRD-006",
      productName: "Riz blanc 1kg",
      category: "Céréales et grains",
      currentStock: 87,
      minStockLevel: 20,
      maxStockLevel: 200,
      unitPrice: 2.5,
      lastRestocked: "2023-05-03",
      location: "Zone C - Étagère 2",
      status: 'in-stock'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get unique categories from inventory
  const categories = Array.from(new Set(inventory.map((item) => item.category)));

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock': return 'En stock';
      case 'low-stock': return 'Stock bas';
      case 'out-of-stock': return 'Épuisé';
      default: return status;
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const filteredInventory = inventory
    .filter((item) => {
      // Apply category filter
      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }

      // Apply status filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Apply search filter
      const searchLower = searchQuery.toLowerCase();
      return (
        item.productName.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower) ||
        (item.location && item.location.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.productName.localeCompare(b.productName);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "stock":
          comparison = a.currentStock - b.currentStock;
          break;
        case "price":
          comparison = a.unitPrice - b.unitPrice;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Calculate summary statistics
  const totalProducts = inventory.length;
  const lowStockProducts = inventory.filter(item => item.status === 'low-stock').length;
  const outOfStockProducts = inventory.filter(item => item.status === 'out-of-stock').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">Gestion des Stocks</h1>
        <p className="text-gray-500">Suivez et gérez l'inventaire des produits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium">Total des produits</CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-4">
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium text-yellow-900">Stock bas</CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-4">
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium text-red-900">Produits épuisés</CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-4">
            <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-medium text-blue-900">Valeur totale</CardTitle>
          </CardHeader>
          <CardContent className="py-1 px-4">
            <div className="text-2xl font-bold text-blue-600">{totalValue.toLocaleString('fr-FR')} F CFA</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher des produits..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Toutes catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            className="form-select rounded-md border border-gray-300 py-1.5 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous statuts</option>
            <option value="in-stock">En stock</option>
            <option value="low-stock">Stock bas</option>
            <option value="out-of-stock">Épuisé</option>
          </select>

          <Button variant="outline" size="sm" className="ml-auto">
            <RefreshCw className="h-4 w-4 mr-1" /> Actualiser
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs bg-gray-50 dark:bg-gray-800">
                  <th 
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Produit
                      {sortBy === "name" && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center">
                      Catégorie
                      {sortBy === "category" && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center">
                      Stock actuel
                      {sortBy === "stock" && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Min/Max</th>
                  <th 
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center">
                      Prix unitaire
                      {sortBy === "price" && (
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Dernière mise à jour</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Emplacement</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b hover:bg-gray-50 ${
                      item.status === 'out-of-stock' ? 'bg-red-50/50' : 
                      item.status === 'low-stock' ? 'bg-yellow-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">
                      <div>
                        <div>{item.productName}</div>
                        <div className="text-xs text-gray-500">{item.productId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3 font-medium">
                      {item.currentStock === 0 ? (
                        <span className="text-red-600 font-semibold">0</span>
                      ) : item.currentStock <= item.minStockLevel ? (
                        <span className="text-yellow-600 font-semibold">{item.currentStock}</span>
                      ) : (
                        <span>{item.currentStock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs">
                        Min: {item.minStockLevel} / Max: {item.maxStockLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.unitPrice.toLocaleString('fr-FR')} F CFA</td>
                    <td className="px-4 py-3">{item.lastRestocked}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs">
                        {item.location || "Non défini"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" className="h-8">
                        Réapprovisionner
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun produit ne correspond aux critères de recherche.
            </div>
          )}
        </CardContent>
      </Card>

      {lowStockProducts > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Produits à réapprovisionner</h3>
              <p className="text-sm text-yellow-800">
                {lowStockProducts} produit{lowStockProducts > 1 ? 's' : ''} en stock bas et {outOfStockProducts} produit{outOfStockProducts > 1 ? 's' : ''} épuisé{outOfStockProducts > 1 ? 's' : ''}.
                Veuillez planifier un réapprovisionnement rapidement.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

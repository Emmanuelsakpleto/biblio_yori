"use client";

import { useState } from "react";
import { Search, PlusCircle, Edit, Trash2 } from "lucide-react";
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
interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  slug: string;
  icon?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "CAT-001",
      name: "Boissons",
      description: "Eaux, sodas, jus et autres boissons",
      productCount: 24,
      slug: "boissons",
      icon: "🥤",
    },
    {
      id: "CAT-002",
      name: "Produits laitiers",
      description: "Laits, yaourts, fromages et autres produits laitiers",
      productCount: 15,
      slug: "produits-laitiers",
      icon: "🥛",
    },
    {
      id: "CAT-003",
      name: "Fruits et légumes",
      description: "Fruits et légumes frais et transformés",
      productCount: 32,
      slug: "fruits-legumes",
      icon: "🥦",
    },
    {
      id: "CAT-004",
      name: "Céréales et grains",
      description: "Riz, pâtes, semoule et autres céréales",
      productCount: 18,
      slug: "cereales-grains",
      icon: "🌾",
    },
    {
      id: "CAT-005",
      name: "Hygiène et Beauté",
      description: "Savons, shampooings, produits de maquillage",
      productCount: 27,
      slug: "hygiene-beaute",
      icon: "🧼",
    },
    {
      id: "CAT-006",
      name: "Entretien maison",
      description: "Produits ménagers, détergents, insecticides",
      productCount: 16,
      slug: "entretien-maison",
      icon: "🧹",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
          <p className="text-gray-500">Organisez votre catalogue par catégories</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une catégorie
        </Button>
      </div>

      <div className="relative w-full max-w-sm mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher des catégories..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-3xl">{category.icon}</div>
                  <CardTitle>{category.name}</CardTitle>
                </div>
                <div className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                  {category.productCount} produits
                </div>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-3 border-t">
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> Modifier
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune catégorie trouvée</p>
        </div>
      )}
    </div>
  );
}

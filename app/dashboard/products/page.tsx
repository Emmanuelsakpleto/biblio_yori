"use client";

import { useState } from "react";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
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
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: {
    type: "finite" | "infinite";
    quantity?: number;
  };
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Eau minérale",
      description: "Bouteille d'eau minérale 1.5L",
      price: 1.5,
      category: "Boisson",
      stock: {
        type: "finite",
        quantity: 50
      },
      image: "/images/water.jpg"
    },
    {
      id: "2",
      name: "Jus d'orange",
      description: "Jus d'orange naturel 1L",
      price: 2.8,
      category: "Boisson",
      stock: {
        type: "finite",
        quantity: 30
      },
      image: "/images/orange-juice.jpg"
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Produits</h1>
          <p className="text-gray-500">Gérer votre catalogue de produits</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>

      <div className="relative w-full max-w-sm mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher des produits..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="flex flex-col overflow-hidden">
            <div className="relative aspect-[4/3] w-full bg-gray-100">
              {product.image ? (
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  [Image du produit]
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  Pas d'image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-medium">
                {product.stock.type === "finite" ? `${product.stock.quantity} en stock` : "Stock infini"}
              </div>
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="font-semibold">{product.price.toFixed(2)} €</p>
              </div>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                  {product.category}
                </span>
              </div>
            </CardHeader>
            <CardFooter className="p-4 pt-0 mt-auto flex justify-between">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" /> Modifier
              </Button>
              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4 mr-1" /> Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
}

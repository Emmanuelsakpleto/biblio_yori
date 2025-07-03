"use client";

import { Activity, ShoppingBag, Users, ChevronRight, ChevronUp, ChevronDown, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-gray-500">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mes emprunts</CardTitle>
            <CardDescription>Voir et gérer mes emprunts</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/loans" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
              Voir mes emprunts
              <ChevronRight className="h-3 w-3 ml-1" />
            </a>
            <a href="/dashboard/loans/actions" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
              Retourner / Prolonger
              <ChevronRight className="h-3 w-3 ml-1" />
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mes notifications</CardTitle>
            <CardDescription>Consulter mes notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/notifications" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
              Voir mes notifications
              <ChevronRight className="h-3 w-3 ml-1" />
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mes avis</CardTitle>
            <CardDescription>Voir et ajouter un avis</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard/reviews" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2">
              Voir mes avis
              <ChevronRight className="h-3 w-3 ml-1" />
            </a>
            <a href="/dashboard/reviews/add" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
              Ajouter un avis
              <ChevronRight className="h-3 w-3 ml-1" />
            </a>
          </CardContent>
        </Card>
      </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152 500 F CFA</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium inline-flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" /> +15%
              </span>{" "}
              par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium inline-flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" /> +9%
              </span>{" "}
              par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 font-medium inline-flex items-center">
                <ChevronUp className="h-3 w-3 mr-1" /> +20%
              </span>{" "}
              par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 font-medium inline-flex items-center">
                <ChevronDown className="h-3 w-3 mr-1" /> -3%
              </span>{" "}
              par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Commandes récentes</CardTitle>
            <CardDescription>
              Les 5 dernières commandes passées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: "ORD-007", customer: "Karim Ouattara", amount: "25 000 F CFA", status: "En route" },
                { id: "ORD-006", customer: "Marie Konan", amount: "18 500 F CFA", status: "Livrée" },
                { id: "ORD-005", customer: "Sophie Laurent", amount: "12 000 F CFA", status: "En préparation" },
                { id: "ORD-004", customer: "Luc Bedi", amount: "9 500 F CFA", status: "Livrée" },
                { id: "ORD-003", customer: "Jean Dupont", amount: "31 200 F CFA", status: "Livrée" }
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">#{order.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{order.amount}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === "Livrée" ? "bg-green-100 text-green-800" : 
                      order.status === "En route" ? "bg-orange-100 text-orange-800" : 
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <a 
                href="/dashboard/orders" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Voir toutes les commandes <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Produits populaires</CardTitle>
            <CardDescription>
              Les produits les plus vendus ce mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Eau minérale 1.5L", sold: 145, stock: 210 },
                { name: "Jus d'orange 1L", sold: 98, stock: 43 },
                { name: "Eau gazeuse 75cl", sold: 87, stock: 120 },
                { name: "Yaourt nature 125g", sold: 65, stock: 18 },
                { name: "Lait frais 1L", sold: 54, stock: 32 }
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sold} vendus</p>
                  </div>
                  <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    product.stock > 50 ? "bg-green-100 text-green-800" : 
                    product.stock > 20 ? "bg-orange-100 text-orange-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {product.stock} en stock
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <a 
                href="/dashboard/products" 
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Gérer les produits <ChevronRight className="h-3 w-3 ml-1" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Livraisons programmées</CardTitle>
          <CardDescription>
            Les prochaines commandes programmées à livrer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "ORD-012", customer: "Jean Dupont", address: "Abidjan, Cocody", date: "14 mai 2023", frequency: "Hebdomadaire" },
              { id: "ORD-022", customer: "Marie Konan", address: "Abidjan, Plateau", date: "15 mai 2023", frequency: "Mensuelle" },
              { id: "ORD-034", customer: "Karim Ouattara", address: "Abidjan, Yopougon", date: "16 mai 2023", frequency: "Hebdomadaire" },
            ].map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{delivery.customer}</div>
                    <div className="text-xs text-gray-500">{delivery.address}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{delivery.date}</div>
                  <div className="text-xs text-gray-500">Récurrence: {delivery.frequency}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;

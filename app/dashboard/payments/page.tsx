import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, CreditCard, Download, Filter, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const payments = [
  {
    id: "PAY-1234-ABCD",
    orderId: "ORD-7890",
    customer: "Jean Dupont",
    date: "2023-11-15",
    amount: 245.99,
    status: "success",
    method: "credit_card",
    cardInfo: "**** **** **** 4242",
    cardType: "Visa",
  },
  {
    id: "PAY-2345-BCDE",
    orderId: "ORD-7891",
    customer: "Marie Lambert",
    date: "2023-11-15",
    amount: 89.95,
    status: "success",
    method: "paypal",
    cardInfo: "marie.lambert@email.com",
    cardType: "PayPal",
  },
  {
    id: "PAY-3456-CDEF",
    orderId: "ORD-7892",
    customer: "Thomas Martin",
    date: "2023-11-14",
    amount: 145.50,
    status: "failed",
    method: "credit_card",
    cardInfo: "**** **** **** 1111",
    cardType: "Mastercard",
  },
  {
    id: "PAY-4567-DEFG",
    orderId: "ORD-7893",
    customer: "Sophie Petit",
    date: "2023-11-14",
    amount: 59.99,
    status: "processing",
    method: "bank_transfer",
    cardInfo: "FR76 **** **** ****",
    cardType: "Virement",
  },
  {
    id: "PAY-5678-EFGH",
    orderId: "ORD-7894",
    customer: "Lucie Bernard",
    date: "2023-11-13",
    amount: 199.00,
    status: "success",
    method: "credit_card",
    cardInfo: "**** **** **** 5555",
    cardType: "American Express",
  },
  {
    id: "PAY-6789-FGHI",
    orderId: "ORD-7895",
    customer: "Philippe Dubois",
    date: "2023-11-13",
    amount: 34.99,
    status: "refunded",
    method: "paypal",
    cardInfo: "philippe.dubois@email.com",
    cardType: "PayPal",
  },
  {
    id: "PAY-7890-GHIJ",
    orderId: "ORD-7896",
    customer: "Émilie Roux",
    date: "2023-11-12",
    amount: 78.50,
    status: "success",
    method: "credit_card",
    cardInfo: "**** **** **** 9876",
    cardType: "Visa",
  },
];

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "refunded":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Réussi";
      case "failed":
        return "Échoué";
      case "processing":
        return "En cours";
      case "refunded":
        return "Remboursé";
      default:
        return status;
    }
  };

  return <Badge className={getStatusStyle()}>{getStatusText()}</Badge>;
};

// Payment Method Component
const PaymentMethod = ({ method, cardInfo, cardType }: { method: string; cardInfo: string; cardType: string }) => {
  const getMethodIcon = () => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4 mr-2" />;
      case "paypal":
        return <span className="mr-2 text-blue-600 font-semibold">P</span>;
      case "bank_transfer":
        return <span className="mr-2 font-semibold">🏦</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center">
      {getMethodIcon()}
      <div>
        <div className="text-sm font-medium">{cardType}</div>
        <div className="text-xs text-muted-foreground">{cardInfo}</div>
      </div>
    </div>
  );
};

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
};

// Format amount for display
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Paiements</h1>
          <p className="text-muted-foreground">
            Gérez et suivez tous les paiements de la plateforme
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Exporter</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">854,12 €</div>
            <p className="text-xs text-muted-foreground">
              +12,5% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paiements réussis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567,93 €</div>
            <p className="text-xs text-muted-foreground">24 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux de réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94,2%</div>
            <p className="text-xs text-muted-foreground">
              +2,1% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="success">Réussis</TabsTrigger>
            <TabsTrigger value="failed">Échoués</TabsTrigger>
            <TabsTrigger value="refunded">Remboursés</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-[200px] sm:w-[300px] pl-8"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span>Filtrer</span>
            </Button>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Plus récents d'abord</SelectItem>
                <SelectItem value="oldest">Plus anciens d'abord</SelectItem>
                <SelectItem value="amount_high">Montant (décroissant)</SelectItem>
                <SelectItem value="amount_low">Montant (croissant)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">
                      <Button variant="ghost" className="flex items-center gap-1 -ml-4 font-medium">
                        ID <ArrowDownUp className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="flex items-center gap-1 -ml-4 font-medium">
                        Montant <ArrowDownUp className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Mode de paiement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-mono text-xs">{payment.id}</div>
                        <div className="text-xs text-muted-foreground">{payment.orderId}</div>
                      </TableCell>
                      <TableCell>{payment.customer}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell className="font-medium">{formatAmount(payment.amount)}</TableCell>
                      <TableCell>
                        <PaymentMethod 
                          method={payment.method} 
                          cardInfo={payment.cardInfo}
                          cardType={payment.cardType}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={payment.status} />
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                            <DropdownMenuItem>Voir la commande</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Télécharger la facture</DropdownMenuItem>
                            {payment.status === "success" && (
                              <DropdownMenuItem>Initier un remboursement</DropdownMenuItem>
                            )}
                            {payment.status === "failed" && (
                              <DropdownMenuItem>Relancer le paiement</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="success" className="mt-0">
          {/* Similar table with filtered data */}
          <Card>
            <CardContent className="p-4 pt-6">
              <p className="text-center text-muted-foreground">Affichage des paiements réussis uniquement</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="failed" className="mt-0">
          <Card>
            <CardContent className="p-4 pt-6">
              <p className="text-center text-muted-foreground">Affichage des paiements échoués uniquement</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunded" className="mt-0">
          <Card>
            <CardContent className="p-4 pt-6">
              <p className="text-center text-muted-foreground">Affichage des paiements remboursés uniquement</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Search, HelpCircle, BookOpen, FileText, PhoneCall, Mail, ExternalLink } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Types
interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface GuideItem {
  title: string;
  description: string;
  url: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("faq");
  
  const helpCategories: HelpCategory[] = [
    {
      id: "faq",
      title: "Foire Aux Questions",
      description: "Réponses aux questions fréquemment posées",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      id: "guides",
      title: "Guides",
      description: "Tutoriels étape par étape pour utiliser le tableau de bord",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      id: "documentation",
      title: "Documentation",
      description: "Documentation technique complète",
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "contact",
      title: "Contact",
      description: "Besoin d'aide ? Contactez notre équipe de support",
      icon: <PhoneCall className="h-5 w-5" />
    }
  ];
  
  const faqItems: FaqItem[] = [
    {
      question: "Comment ajouter un nouveau produit ?",
      answer: "Pour ajouter un nouveau produit, rendez-vous dans l'onglet 'Produits', puis cliquez sur le bouton 'Ajouter un produit'. Remplissez le formulaire avec toutes les informations requises : nom, description, prix, catégorie, image, etc. N'oubliez pas de définir l'état du stock et la visibilité du produit avant de valider."
    },
    {
      question: "Comment traiter une commande ?",
      answer: "Dans l'onglet 'Commandes', localisez la commande que vous souhaitez traiter. Cliquez sur le bouton 'Modifier' pour accéder aux détails. Vous pouvez ensuite changer le statut de la commande (en préparation, expédiée, livrée), ajouter un numéro de suivi et envoyer des notifications au client."
    },
    {
      question: "Comment configurer les méthodes de paiement ?",
      answer: "Accédez à l'onglet 'Paramètres', puis sélectionnez 'Paiements'. Vous pouvez y activer ou désactiver les différentes méthodes de paiement disponibles, configurer les frais associés et définir les paramètres de sécurité pour chaque méthode."
    },
    {
      question: "Comment gérer les stocks ?",
      answer: "La gestion des stocks se fait dans l'onglet 'Inventaire'. Vous pouvez y voir le niveau de stock de chaque produit, configurer des alertes de stock bas, et effectuer des ajustements manuels de stock. Vous pouvez également importer ou exporter un fichier CSV pour mettre à jour les stocks en masse."
    },
    {
      question: "Comment exporter mes données ?",
      answer: "Dans la plupart des pages (Commandes, Produits, Clients, etc.), vous trouverez un bouton 'Exporter' qui vous permettra de générer un fichier CSV ou Excel contenant les données actuellement affichées. Vous pouvez également configurer des exports automatiques dans les paramètres avancés."
    },
    {
      question: "Comment configurer les emails automatiques ?",
      answer: "Dans l'onglet 'Paramètres', sélectionnez 'Notifications', puis 'Emails'. Vous pourrez y configurer les différents modèles d'emails envoyés automatiquement (confirmation de commande, expédition, rappel de panier abandonné, etc.) et personnaliser leur contenu."
    }
  ];
  
  const guideItems: GuideItem[] = [
    {
      title: "Premiers pas avec Tenga Market",
      description: "Guide d'introduction pour les nouveaux administrateurs",
      url: "/docs/getting-started"
    },
    {
      title: "Gestion efficace du catalogue",
      description: "Comment organiser votre catalogue produits pour maximiser les ventes",
      url: "/docs/catalog-management"
    },
    {
      title: "Configuration des promotions",
      description: "Guide complet sur la création et gestion des promotions",
      url: "/docs/promotions"
    },
    {
      title: "Analyse des performances de vente",
      description: "Comprendre et utiliser les données analytiques pour améliorer vos ventes",
      url: "/docs/analytics"
    },
    {
      title: "Optimisation SEO de votre boutique",
      description: "Comment améliorer le référencement de vos produits",
      url: "/docs/seo-optimization"
    }
  ];
  
  // Filter items based on search query
  const filteredFaqs = searchQuery
    ? faqItems.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqItems;
    
  const filteredGuides = searchQuery
    ? guideItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : guideItems;
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Centre d'aide</h1>
        <p className="text-gray-500">Trouver des réponses à vos questions et apprendre à utiliser Tenga Market</p>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Rechercher dans l'aide..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeCategory === category.id ? 'border-primary ring-1 ring-primary' : ''
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-md font-medium">{category.title}</CardTitle>
              <div className="rounded-full bg-primary/10 p-1 text-primary">
                {category.icon}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dynamic Content Based on Active Category */}
      {activeCategory === 'faq' && (
        <Card>
          <CardHeader>
            <CardTitle>Foire Aux Questions</CardTitle>
            <CardDescription>
              Trouvez rapidement les réponses aux questions les plus fréquentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faqItem, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline text-left">
                      {faqItem.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faqItem.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">Aucun résultat trouvé</h3>
                <p className="mt-2 text-sm text-gray-500">Essayez avec d'autres termes de recherche</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {activeCategory === 'guides' && (
        <Card>
          <CardHeader>
            <CardTitle>Guides et Tutoriels</CardTitle>
            <CardDescription>
              Apprenez à utiliser toutes les fonctionnalités de Tenga Market
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredGuides.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredGuides.map((guide, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="p-4">
                      <h3 className="text-lg font-medium">{guide.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{guide.description}</p>
                      <Button variant="link" className="pl-0 mt-2 flex items-center gap-1">
                        Consulter <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <BookOpen className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">Aucun guide trouvé</h3>
                <p className="mt-2 text-sm text-gray-500">Essayez avec d'autres termes de recherche</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline">Voir tous les guides</Button>
          </CardFooter>
        </Card>
      )}
      
      {activeCategory === 'documentation' && (
        <Card>
          <CardHeader>
            <CardTitle>Documentation Technique</CardTitle>
            <CardDescription>
              Documentation complète de la plateforme Tenga Market
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">API Documentation</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Accédez à la documentation complète de notre API REST pour intégrer vos systèmes externes
                </p>
                <Button variant="outline" className="mt-2 flex gap-1">
                  <FileText className="h-4 w-4" /> Documentation API
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Manuel Administrateur</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Guide complet de toutes les fonctionnalités du tableau de bord administrateur
                </p>
                <Button variant="outline" className="mt-2 flex gap-1">
                  <FileText className="h-4 w-4" /> Télécharger le PDF
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Références Techniques</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Spécifications techniques, architecture et documentation des modèles de données
                </p>
                <Button variant="outline" className="mt-2 flex gap-1">
                  <FileText className="h-4 w-4" /> Consulter
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Notes de Version</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Consultez l'historique des mises à jour et les nouvelles fonctionnalités
                </p>
                <Button variant="outline" className="mt-2 flex gap-1">
                  <FileText className="h-4 w-4" /> Notes de version
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeCategory === 'contact' && (
        <Card>
          <CardHeader>
            <CardTitle>Contactez le Support</CardTitle>
            <CardDescription>
              Notre équipe de support est disponible 7j/7 pour vous aider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">E-mail</h3>
                  <p className="text-sm text-gray-500">
                    Écrivez-nous à <span className="text-primary">support@tengamarket.com</span>
                  </p>
                  <p className="text-xs text-gray-500">Temps de réponse moyen: 1 jour ouvré</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <PhoneCall className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Téléphone</h3>
                  <p className="text-sm text-gray-500">
                    Appelez-nous au <span className="text-primary">+225 07 08 09 10 11</span>
                  </p>
                  <p className="text-xs text-gray-500">Lundi - Vendredi: 8h - 18h</p>
                </div>
              </div>
              
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-md">Formulaire de contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom</label>
                        <Input placeholder="Votre nom" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="votreemail@exemple.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sujet</label>
                      <Input placeholder="Sujet de votre message" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea 
                        className="min-h-[100px] w-full rounded-md border border-gray-300 p-2 text-sm"
                        placeholder="Décrivez votre problème en détail..."
                      />
                    </div>
                    <Button className="w-full">Envoyer le message</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

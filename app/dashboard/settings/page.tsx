"use client";

import { useState } from "react";
import { Save, Bell, Shield, Globe, Mail, User, Briefcase, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Types
interface GeneralSettings {
  shopName: string;
  shopDescription: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  logo: string | null;
}

interface NotificationSettings {
  newOrder: boolean;
  orderStatusChange: boolean;
  lowStock: boolean;
  newCustomer: boolean;
  newReview: boolean;
  deliveryUpdates: boolean;
  marketingTips: boolean;
  securityAlerts: boolean;
}

interface SystemSettings {
  maintenance: boolean;
  debugMode: boolean;
  orderPrefix: string;
  customerPrefix: string;
  productPrefix: string;
  defaultLanguage: string;
  defaultCurrency: string;
  timezone: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'system'>('general');
  
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    shopName: "Tenga Market",
    shopDescription: "Marché en ligne de produits frais et locaux",
    contactEmail: "contact@tengamarket.com",
    phoneNumber: "+225 07 08 09 10 11",
    address: "Abidjan, Cocody, Côte d'Ivoire",
    logo: null
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newOrder: true,
    orderStatusChange: true,
    lowStock: true,
    newCustomer: false,
    newReview: true,
    deliveryUpdates: true,
    marketingTips: false,
    securityAlerts: true
  });
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenance: false,
    debugMode: false,
    orderPrefix: "ORD-",
    customerPrefix: "USR-",
    productPrefix: "PRD-",
    defaultLanguage: "fr",
    defaultCurrency: "XOF",
    timezone: "Africa/Abidjan"
  });

  const handleGeneralSettingsChange = (field: keyof GeneralSettings, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationSettingsChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSystemSettingsChange = (field: keyof SystemSettings, value: string | boolean) => {
    setSystemSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log("Logo upload:", e.target.files);
  };

  const saveSettings = () => {
    // Here you would typically save settings to your backend
    console.log({
      generalSettings,
      notificationSettings,
      systemSettings
    });
    // Show success message
    alert('Paramètres enregistrés avec succès');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-gray-500">Configurez votre tableau de bord et vos préférences</p>
      </div>

      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'general'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('general')}
        >
          <User className="h-4 w-4 inline mr-1" />
          Général
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'notifications'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell className="h-4 w-4 inline mr-1" />
          Notifications
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'system'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('system')}
        >
          <Shield className="h-4 w-4 inline mr-1" />
          Système
        </button>
      </div>

      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Généraux</CardTitle>
            <CardDescription>
              Configurez les informations de base de votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shopName">Nom de la boutique</Label>
                <Input
                  id="shopName"
                  value={generalSettings.shopName}
                  onChange={(e) => handleGeneralSettingsChange('shopName', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contact</Label>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => handleGeneralSettingsChange('contactEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <div className="flex">
                  <Phone className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                  <Input
                    id="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={(e) => handleGeneralSettingsChange('phoneNumber', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <div className="flex">
                  <Briefcase className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                  <Input
                    id="address"
                    value={generalSettings.address}
                    onChange={(e) => handleGeneralSettingsChange('address', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shopDescription">Description de la boutique</Label>
              <Textarea
                id="shopDescription"
                rows={3}
                value={generalSettings.shopDescription}
                onChange={(e) => handleGeneralSettingsChange('shopDescription', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo (optionnel)</Label>
              <div className="flex items-center space-x-4">
                {generalSettings.logo ? (
                  <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center">
                    <img 
                      src={generalSettings.logo} 
                      alt="Logo" 
                      className="max-h-full max-w-full"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                    Logo
                  </div>
                )}
                <div>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format recommandé: JPEG, PNG, SVG. Max 1MB.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les modifications
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardHeader>
            <CardTitle>Préférences de Notifications</CardTitle>
            <CardDescription>
              Configurez les notifications que vous souhaitez recevoir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Notifications de Commandes</h3>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Nouvelles commandes</p>
                  <p className="text-sm text-gray-500">Recevez une notification quand une nouvelle commande est passée</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newOrder}
                    onChange={(e) => handleNotificationSettingsChange('newOrder', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Changements de statut</p>
                  <p className="text-sm text-gray-500">Recevez une notification quand le statut d'une commande change</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.orderStatusChange}
                    onChange={(e) => handleNotificationSettingsChange('orderStatusChange', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Stock faible</p>
                  <p className="text-sm text-gray-500">Recevez une notification quand des produits sont presque épuisés</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStock}
                    onChange={(e) => handleNotificationSettingsChange('lowStock', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Autres Notifications</h3>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Nouveaux clients</p>
                  <p className="text-sm text-gray-500">Recevez une notification quand un nouveau client s'inscrit</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newCustomer}
                    onChange={(e) => handleNotificationSettingsChange('newCustomer', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Nouveaux avis</p>
                  <p className="text-sm text-gray-500">Recevez une notification quand un nouveau commentaire est laissé</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newReview}
                    onChange={(e) => handleNotificationSettingsChange('newReview', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Mises à jour de livraison</p>
                  <p className="text-sm text-gray-500">Recevez une notification pour les mises à jour de livraison</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.deliveryUpdates}
                    onChange={(e) => handleNotificationSettingsChange('deliveryUpdates', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Conseils marketing</p>
                  <p className="text-sm text-gray-500">Recevez des conseils pour améliorer votre boutique</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.marketingTips}
                    onChange={(e) => handleNotificationSettingsChange('marketingTips', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="font-medium">Alertes de sécurité</p>
                  <p className="text-sm text-gray-500">Recevez des alertes concernant la sécurité de votre compte</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={notificationSettings.securityAlerts}
                    onChange={(e) => handleNotificationSettingsChange('securityAlerts', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les préférences
            </Button>
          </CardFooter>
        </Card>
      )}

      {activeTab === 'system' && (
        <Card>
          <CardHeader>
            <CardTitle>Paramètres Système</CardTitle>
            <CardDescription>
              Configurez les paramètres techniques de votre boutique
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                <div className="flex">
                  <Globe className="h-4 w-4 mr-2 mt-3 text-gray-500" />
                  <select
                    id="defaultLanguage"
                    className="form-select w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={systemSettings.defaultLanguage}
                    onChange={(e) => handleSystemSettingsChange('defaultLanguage', e.target.value)}
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                <select
                  id="defaultCurrency"
                  className="form-select w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={systemSettings.defaultCurrency}
                  onChange={(e) => handleSystemSettingsChange('defaultCurrency', e.target.value)}
                >
                  <option value="XOF">Franc CFA (FCFA)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar US ($)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <select
                  id="timezone"
                  className="form-select w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={systemSettings.timezone}
                  onChange={(e) => handleSystemSettingsChange('timezone', e.target.value)}
                >
                  <option value="Africa/Abidjan">Abidjan (GMT+0)</option>
                  <option value="Europe/Paris">Paris (GMT+1)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
              
              <div className="space-y-2 col-span-1 md:col-span-2">
                <h3 className="font-medium">Préfixes identifiants</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="orderPrefix">Commandes</Label>
                    <Input
                      id="orderPrefix"
                      value={systemSettings.orderPrefix}
                      onChange={(e) => handleSystemSettingsChange('orderPrefix', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="customerPrefix">Clients</Label>
                    <Input
                      id="customerPrefix"
                      value={systemSettings.customerPrefix}
                      onChange={(e) => handleSystemSettingsChange('customerPrefix', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="productPrefix">Produits</Label>
                    <Input
                      id="productPrefix"
                      value={systemSettings.productPrefix}
                      onChange={(e) => handleSystemSettingsChange('productPrefix', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <h3 className="font-medium">Options système avancées</h3>
              
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Mode maintenance</p>
                  <p className="text-sm text-gray-500">Activez pour afficher une page de maintenance aux utilisateurs</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenance}
                    onChange={(e) => handleSystemSettingsChange('maintenance', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pb-2">
                <div>
                  <p className="font-medium">Mode débogage</p>
                  <p className="text-sm text-gray-500">Activez pour afficher les informations détaillées d'erreur (uniquement pour les administrateurs)</p>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={systemSettings.debugMode}
                    onChange={(e) => handleSystemSettingsChange('debugMode', e.target.checked)}
                    className="rounded text-primary h-4 w-4"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Réinitialiser aux paramètres par défaut
            </Button>
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les paramètres
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

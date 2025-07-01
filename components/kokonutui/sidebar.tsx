"use client";

import {
    BarChart2,
    ShoppingBag,
    Package,
    CreditCard,
    Truck,
    Users2,
    MessageCircle,
    Settings,
    HelpCircle,
    Menu,
    Boxes,
    FileText,
    Activity,
    Calendar,
} from "lucide-react";

import { Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    function handleNavigation() {
        setIsMobileMenuOpen(false);
    }

    function NavItem({
        href,
        icon: Icon,
        children,
    }: {
        href: string;
        icon: React.ElementType;
        children: React.ReactNode;
    }) {
        const isActive = pathname === href;
        
        return (
            <Link
                href={href}
                onClick={handleNavigation}
                className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                        ? "bg-gray-100 text-gray-900 dark:bg-[#1F1F23] dark:text-white font-medium" 
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                )}
            >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                {children}
            </Link>
        );
    }

    return (
        <>
            <button
                type="button"
                className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu de navigation"
                title="Ouvrir le menu"
            >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <nav
                className={cn(
                    "fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out",
                    "lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    <Link
                        href="/dashboard"
                        className="h-16 px-6 flex items-center border-b border-gray-200 dark:border-[#1F1F23]"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                                Tenga Market
                            </span>
                        </div>
                    </Link>

                    <div className="flex-1 overflow-y-auto py-4 px-4">
                        <div className="space-y-6">
                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Général
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard" icon={Home}>
                                        Tableau de bord
                                    </NavItem>
                                    <NavItem href="/dashboard/analytics" icon={BarChart2}>
                                        Statistiques
                                    </NavItem>
                                    <NavItem href="/dashboard/calendar" icon={Calendar}>
                                        Calendrier
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Catalogue
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/products" icon={Package}>
                                        Produits
                                    </NavItem>
                                    <NavItem href="/dashboard/categories" icon={Boxes}>
                                        Catégories
                                    </NavItem>
                                    <NavItem href="/dashboard/inventory" icon={ShoppingBag}>
                                        Stock
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Ventes
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/orders" icon={FileText}>
                                        Commandes
                                    </NavItem>
                                    <NavItem href="/dashboard/deliveries" icon={Truck}>
                                        Livraisons
                                    </NavItem>
                                    <NavItem href="/dashboard/payments" icon={CreditCard}>
                                        Paiements
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Clients
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/customers" icon={Users2}>
                                        Utilisateurs
                                    </NavItem>
                                    <NavItem href="/dashboard/feedback" icon={MessageCircle}>
                                        Avis & Commentaires
                                    </NavItem>
                                    <NavItem href="/dashboard/claims" icon={Activity}>
                                        Réclamations
                                    </NavItem>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
                        <div className="space-y-1">
                            <NavItem href="/dashboard/settings" icon={Settings}>
                                Paramètres
                            </NavItem>
                            <NavItem href="/dashboard/help" icon={HelpCircle}>
                                Aide
                            </NavItem>
                        </div>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, PlusCircle } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Livraison Produits Saisonniers",
    date: "2023-11-15",
    time: "09:00 - 12:00",
    type: "delivery",
    description: "Arrivée des produits saisonniers pour les fêtes",
    location: "Entrepôt principal"
  },
  {
    id: 2,
    title: "Réunion Équipe Marketing",
    date: "2023-11-15",
    time: "14:00 - 15:30",
    type: "meeting",
    description: "Discussion sur la stratégie marketing Q4",
    location: "Salle de conférence A"
  },
  {
    id: 3,
    title: "Lancement Campagne Promotionnelle",
    date: "2023-11-16",
    time: "10:00 - 18:00",
    type: "event",
    description: "Lancement de la campagne Black Friday",
    location: "En ligne"
  },
  {
    id: 4,
    title: "Inventaire Mensuel",
    date: "2023-11-18",
    time: "08:00 - 17:00",
    type: "inventory",
    description: "Inventaire complet des produits en stock",
    location: "Tous les entrepôts"
  },
  {
    id: 5,
    title: "Maintenance Site Web",
    date: "2023-11-19",
    time: "22:00 - 02:00",
    type: "maintenance",
    description: "Mise à jour du système et maintenance",
    location: "En ligne"
  }
];

// Group events by date
const eventsByDate = events.reduce((acc, event) => {
  const date = event.date;
  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(event);
  return acc;
}, {} as Record<string, typeof events>);

// Get type badge style
const getTypeBadge = (type: string) => {
  switch (type) {
    case "delivery":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "meeting":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "event":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inventory":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    case "maintenance":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendrier</h1>
          <p className="text-muted-foreground">
            Gérez les événements, les livraisons et les réunions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Ajouter un événement</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {/* Mini Calendar View */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Novembre 2023</CardTitle>
            <CardDescription>Calendrier du mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              <div className="text-xs font-medium text-muted-foreground">Lun</div>
              <div className="text-xs font-medium text-muted-foreground">Mar</div>
              <div className="text-xs font-medium text-muted-foreground">Mer</div>
              <div className="text-xs font-medium text-muted-foreground">Jeu</div>
              <div className="text-xs font-medium text-muted-foreground">Ven</div>
              <div className="text-xs font-medium text-muted-foreground">Sam</div>
              <div className="text-xs font-medium text-muted-foreground">Dim</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Week 1 */}
              <div className="text-muted-foreground p-2 text-xs">30</div>
              <div className="text-muted-foreground p-2 text-xs">31</div>
              <div className="p-2 text-xs">1</div>
              <div className="p-2 text-xs">2</div>
              <div className="p-2 text-xs">3</div>
              <div className="p-2 text-xs">4</div>
              <div className="p-2 text-xs">5</div>
              
              {/* Week 2 */}
              <div className="p-2 text-xs">6</div>
              <div className="p-2 text-xs">7</div>
              <div className="p-2 text-xs">8</div>
              <div className="p-2 text-xs">9</div>
              <div className="p-2 text-xs">10</div>
              <div className="p-2 text-xs">11</div>
              <div className="p-2 text-xs">12</div>
              
              {/* Week 3 */}
              <div className="p-2 text-xs">13</div>
              <div className="p-2 text-xs">14</div>
              <div className="p-2 text-xs rounded-full bg-primary text-primary-foreground">15</div>
              <div className="p-2 text-xs relative">
                16
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
              </div>
              <div className="p-2 text-xs">17</div>
              <div className="p-2 text-xs relative">
                18
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>
              </div>
              <div className="p-2 text-xs relative">
                19
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
              </div>
              
              {/* Week 4 */}
              <div className="p-2 text-xs">20</div>
              <div className="p-2 text-xs">21</div>
              <div className="p-2 text-xs">22</div>
              <div className="p-2 text-xs">23</div>
              <div className="p-2 text-xs">24</div>
              <div className="p-2 text-xs">25</div>
              <div className="p-2 text-xs">26</div>
              
              {/* Week 5 */}
              <div className="p-2 text-xs">27</div>
              <div className="p-2 text-xs">28</div>
              <div className="p-2 text-xs">29</div>
              <div className="p-2 text-xs">30</div>
              <div className="text-muted-foreground p-2 text-xs">1</div>
              <div className="text-muted-foreground p-2 text-xs">2</div>
              <div className="text-muted-foreground p-2 text-xs">3</div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full flex justify-between text-sm text-muted-foreground">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <span>Précédent</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <span>Aujourd'hui</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <span>Suivant</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Upcoming Events */}
        <Card className="md:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg">Événements à venir</CardTitle>
            <CardDescription>Prochains événements planifiés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(eventsByDate).map(([date, dayEvents]) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">{formatDate(date)}</h3>
                </div>
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <div className="border-l-4 border-primary h-full">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{event.title}</h4>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{event.time}</span>
                                <span>•</span>
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <Badge className={getTypeBadge(event.type)}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              Voir tous les événements
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

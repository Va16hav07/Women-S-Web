export interface TravelRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  safetyScore: number; // 1-10
  lightingCondition: string;
  timeOfDay: string;
  created: number; // timestamp
  favorite: boolean;
  notes?: string;
}

export class TravelRecommendationService {
  private storageKey = 'safeher_saved_routes';
  
  /**
   * Save a route to local storage
   * @param route The route to save
   */
  public saveRoute(route: Omit<TravelRoute, 'id' | 'created' | 'favorite'>): TravelRoute {
    const savedRoutes = this.getSavedRoutes();
    
    const newRoute: TravelRoute = {
      ...route,
      id: this.generateId(),
      created: Date.now(),
      favorite: false
    };
    
    savedRoutes.push(newRoute);
    localStorage.setItem(this.storageKey, JSON.stringify(savedRoutes));
    
    return newRoute;
  }
  
  /**
   * Get all saved routes
   */
  public getSavedRoutes(): TravelRoute[] {
    const routesJson = localStorage.getItem(this.storageKey);
    return routesJson ? JSON.parse(routesJson) : [];
  }
  
  /**
   * Delete a route by ID
   * @param id Route ID to delete
   * @returns True if deleted successfully
   */
  public deleteRoute(id: string): boolean {
    const routes = this.getSavedRoutes();
    const initialLength = routes.length;
    const filteredRoutes = routes.filter(route => route.id !== id);
    
    if (filteredRoutes.length !== initialLength) {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRoutes));
      return true;
    }
    
    return false;
  }
  
  /**
   * Update an existing route
   * @param route Route with updated fields
   * @returns Updated route or null if not found
   */
  public updateRoute(route: TravelRoute): TravelRoute | null {
    const routes = this.getSavedRoutes();
    const index = routes.findIndex(r => r.id === route.id);
    
    if (index !== -1) {
      routes[index] = { ...routes[index], ...route };
      localStorage.setItem(this.storageKey, JSON.stringify(routes));
      return routes[index];
    }
    
    return null;
  }
  
  /**
   * Toggle favorite status of a route
   * @param id Route ID
   * @returns Updated route or null if not found
   */
  public toggleFavorite(id: string): TravelRoute | null {
    const routes = this.getSavedRoutes();
    const index = routes.findIndex(r => r.id === id);
    
    if (index !== -1) {
      routes[index].favorite = !routes[index].favorite;
      localStorage.setItem(this.storageKey, JSON.stringify(routes));
      return routes[index];
    }
    
    return null;
  }
  
  /**
   * Get recommended routes based on current conditions
   * @param from Starting location (optional)
   * @param to Destination (optional)
   * @param timeOfDay Current time of day (optional)
   * @returns Filtered and sorted recommended routes
   */
  public getRecommendations(
    from?: string,
    to?: string,
    timeOfDay?: string
  ): TravelRoute[] {
    const routes = this.getSavedRoutes();
    
    // Filter based on provided criteria
    const filtered = routes.filter(route => {
      const matchesFrom = !from || route.from.toLowerCase().includes(from.toLowerCase());
      const matchesTo = !to || route.to.toLowerCase().includes(to.toLowerCase());
      const matchesTime = !timeOfDay || route.timeOfDay === timeOfDay;
      
      return matchesFrom && matchesTo && matchesTime;
    });
    
    // Sort by safety score (descending) and then by favorited status
    return filtered.sort((a, b) => {
      if (a.favorite !== b.favorite) {
        return a.favorite ? -1 : 1;
      }
      return b.safetyScore - a.safetyScore;
    });
  }
  
  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  }
}

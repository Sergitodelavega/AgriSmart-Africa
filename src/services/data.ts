export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  location: string;
}

export const weatherService = {
  async getWeather(location: string): Promise<WeatherData> {
    // Simulating a weather API
    await new Promise(r => setTimeout(r, 500));
    return {
      temp: 28 + Math.floor(Math.random() * 5),
      condition: ['Ensoleillé', 'Partiellement nuageux', 'Pluie possible'][Math.floor(Math.random() * 3)],
      humidity: 65 + Math.floor(Math.random() * 10),
      location: location || 'Abidjan, CI'
    };
  }
};

export const translations = {
  fr: {
    welcome: 'Bienvenue sur AgriSmart',
    dashboard: 'Tableau de Bord',
    ia_diagnostic: 'Diagnostic IA',
    marketplace: 'Marché',
    profile: 'Profil',
    advice: 'Conseils',
    community: 'Communauté',
    weather: 'Météo',
    health_score: 'Score de Santé',
    recent_diagnostics: 'Diagnostics récents',
    active_listings: 'Mes annonces',
    add_product: 'Ajouter un produit',
    search_crops: 'Rechercher une culture',
    diagnostic_tool: 'Outil de Diagnostic',
    take_photo: 'Prendre une photo',
    upload_photo: 'Charger une photo',
    diagnosing: 'Analyse en cours...',
    result: 'Résultat',
    recommendations: 'Recommandations',
    login: 'Connexion',
    register: 'S\'inscrire',
    logout: 'Déconnexion',
    my_farm: 'Ma Ferme',
    languages: 'Langues'
  },
  en: {
    welcome: 'Welcome to AgriSmart',
    dashboard: 'Dashboard',
    ia_diagnostic: 'AI Diagnostic',
    marketplace: 'Marketplace',
    profile: 'Profile',
    advice: 'Advice',
    community: 'Community',
    weather: 'Weather',
    health_score: 'Health Score',
    recent_diagnostics: 'Recent Diagnostics',
    active_listings: 'My Listings',
    add_product: 'Add Product',
    search_crops: 'Search Crops',
    diagnostic_tool: 'Diagnostic Tool',
    take_photo: 'Take Photo',
    upload_photo: 'Upload Photo',
    diagnosing: 'Diagnosing...',
    result: 'Result',
    recommendations: 'Recommendations',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    my_farm: 'My Farm',
    languages: 'Languages'
  }
};

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-800">🐎 Equi Saddles</h1>
            </div>
            <nav className="flex space-x-6">
              <a href="/administrateur" className="text-amber-700 hover:text-amber-900 font-medium">
                Administration
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
            Selles d'Excellence
          </h1>
          <p className="text-xl md:text-2xl text-amber-700 mb-8 max-w-3xl mx-auto">
            Découvrez notre collection de selles artisanales pour toutes les disciplines équestres
          </p>
          
          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">✅</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Application Fonctionnelle</h3>
              <p className="text-gray-600">Backend et serveur opérationnels</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Admin Accessible</h3>
              <p className="text-gray-600">Gestion des produits et commandes</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-2">🛠️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">En Développement</h3>
              <p className="text-gray-600">Interface client en cours</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/administrateur" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Accéder à l'Administration
            </a>
            
            <div className="bg-gray-200 text-gray-500 px-8 py-3 rounded-lg font-semibold cursor-not-allowed">
              Boutique (Bientôt Disponible)
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">État Technique</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 mb-2">✓ Fonctionnel</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Serveur Express sur port 5000</li>
                <li>• Base de données PostgreSQL</li>
                <li>• APIs produits et commandes</li>
                <li>• Interface d'administration</li>
                <li>• Système de paiement Stripe</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-orange-600 mb-2">⚠️ En cours</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Système multilingue</li>
                <li>• Gestion du panier</li>
                <li>• Navigation client</li>
                <li>• Pages boutique</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
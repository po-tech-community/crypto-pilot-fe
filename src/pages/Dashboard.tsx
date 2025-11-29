import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const cryptos = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 90000, change: 1.8, holdings: 0.15 },
    { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3000, change: -2.1, holdings: 2.5 },
    { id: 3, name: 'XRP', symbol: 'XRP', price: 2.10, change: 12.5, holdings: 1500 },
    { id: 4, name: 'Solana', symbol: 'SOL', price: 135, change: -3.4, holdings: 8 },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back!</p>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$18,850</p>
              <p className="text-green-600 text-sm mt-2">+7.0% ($1,240)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">24h Change</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">+$485</p>
              <p className="text-gray-500 text-sm mt-2">+2.6% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{cryptos.length}</p>
              <p className="text-gray-500 text-sm mt-2">Cryptocurrencies</p>
            </CardContent>
          </Card>

        </div>

        {/* Holdings List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            
            {cryptos.map((crypto) => {
              const isPositive = crypto.change >= 0;
              
              let textColor = '';
              if (isPositive) {
                textColor = 'text-green-600';
              } else {
                textColor = 'text-red-600';
              }
              
              let sign = '';
              if (isPositive) {
                sign = '+';
              }
              
              return (
                <div key={crypto.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded">
                  <div>
                    <p className="font-bold">{crypto.name}</p>
                    <p className="text-sm text-gray-500">{crypto.holdings} {crypto.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${crypto.price.toLocaleString()}</p>
                    <p className={`text-sm ${textColor}`}>
                      {sign}{crypto.change}%
                    </p>
                  </div>
                </div>
              );
            })}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
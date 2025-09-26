import React, { useState } from "react";

const PriceCalculator = () => {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [portfolios, setPortfolios] = useState(5);
  const [customDomain, setCustomDomain] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [support, setSupport] = useState("standard");
  const [storage, setStorage] = useState(10);

  const plans = {
    free: {
      name: "Free",
      basePrice: 0,
      portfolios: 3,
      storage: 1,
      customDomain: false,
      analytics: false,
      support: "community",
    },
    pro: {
      name: "Pro",
      basePrice: 15,
      portfolios: 10,
      storage: 50,
      customDomain: true,
      analytics: true,
      support: "standard",
    },
    business: {
      name: "Business",
      basePrice: 39,
      portfolios: 50,
      storage: 200,
      customDomain: true,
      analytics: true,
      support: "priority",
    },
    enterprise: {
      name: "Enterprise",
      basePrice: 99,
      portfolios: "unlimited",
      storage: 1000,
      customDomain: true,
      analytics: true,
      support: "dedicated",
    },
  };

  const calculatePrice = () => {
    let totalPrice = plans[selectedPlan].basePrice;

    // Additional portfolios
    if (
      selectedPlan !== "enterprise" &&
      portfolios > plans[selectedPlan].portfolios
    ) {
      const extraPortfolios = portfolios - plans[selectedPlan].portfolios;
      totalPrice += extraPortfolios * 2;
    }

    // Additional storage
    if (storage > plans[selectedPlan].storage) {
      const extraStorage = storage - plans[selectedPlan].storage;
      totalPrice += Math.ceil(extraStorage / 10) * 3;
    }

    // Premium features
    if (customDomain && !plans[selectedPlan].customDomain) {
      totalPrice += 5;
    }
    if (analytics && !plans[selectedPlan].analytics) {
      totalPrice += 8;
    }

    // Priority support
    if (
      support === "priority" &&
      plans[selectedPlan].support !== "priority" &&
      plans[selectedPlan].support !== "dedicated"
    ) {
      totalPrice += 10;
    }

    return totalPrice;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pricing Calculator
        </h1>
        <p className="text-lg text-gray-600">
          Calculate your custom pricing based on your needs
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Build Your Plan
            </h3>
            <p className="text-gray-600">
              Customize your subscription to fit your needs
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Estimated Monthly Cost</p>
            <p className="text-4xl font-bold text-black">${calculatePrice()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Select Base Plan
            </h4>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedPlan === key
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        {plan.name}
                      </h5>
                      <p className="text-sm text-gray-600">
                        {typeof plan.portfolios === "number"
                          ? `${plan.portfolios} portfolios`
                          : "Unlimited portfolios"}{" "}
                        • {plan.storage}GB storage
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      ${plan.basePrice}/mo
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Customize Your Plan
            </h4>

            {/* Portfolios */}
            {selectedPlan !== "enterprise" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Portfolios: {portfolios}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={portfolios}
                  onChange={(e) => setPortfolios(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>100</span>
                </div>
                {portfolios > plans[selectedPlan].portfolios && (
                  <p className="text-sm text-blue-600 mt-1">
                    +${(portfolios - plans[selectedPlan].portfolios) * 2}/mo for{" "}
                    {portfolios - plans[selectedPlan].portfolios} extra
                    portfolios
                  </p>
                )}
              </div>
            )}

            {/* Storage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage: {storage}GB
              </label>
              <input
                type="range"
                min="1"
                max="500"
                step="10"
                value={storage}
                onChange={(e) => setStorage(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1GB</span>
                <span>500GB</span>
              </div>
              {storage > plans[selectedPlan].storage && (
                <p className="text-sm text-blue-600 mt-1">
                  +$
                  {Math.ceil((storage - plans[selectedPlan].storage) / 10) * 3}
                  /mo for {storage - plans[selectedPlan].storage}GB extra
                  storage
                </p>
              )}
            </div>

            {/* Custom Domain */}
            {!plans[selectedPlan].customDomain && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Custom Domain
                  </label>
                  <p className="text-xs text-gray-500">
                    Use your own domain name
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={customDomain}
                    onChange={(e) => setCustomDomain(e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  {customDomain && (
                    <span className="text-sm text-blue-600 ml-2">+$5/mo</span>
                  )}
                </div>
              </div>
            )}

            {/* Analytics */}
            {!plans[selectedPlan].analytics && (
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Advanced Analytics
                  </label>
                  <p className="text-xs text-gray-500">
                    Detailed visitor insights
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  {analytics && (
                    <span className="text-sm text-blue-600 ml-2">+$8/mo</span>
                  )}
                </div>
              </div>
            )}

            {/* Support Level */}
            {plans[selectedPlan].support !== "priority" &&
              plans[selectedPlan].support !== "dedicated" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Level
                  </label>
                  <select
                    value={support}
                    onChange={(e) => setSupport(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="standard">Standard Support (Free)</option>
                    <option value="priority">Priority Support (+$10/mo)</option>
                  </select>
                </div>
              )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Price Breakdown
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                {plans[selectedPlan].name} Plan
              </span>
              <span className="font-medium">
                ${plans[selectedPlan].basePrice}/mo
              </span>
            </div>
            {selectedPlan !== "enterprise" &&
              portfolios > plans[selectedPlan].portfolios && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Extra Portfolios (
                    {portfolios - plans[selectedPlan].portfolios})
                  </span>
                  <span className="font-medium">
                    ${(portfolios - plans[selectedPlan].portfolios) * 2}/mo
                  </span>
                </div>
              )}
            {storage > plans[selectedPlan].storage && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Extra Storage ({storage - plans[selectedPlan].storage}GB)
                </span>
                <span className="font-medium">
                  ${Math.ceil((storage - plans[selectedPlan].storage) / 10) * 3}
                  /mo
                </span>
              </div>
            )}
            {customDomain && !plans[selectedPlan].customDomain && (
              <div className="flex justify-between">
                <span className="text-gray-600">Custom Domain</span>
                <span className="font-medium">$5/mo</span>
              </div>
            )}
            {analytics && !plans[selectedPlan].analytics && (
              <div className="flex justify-between">
                <span className="text-gray-600">Advanced Analytics</span>
                <span className="font-medium">$8/mo</span>
              </div>
            )}
            {support === "priority" &&
              plans[selectedPlan].support !== "priority" &&
              plans[selectedPlan].support !== "dedicated" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority Support</span>
                  <span className="font-medium">$10/mo</span>
                </div>
              )}
            <div className="border-t border-gray-300 pt-2 mt-3 flex justify-between text-lg font-bold">
              <span>Total Monthly Cost</span>
              <span>${calculatePrice()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Upgrade to This Plan
          </button>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Save Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;

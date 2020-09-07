using ExchangeRateServiceClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public class CurrencyConverter : ICurrencyConverter
    {
        readonly IExchangeRatesProvider _exchangeRateClient;
        public CurrencyConverter(IExchangeRatesProvider exchangeRateServiceClient)
        {
            _exchangeRateClient = exchangeRateServiceClient;
        }
        private async Task<double> GetConversionRate(string baseCurrency, string targetCurrency)
        {
            var ratesResponse = await _exchangeRateClient.GetRates(baseCurrency);
            ratesResponse.Rates.TryGetValue(targetCurrency, out double conversionRate);

            return conversionRate;
        }

        public async Task Convert(RoiCalculationResult roi, string baseCurrency, string targetCurrency)
        {
            var conversionRate = await GetConversionRate(baseCurrency, targetCurrency);
            roi.Currency = targetCurrency;
            roi.Total *= conversionRate;
            roi.Fees *= conversionRate;
        }
    }
}

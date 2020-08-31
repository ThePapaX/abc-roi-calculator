using ExchangeRatesService;
using System.Threading.Tasks;

namespace ExchangeRateServiceClient
{
    interface IExchangeRatesProvider
    {
        Task<RatesResponse> GetRates(string baseCurrency);
    }
}

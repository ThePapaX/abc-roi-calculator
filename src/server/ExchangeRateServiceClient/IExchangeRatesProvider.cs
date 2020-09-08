using ExchangeRatesService;
using System.Threading.Tasks;

namespace ExchangeRateServiceClient
{
    public interface IExchangeRatesProvider
    {
        Task<RatesResponse> GetRates(string baseCurrency);
    }
}
using Grpc.Core;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace ExchangeRatesService
{
    public class FxResponse
    {
        public string Date { get; set; }
        public string Base { get; set; }
        public Dictionary<string, double> Rates { get; set; }
    }

    public class ExchangeRatesService : ExchangeRatesProvider.ExchangeRatesProviderBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ExchangeRatesService> _logger;

        public ExchangeRatesService(IHttpClientFactory httpClientFactory, ILogger<ExchangeRatesService> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        public override async Task<RatesResponse> GetRates(RatesRequest request, ServerCallContext context)
        {
            var serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var httpClient = _httpClientFactory.CreateClient("ExchangeRateHttpClient");
            var uri = $"https://api.exchangeratesapi.io/latest?base={request.BaseCurrency}";

            var apiResponse = await httpClient.GetFromJsonAsync<FxResponse>(uri, serializeOptions);

            var result = new RatesResponse() { BaseCurrency = request.BaseCurrency, Date = apiResponse.Date };
            result.Rates.Add(apiResponse.Rates);

            //TODO: cache this result.

            return result;
        }
    }
}
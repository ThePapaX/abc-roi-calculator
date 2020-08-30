using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using Microsoft.Extensions.Logging;

namespace ExchangeRatesService
{
    public class ExchangeRatesService : ExchangeRatesProvider.ExchangeRatesProviderBase
    {
        private readonly ILogger<ExchangeRatesService> _logger;
        public ExchangeRatesService(ILogger<ExchangeRatesService> logger)
        {
            _logger = logger;
        }

        public override Task<RatesResponse> GetRates(RatesRequest request, ServerCallContext context)
        {
            // External service call here.
            return Task.FromResult(new RatesResponse
            {
                BaseCurrency = "USD",
            });
        }
    }
}

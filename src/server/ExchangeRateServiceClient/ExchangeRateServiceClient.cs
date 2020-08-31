using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Text;
using ExchangeRatesService;
using System.Threading.Tasks;
using Grpc.Net.Client;

namespace ExchangeRateServiceClient
{
    public class ExchangeRateServiceClient : IExchangeRatesProvider
    {
        private readonly GrpcChannel _channel;
        private readonly ExchangeRatesProvider.ExchangeRatesProviderClient _grpcClient;
        public ExchangeRateServiceClient(string connectionString  = "https://localhost:50051")
        {

            _channel = GrpcChannel.ForAddress(connectionString);
            _grpcClient = new ExchangeRatesProvider.ExchangeRatesProviderClient(_channel);
        }
        public async Task<RatesResponse> GetRates(string baseCurrency)
        {
            var grpcRequest = new RatesRequest() { BaseCurrency = baseCurrency };

            return await _grpcClient.GetRatesAsync(grpcRequest);
        }
    }
}

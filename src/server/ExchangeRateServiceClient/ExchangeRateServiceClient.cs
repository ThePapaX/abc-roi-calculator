using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Text;
using ExchangeRatesService;
using System.Threading.Tasks;
using Grpc.Net.Client;
using System.Net.Http;

namespace ExchangeRateServiceClient
{
    public class ExchangeRateServiceClient : IExchangeRatesProvider
    {
        private readonly GrpcChannel _channel;
        private readonly ExchangeRatesProvider.ExchangeRatesProviderClient _grpcClient;
        public ExchangeRateServiceClient(string connectionString  = "https://exchange-rates-service")
        {

        var httpHandler = new HttpClientHandler();
        // Return `true` to allow certificates that are untrusted/invalid
        httpHandler.ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator;

            _channel = GrpcChannel.ForAddress(connectionString, new GrpcChannelOptions { HttpHandler = httpHandler });
            _grpcClient = new ExchangeRatesProvider.ExchangeRatesProviderClient(_channel);
        }

        ~ExchangeRateServiceClient()
        {
            _channel.ShutdownAsync().Wait();
        }
        public async Task<RatesResponse> GetRates(string baseCurrency)
        {
            var grpcRequest = new RatesRequest() { BaseCurrency = baseCurrency };

            return await _grpcClient.GetRatesAsync(grpcRequest);
        }
    }
}

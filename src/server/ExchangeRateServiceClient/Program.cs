using ExchangeRatesService;
using Grpc.Core;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace ExchangeRateServiceClient
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var currency = "USD";
            var exchangeRateClient = new ExchangeRateServiceClient("https://localhost:50051");
            RatesResponse result = await exchangeRateClient.GetRates(currency);

            Console.WriteLine(JsonSerializer.Serialize(result, new JsonSerializerOptions() { WriteIndented = true }));

        }
    }
}

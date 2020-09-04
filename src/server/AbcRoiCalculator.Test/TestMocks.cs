using AbcRoiCalculatorApp.Models;
using ExchangeRateServiceClient;
using ExchangeRatesService;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AbcRoiCalculator.Test
{
    internal static class TestMocks
    {
       

        public static IExchangeRatesProvider GrpcClientMock()
        {
            var mockFX = new Mock<IExchangeRatesProvider>();
            mockFX.Setup(instance => instance.GetRates(It.IsAny<string>())).Returns(() =>
            {
                var ratesResponse = new RatesResponse()
                {
                    BaseCurrency = TestConstants.BaseCurrency,

                };
                var rates = new Dictionary<string, double>()
                {
                    { TestConstants.TargetCurrency , TestConstants.AudUsdConversionRate }
                };
                ratesResponse.Rates.Add(rates);

                return Task.FromResult(ratesResponse);

            });

            return mockFX.Object;
        }

    }
}

using AbcRoiCalculatorApp.Models;
using ExchangeRateServiceClient;
using ExchangeRatesService;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace AbcRoiCalculator.Test
{
    class CurrencyConverterTests
    {
        private const double _audUsdConversionRate = 0.75;
        private const string _baseCurrency = "AUD";
        private const string _targetCurrency = "USD";
        private static IExchangeRatesProvider GetGrpcClientMock()
        {
            var mockFX = new Mock<IExchangeRatesProvider>();
            mockFX.Setup(instance => instance.GetRates(It.IsAny<string>())).Returns(() =>
            {
                var ratesResponse = new RatesResponse()
                {
                    BaseCurrency = _baseCurrency,

                };
                var rates = new Dictionary<string, double>()
                {
                    { _targetCurrency , _audUsdConversionRate }
                };
                ratesResponse.Rates.Add(rates);

                return Task.FromResult(ratesResponse);

            });

            return mockFX.Object;
        }

        [Test]
        public void CanBeInstantiated()
        {
            // Arrange
            var grpcClientMock = GetGrpcClientMock();

            // Act
            var currencyConverter = new CurrencyConverter(grpcClientMock);

            // Assert
            Assert.Pass();
        }

        [Test]
        public async Task ConvertsCurrency()
        {
            // Arrange
            var grpcClientMock = GetGrpcClientMock();

            // Act
            var currencyConverter = new CurrencyConverter(grpcClientMock);
            
            const double expectedTotalRoi = 750;
            const double expectedTotalFees = 75;

            var roiResult = new RoiCalculationResult() {
                Currency = _baseCurrency,
                Total = 1000,
                Fees = 100,
            };


            await currencyConverter.Convert(roiResult, _baseCurrency, _targetCurrency);

            // Assert
            Assert.AreEqual(roiResult.Total, expectedTotalRoi);
            Assert.AreEqual(roiResult.Fees, expectedTotalFees);
        }
    }
}

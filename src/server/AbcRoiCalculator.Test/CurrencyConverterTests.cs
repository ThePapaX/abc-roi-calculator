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

        [Test]
        public void CanBeInstantiated()
        {
            // Arrange
            var grpcClientMock = TestMocks.GrpcClientMock();

            // Act
            var currencyConverter = new CurrencyConverter(grpcClientMock);

            // Assert
            Assert.Pass();
        }

        [Test]
        public async Task ConvertsCurrency()
        {
            // Arrange
            var grpcClientMock = TestMocks.GrpcClientMock();

            // Act
            var currencyConverter = new CurrencyConverter(grpcClientMock);
            
            const double expectedTotalRoi = 750;
            const double expectedTotalFees = 75;

            var roiResult = new RoiCalculationResult() {
                Currency = TestConstants.BaseCurrency,
                Total = 1000,
                Fees = 100,
            };


            await currencyConverter.Convert(roiResult, TestConstants.BaseCurrency, TestConstants.TargetCurrency);

            // Assert
            Assert.AreEqual(roiResult.Total, expectedTotalRoi);
            Assert.AreEqual(roiResult.Fees, expectedTotalFees);
        }
    }
}

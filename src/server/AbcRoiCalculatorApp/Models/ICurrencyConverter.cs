using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public interface ICurrencyConverter
    {
        Task Convert(RoiCalculationResult roi, string baseCurrency, string targetCurrency);
    }
}
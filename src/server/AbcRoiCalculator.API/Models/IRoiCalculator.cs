using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public interface IRoiCalculator
    {
        Task<RoiCalculationResult> Calculate(RoiCalculationRequest request);
    }
}
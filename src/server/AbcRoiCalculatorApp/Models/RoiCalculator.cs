using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AbcRoiCalculatorApp.Models
{
    public static class RoiCalculator
    {
        public static async Task<RoiCalculationResult> Calculate(RoiCalculationRequest request)
        {
            return new RoiCalculationResult();
        }
    }
}

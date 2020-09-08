using AbcRoiCalculatorApp.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AbcRoiCalculatorApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoiController : ControllerBase
    {
        private readonly IBusinessRules _roiConfiguration;
        private readonly IRoiCalculator _roiCalculator;

        public RoiController(IBusinessRules roiConfiguration, IRoiCalculator roiCalculatorInstance)
        {
            _roiCalculator = roiCalculatorInstance;
            _roiConfiguration = roiConfiguration;
        }

        // GET: api/roi
        [HttpGet]
        public IEnumerable<InvestmentOptionBase> GetOptions()
        {
            return _roiConfiguration.InvestmentBusinessRules;
        }

        // POST api/roi/calculate
        [HttpPost("calculate")]
        public async Task<RoiCalculationResult> Calculate([FromBody] RoiCalculationRequest request)
        {
            return await _roiCalculator.Calculate(request);
        }
    }
}
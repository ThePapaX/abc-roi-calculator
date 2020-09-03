using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using AbcRoiCalculatorApp.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AbcRoiCalculatorApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoiController : ControllerBase
    {
        readonly IBusinessRules _roiConfiguration;
        readonly IRoiCalculator _roiCalculator;
        public RoiController(IBusinessRules roiConfiguration, IRoiCalculator roiCalculatorInstance)
        {
            _roiCalculator = roiCalculatorInstance;
            _roiConfiguration = roiConfiguration;
        }
        // GET: api/<RoiController>
        [HttpGet]
        public IEnumerable<InvestmentOptionBase> GetOptions()
        {
            return _roiConfiguration.InvestmentBusinessRules;
        }

        // POST api/<RoiController>
        [HttpPost("calculate")]
        public async Task<RoiCalculationResult> Calculate([FromBody] RoiCalculationRequest request)
        {
            return await _roiCalculator.Calculate(request);
        }
    }
}

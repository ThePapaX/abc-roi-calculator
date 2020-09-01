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
        // GET: api/<RoiController>
        [HttpGet]
        public IEnumerable<InvestmentOption> GetOptions()
        {
            return new List<InvestmentOption>() {
                new InvestmentOption(1, "Cash", 1)
            };
        }

        // POST api/<RoiController>
        [HttpPost("calculate")]
        public async Task<RoiCalculationResult> Calculate([FromBody] RoiCalculationRequest request)
        {
            return await RoiCalculator.Calculate(request);
        }
    }
}

using InterviewTest.Server.Model;
using InterviewTest.Server.Repository;
using Microsoft.AspNetCore.Mvc;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;

        public ListController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        [HttpPost]
        public async Task<ActionResult<bool>> Increment()
        {
            await _employeeRepository.IncrementValues();

            return true;
        }

        [HttpGet]
        public async Task<ActionResult<List<GroupResult>>> GetSum()
            => await _employeeRepository.GetSum();
    }
}

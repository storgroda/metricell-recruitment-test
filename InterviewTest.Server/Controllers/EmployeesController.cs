using InterviewTest.Server.Model;
using InterviewTest.Server.Repository;
using Microsoft.AspNetCore.Mvc;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;

        public EmployeesController(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
            => await _employeeRepository.GetEmployees();

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _employeeRepository.Get(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // PUT: api/Employees/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee employee)
        {
            if (id != employee.RowId)
            {
                return BadRequest();
            }

            await _employeeRepository.Edit(employee);

            return NoContent();
        }

        // POST: api/Employees
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            // Employee employee = new() { Name = name, Value = value };

            await _employeeRepository.Create(employee);

            return CreatedAtAction("GetEmployee", new { id = employee.RowId }, employee);
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _employeeRepository.Get(id);
            if (employee == null)
            {
                return NotFound();
            }

            await _employeeRepository.Delete(id);

            return NoContent();
        }
    }
}

using InterviewTest.Server.Controllers;
using InterviewTest.Server.Model;
using InterviewTest.Server.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Moq;
using Shouldly;

namespace InterviewTest.ServerTests
{
    public class UnitTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _contextOptions;

        private readonly Mock<IEmployeeRepository> _mockEmployeeRepository = new();
        
        public UnitTests()
        {
            // _mockEmployeeRepository.Setup(x => x.GetEmployees()).ReturnsAsync(new List<Employee>());

            _contextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .ConfigureWarnings(b => b.Ignore(InMemoryEventId.TransactionIgnoredWarning))
                .Options;

            using var context = new ApplicationDbContext(_contextOptions);

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            List<Employee> employees = new();

            employees.Add(new Employee { Name = "Aardvark", Value= 1 });
            employees.Add(new Employee { Name = "Bob", Value = 2 });
            employees.Add(new Employee { Name = "Colin", Value = 4 });
            employees.Add(new Employee { Name = "Dave", Value = 8 });
            employees.Add(new Employee { Name = "Eddie", Value = 16 });
            employees.Add(new Employee { Name = "Fred", Value = 32 });

            context.AddRange(employees);
            context.SaveChanges();

        }

        ApplicationDbContext CreateContext() => new(_contextOptions);

        public EmployeesController CreateEmployeesController() => new EmployeesController(_mockEmployeeRepository.Object);

        [Fact]
        public async Task GetEmployees()
        {
            using var context = CreateContext();
            var _employeeRepository = new EmployeeRepository(context); 

            var employees1 = await context.Employees.ToListAsync();

            var employees2 = await _employeeRepository.GetEmployees();

            Assert.True(employees1.Count == employees2.Count);
        }

        [Fact]
        public async Task AddEmployee()
        {
            using var context = CreateContext();
            var _employeeRepository = new EmployeeRepository(context);

            var employeeCount = await context.Employees.CountAsync();

            await _employeeRepository.Create(new Employee { Name = "Zoolander", Value = 10000 });

            var newEmployeeCount = await context.Employees.CountAsync();

            Assert.Equal(employeeCount+1,newEmployeeCount);
        }

        [Fact(Skip ="Under construction")]
        public void UpdateEmployee()
        {

        }

        [Fact(Skip = "Under construction")]
        public void DeleteEmployee()
        {
        }

        [Fact(Skip = "Under construction")]
        public void IncrementValues()
        {
        }

        [Fact(Skip = "Under construction")]
        public void GetSum()
        {
        }

        [Fact]
        public async Task EmployeesController_GetEmployees()
        {
            var employeeController = CreateEmployeesController();

            var result = await employeeController.GetEmployees();

            result.ShouldBeOfType<ActionResult<IEnumerable<Employee>>>();
        }
    }
}
using Dapper;
using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace InterviewTest.Server.Repository
{
    public interface IEmployeeRepository
    {
        //List<Employee> GetEmployeesWithDapper();

        Task<List<Employee>> GetEmployees();

        Task<Employee> Get(int id);

        Task Create(Employee employee);

        Task Edit(Employee employee);

        Task Delete(int id);

        Task<ActionResult<List<GroupResult>>> GetSum();

        Task IncrementValues();
    }

    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly ApplicationDbContext _context;
        //private readonly SqliteConnection _connection;

        public EmployeeRepository(/*SqliteConnection connection,*/ 
            ApplicationDbContext context)
        {
            //_connection = connection;
            _context = context;
        }

        // Using Dapper
        //public List<Employee> GetEmployeesWithDapper()
        //    => _connection.Query<Employee>("SELECT * FROM Employees").ToList<Employee>();

        // Using EF
        public async Task<List<Employee>> GetEmployees()
            => await _context.Employees.ToListAsync();

        public async Task<Employee> Get(int id)
            => await _context.Employees
                        .Where(x => x.RowId == id)
                        .SingleOrDefaultAsync();

        public async Task Create(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();
        }

        public async Task Edit(Employee employee)
        {
            Employee model = await Get(employee.RowId);

            model.Name = employee.Name;
            model.Value = employee.Value;

            _context.Update(model);
            await _context.SaveChangesAsync();
            return;
        }

        public async Task Delete(int id)
        {
            Employee model = await Get(id);
            _context.Remove(model);
            await _context.SaveChangesAsync();
            return;
        }

        public async Task<ActionResult<List<GroupResult>>> GetSum()
        {
            var groups = await _context.Employees
                .Where(x => EF.Functions.Like(x.Name, "A%")
                    || EF.Functions.Like(x.Name, "B%")
                    || EF.Functions.Like(x.Name, "C%"))
                .GroupBy(x => x.Name.Substring(0, 1))
                .Select(o => new GroupResult { Key = o.Key, Total = o.Sum(o => o.Value) })
                .ToListAsync();


            return groups.Where(x => x.Total > 11171).ToList();
        }

        public async Task IncrementValues()
        {
            //foreach (var e in _context.Employees)
            //{
            //    if (e.Name.StartsWith("E", StringComparison.OrdinalIgnoreCase))
            //    {
            //        e.Value += 1;
            //    } 
            //    else if(e.Name.StartsWith("G", StringComparison.OrdinalIgnoreCase))
            //    {
            //        e.Value += 10;
            //    }
            //    else 
            //    {
            //        e.Value += 100;
            //    }
            //}

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                await _context.Employees
                    .Where(x => EF.Functions.Like(x.Name, "E%"))
                    .ExecuteUpdateAsync(s => s.SetProperty(e => e.Value, e => e.Value + 1));

                await _context.Employees
                    .Where(x => EF.Functions.Like(x.Name, "G%"))
                    .ExecuteUpdateAsync(s => s.SetProperty(e => e.Value, e => e.Value + 10));

                await _context.Employees
                    .Where(x => !EF.Functions.Like(x.Name, "E%"))
                    .Where(x => !EF.Functions.Like(x.Name, "G%"))
                    .ExecuteUpdateAsync(s => s.SetProperty(e => e.Value, e => e.Value + 100));

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
            }

            return;
        }
    }
}

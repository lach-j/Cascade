using Cascade.Core;
using Cascade.Core.Models;
using Microsoft.Data.SqlClient;

namespace Cascade.Example;

public class ExampleTenantProvider : ITenantStore
{

    private readonly string _connectionString;

    public ExampleTenantProvider(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("CascadeDb");
    }

    public Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        using (var connection = new SqlConnection(_connectionString))
        {
            var command = new SqlCommand("SELECT [prefix], [Name] FROM TenantConfigurations ORDER BY [name] ASC;", connection);
            command.Connection.Open();

            var results = new List<Tenant>();


            using (var reader = command.ExecuteReader())
            {
                do
                {
                    while (reader.Read())
                    {
                        var id = reader.GetFieldValue<string>(0);
                        var name = reader.GetFieldValue<string>(1);
                        results.Add(
                            new Tenant()
                            {
                                Id = id,
                                Name = name,
                                Url = $"https://{id}.mywebapp.com",
                            });
                    }
                } while (reader.NextResult());
            }
            return Task.FromResult(results.AsEnumerable());
        }

    }
}
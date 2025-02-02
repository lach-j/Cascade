using Flagsmith.Core;
using Microsoft.Data.SqlClient;

namespace Flagsmith.Example;

public class ExampleTenantProvider : ITenantStore
{
    public Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        using (var connection = new SqlConnection(
                   @"Data Source=tcp:localhost\SQL2016;Integrated Security=True;TrustServerCertificate=True;Database=MyAppRegionDB;Trusted_Connection=true;"))
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
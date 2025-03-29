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

    private string GetOrganisationKeyword()
    {
        var orgWords = new string[] { "mining", "port", "rail", "shipping", "logistics", "transport", "energy", "utilities", "construction", "manufacturing", "retail", "wholesale", "agriculture", "farming", "forestry", "fishing", "education", "health", "government", "defence", "finance", "insurance", "real estate", "professional services", "information technology", "telecommunications", "media", "entertainment", "hospitality", "tourism", "sport", "recreation", "arts", "culture", "community", "not-for-profit", "other" };
        return orgWords[new Random().Next(0, orgWords.Length)];
    }

    public Task<IEnumerable<Tenant>> GetAllTenantsAsync()
    {
        return Task.FromResult(Enumerable.Range(1, 10).Select(i => new Tenant()
        {
            Id = $"cascade-tenant-{i}",
            Name = GetOrganisationKeyword(),
            Url = $"https://tenant{i}.mywebapp.com",
        }).ToList().AsEnumerable());
        
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
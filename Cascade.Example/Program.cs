using Cascade.Core;
using Cascade.Core.Authentication;
using Cascade.EntityFramework;
using Cascade.EntityFramework.SqlServer;
using Cascade.Example;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


var dbConnectionString = builder.Configuration.GetConnectionString("CascadeDb");

builder.Services.AddRazorPages();
builder.Services.AddCascade(
    configure =>
    {
        configure.RegisterCustomTenantStore<ExampleTenantProvider>(default);

        configure.UseEntityFramework(
            ef =>
            {
                ef.UseSqlServer(dbConnectionString);
            });

        configure.RegisterFeatureIdProvider<ExampleFeatureIdProvider>(default);
        configure.RegisterAuthenticationProvider(_ => new BasicAuthenticationProvider("admin", "password"));
    },
    options =>
    {
        options.EnableDashboard = true;
        options.CreateMissingFeaturesOnStart = true;
        options.EnableDevServer = true;
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.UseCascade();

app.MapRazorPages();

app.Run();
using Flagsmith.Core;
using Flagsmith.EntityFramework;
using Flagsmith.EntityFramework.SqlServer;
using Flagsmith.Example;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddFlagsmith(
    configure =>
    {
        configure.UseEntityFramework(
            ef =>
            {
                ef.UseSqlServer(@"Data Source=tcp:localhost\SQL2016;Integrated Security=True;TrustServerCertificate=True;Database=Flagsmith;Trusted_Connection=true;");
            });

        configure.RegisterFeatureIdProvider<ExampleFeatureIdProvider>(default);
    },
    options =>
    {
        options.EnableDashboard = true;
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

app.UseFlagsmith();

app.MapRazorPages();

app.Run();
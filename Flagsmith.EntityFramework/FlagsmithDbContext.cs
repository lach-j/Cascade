using Microsoft.EntityFrameworkCore;

namespace Flagsmith.EntityFramework.Models;

public class FlagsmithDbContext : DbContext
{
    public FlagsmithDbContext(DbContextOptions<FlagsmithDbContext> options) 
        : base(options)
    {
    }

    public DbSet<FeatureFlagEntity> Features { get; set; }
    public DbSet<TenantOverrideEntity> TenantOverrides { get; set; }
    public DbSet<TenantEntity> Tenants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FeatureFlagEntity>(entity =>
        {
            entity.ToTable("Features");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
        });

        modelBuilder.Entity<TenantOverrideEntity>(entity =>
        {
            entity.ToTable("TenantOverrides");
            entity.HasKey(e => new { e.FeatureId, e.TenantId });
            
            entity.HasOne(e => e.Feature)
                .WithMany(e => e.TenantOverrides)
                .HasForeignKey(e => e.FeatureId);
        });

        modelBuilder.Entity<TenantEntity>(entity =>
        {
            entity.ToTable("Tenants");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
        });
    }
}
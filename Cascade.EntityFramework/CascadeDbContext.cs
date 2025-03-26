using Microsoft.EntityFrameworkCore;

namespace Cascade.EntityFramework.Models;

public class CascadeDbContext : DbContext
{
    public CascadeDbContext(DbContextOptions<CascadeDbContext> options) 
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
            entity.Property(e => e.UpdatedAt).HasConversion(x => x, updated => updated.ToKindUtc());
            entity.Property(e => e.CreatedAt).HasConversion(x => x, created => created.ToKindUtc());
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
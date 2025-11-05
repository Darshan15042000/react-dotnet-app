using Microsoft.EntityFrameworkCore;
using Training_BE.Models;

namespace Training_BE.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        //DbSet<User> : this line creates a table Users in DB.
        public DbSet<User> Users { get; set; }


        public DbSet<Product> Products { get; set; }

        public DbSet<Wishlist> Wishlists { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<Address> Addresses { get; set; }

        public DbSet<DeliveryPartner> DeliveryPartners { get; set; }





        //OnModelCreating : this ensures that username and email are unique 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // 🔹 One DeliveryPartner → Many Orders
            modelBuilder.Entity<Order>() 
                .HasOne(o => o.DeliveryPartner)
                .WithMany(dp => dp.Orders)
                .HasForeignKey(o => o.DeliveryPartnerId)
                .OnDelete(DeleteBehavior.SetNull); // if partner removed, keep order


            // Disable cascade delete for Cart → User
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); // <-- important

            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Product)
                .WithMany()
                .HasForeignKey(c => c.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Disable cascade delete for Wishlist → User
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.Product)
                .WithMany()
                .HasForeignKey(w => w.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
        .HasOne(o => o.Product)
        .WithMany()
        .HasForeignKey(o => o.ProductId)
        .OnDelete(DeleteBehavior.Cascade);

            // Disable cascade delete for Address → User
            modelBuilder.Entity<Address>()
                .HasOne(a => a.User)
                .WithMany()  // a User can have multiple addresses
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict); // important to prevent deleting user auto deleting addresses

        }

    }
}
//Update-Database <AddOrdersTable>

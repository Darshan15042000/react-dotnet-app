using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Training_BE.Migrations
{
    /// <inheritdoc />
    public partial class AddDeliveryPartnerAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "DeliveryPartners",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "DeliveryPartners",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "DeliveryPartners");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "DeliveryPartners");
        }
    }
}

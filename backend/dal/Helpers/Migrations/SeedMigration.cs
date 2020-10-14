using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.IO;
using System.Linq;
using System.Reflection;

namespace Pims.Dal.Helpers.Migrations
{
    /// <summary>
    /// SeedMigration abstract class, provides a way to execute sql script during migrations.
    /// </summary>
    public abstract class SeedMigration : Migration
    {
        #region Variables
        private readonly string _migrationPath;
        #endregion

        #region Properties
        /// <summary>
        /// get - The migration version number.
        /// </summary>
        public string Version
        {
            get
            {
                var type = this.GetType();
                var attr = type.GetCustomAttribute<MigrationAttribute>(true);

                return $"{attr?.Id.Substring(15) ?? type.Name}";
            }
        }

        /// <summary>
        /// get - The default migrations path.
        /// </summary>
        public string DefaultMigrationsPath
        {
            get
            {
                return _migrationPath;
            }
        }
        #endregion

        #region Constructors
        /// <summary>
        /// Creates a new instances of a SeedMigration object.
        /// </summary>
        public SeedMigration()
        {
            _migrationPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Migrations");
        }
        #endregion

        #region Methods
        /// <summary>
        /// Execute any scripts in the migration \Up\ folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            migrationBuilder.Sql($"PRINT 'Up Scripts'");

            ScriptDeploy(migrationBuilder, Path.Combine(this.DefaultMigrationsPath, this.Version, "Up"));
        }

        /// <summary>
        /// Execute any scripts in the migration \Up\PreUp\ folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        protected void PreUp(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            migrationBuilder.Sql($"PRINT 'PreUp Scripts'");

            ScriptDeploy(migrationBuilder, Path.Combine(this.DefaultMigrationsPath, this.Version, Path.Combine("Up", "PreUp")));
        }

        /// <summary>
        /// Execute any scripts in the migration \Up\PostUp\ folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        protected void PostUp(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            migrationBuilder.Sql($"PRINT 'PostUp Scripts'");

            ScriptDeploy(migrationBuilder, Path.Combine(this.DefaultMigrationsPath, this.Version, Path.Combine("Up", "PostUp")));
        }

        /// <summary>
        /// Execute any scripts in the migration \Down\ folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            migrationBuilder.Sql($"PRINT 'Down Scripts'");

            ScriptDeploy(migrationBuilder, Path.Combine(this.DefaultMigrationsPath, this.Version, "Down"));
        }

        /// <summary>
        /// Execute any scripts in the migration \Up\PreDown\ folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        protected void PreDown(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            migrationBuilder.Sql($"PRINT 'PreDown Scripts'");

            ScriptDeploy(migrationBuilder, Path.Combine(this.DefaultMigrationsPath, this.Version, Path.Combine("Down", "PreDown")));
        }

        /// <summary>
        /// Execute any scripts in the migration \Down\PostDown\ folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        protected void PostDown(MigrationBuilder migrationBuilder)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            migrationBuilder.Sql($"PRINT 'PostDown Scripts'");

            ScriptDeploy(migrationBuilder, Path.Combine(this.DefaultMigrationsPath, this.Version, Path.Combine("Down", "PostDown")));
        }

        /// <summary>
        /// Execute the specified script or scripts in the specified folder.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        /// <param name="path"></param>
        protected void ScriptDeploy(MigrationBuilder migrationBuilder, string path)
        {
            if (migrationBuilder == null) throw new ArgumentNullException(nameof(migrationBuilder));
            if (path == null) throw new ArgumentNullException(nameof(path));

            if (!Directory.Exists(path) && !File.Exists(path))
            {
                migrationBuilder.Sql($"PRINT 'Script does not exist {path}.'");
                return;
            }

            var attr = File.GetAttributes(path);
            if ((attr & FileAttributes.Directory) == FileAttributes.Directory)
            {
                var seed_files = System.IO.Directory.GetFiles(path, "*.sql").OrderBy(n => n);
                foreach (var file_name in seed_files)
                {
                    ExecuteScript(migrationBuilder, file_name);
                }
            }
            else
            {
                ExecuteScript(migrationBuilder, path);
            }
        }

        /// <summary>
        /// Execute the specified script.
        /// </summary>
        /// <param name="migrationBuilder"></param>
        /// <param name="path"></param>
        private void ExecuteScript(MigrationBuilder migrationBuilder, string path)
        {
            migrationBuilder.Sql($"PRINT '---------------> {path}'");
            var sql = File.ReadAllText(path).Trim();

            if (!String.IsNullOrEmpty(sql))
            {
                migrationBuilder.Sql(sql);
            }
        }
        #endregion
    }
}

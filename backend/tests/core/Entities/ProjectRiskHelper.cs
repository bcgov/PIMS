using Pims.Core.Helpers;
using Pims.Dal;
using System.Collections.Generic;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a ProjectRisk.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        public static Entity.ProjectRisk CreateProjectRisk(string name, string code, int sortOrder)
        {
            return CreateProjectRisk(1, name, code, sortOrder);
        }

        /// <summary>
        /// Create a new instance of a ProjectRisk.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        public static Entity.ProjectRisk CreateProjectRisk(int id, string name, string code, int sortOrder)
        {
            return new Entity.ProjectRisk(name, code, sortOrder) { Id = id, RowVersion = new byte[] { 12, 13, 14 } };
        }

        /// <summary>
        /// Creates a random list of ProjectRisk.
        /// </summary>
        /// <param name="startId"></param>
        /// <param name="quantity"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        public static List<Entity.ProjectRisk> CreateProjectRisks(int startId, int quantity, int sortOrder)
        {
            var risk = new List<Entity.ProjectRisk>();

            for (var i = startId; i < quantity; i++)
            {
                var name = StringHelper.Generate(10);
                risk.Add(new Entity.ProjectRisk(name, name, sortOrder) { Id = i, RowVersion = new byte[] { 12, 13, 14 } });
            }

            return risk;
        }

        /// <summary>
        /// Creates a default list of ProjectRisk.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.ProjectRisk> CreateDefaultProjectRisks()
        {
            return new List<Entity.ProjectRisk>()
            {
                new Entity.ProjectRisk("Copmplete", "COMP", 1) { Id = 1, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectRisk("Green", "GREEN", 2) { Id = 2, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectRisk("Yellow", "YELLOW", 3) { Id = 3, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.ProjectRisk("Red", "RED", 4) { Id = 4, RowVersion = new byte[] { 12, 13, 14 } },
            };
        }

        /// <summary>
        /// Create a default list of project risk and add them to 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static List<Entity.ProjectRisk> CreateDefaultProjectRisks(this PimsContext context)
        {
            var risk = CreateDefaultProjectRisks();
            context.ProjectRisks.AddRange(risk);
            return risk;
        }

        /// <summary>
        /// Creates a new project risk and adds it to the 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        public static Entity.ProjectRisk CreateProjectRisks(this PimsContext context, int id, string name, string code, int sortOrder)
        {
            var risk = CreateProjectRisk(id, name, code, sortOrder);
            context.ProjectRisks.Add(risk);
            return risk;
        }
    }
}

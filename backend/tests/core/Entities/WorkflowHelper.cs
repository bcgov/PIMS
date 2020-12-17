using Pims.Core.Extensions;
using Pims.Dal;
using Pims.Dal.Helpers.Extensions;
using System.Collections.Generic;
using System.Linq;
using Entity = Pims.Dal.Entities;

namespace Pims.Core.Test
{
    /// <summary>
    /// EntityHelper static class, provides helper methods to create test entities.
    /// </summary>
    public static partial class EntityHelper
    {
        /// <summary>
        /// Create a new instance of a Workflow.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="code"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public static Entity.Workflow CreateWorkflow(int id, string name, string code = null, IEnumerable<Entity.ProjectStatus> status = null)
        {
            var workflow = new Entity.Workflow(name, code ?? name) { Id = id, RowVersion = new byte[] { 12, 13, 14 } };
            if (status?.Any() == true)
            {
                var i = 1;
                status.ForEach(s => workflow.Status.Add(new Entity.WorkflowProjectStatus(workflow, s, i++)));
            }
            return workflow;
        }

        /// <summary>
        /// Creates a default list of Workflow.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.Workflow> CreateDefaultWorkflows()
        {
            return new List<Entity.Workflow>()
            {
                new Entity.Workflow("Submit", "SUBMIT-DISPOSAL") { Id = 1, SortOrder = 1, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Workflow("Access", "ASSESS-DISPOSAL") { Id = 2, SortOrder = 2, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Workflow("Access Exemption", "ASSESS-EXEMPTION") { Id = 3, SortOrder = 3, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Workflow("Access", "ASSESS-EX-DISPOSAL") { Id = 4, SortOrder = 4, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Workflow("Enhanced Referral Program", "ERP") { Id = 5, SortOrder = 5, RowVersion = new byte[] { 12, 13, 14 } },
                new Entity.Workflow("Surplus Property List", "SPL") { Id = 6, SortOrder = 6, RowVersion = new byte[] { 12, 13, 14 } }
            };
        }

        /// <summary>
        /// Creates a default list of Workflow.
        /// </summary>
        /// <returns></returns>
        public static List<Entity.Workflow> CreateDefaultWorkflowsWithStatus()
        {
            var status = EntityHelper.CreateDefaultProjectStatus();
            var workflows = CreateDefaultWorkflows();

            // Add project status to workflow and transitions.
            var draft = workflows.First(w => w.Code == "SUBMIT-DISPOSAL");
            var assess = workflows.First(w => w.Code == "ASSESS-DISPOSAL");
            var exempt = workflows.First(w => w.Code == "ASSESS-EXEMPTION");
            var asExempt = workflows.First(w => w.Code == "ASSESS-EX-DISPOSAL");
            var erp = workflows.First(w => w.Code == "ERP");
            var spl = workflows.First(w => w.Code == "SPL");

            // SUBMIT-DISPOSE
            var start = draft.AddStatus(status.First(s => s.Code == "DR"), 0);
            var select = start.AddTransition("Select Properties", draft, status.First(s => s.Code == "DR-P"), 1);
            var update = select.AddTransition("Update Information", draft, status.First(s => s.Code == "DR-I"), 2);
            var docs = update.AddTransition("Provide Documentation", draft, status.First(s => s.Code == "DR-D"), 3);
            var approval = docs.AddTransition("Gain Approval", draft, status.First(s => s.Code == "DR-A"), 4);
            var preSubmit = approval.AddTransition("Review", draft, status.First(s => s.Code == "DR-RE"), 5);

            // ASSESS-DISPOSE
            var submitted = assess.AddStatus(status.First(s => s.Code == "AS-I"), 1);
            preSubmit.AddTransition("Submit", submitted);
            var rDocs = submitted.AddTransition("Review Documentation", assess, status.First(s => s.Code == "AS-D"), 2);
            var rAppraisal = rDocs.AddTransition("Review Appraisal", assess, status.First(s => s.Code == "AS-AP"), 3);
            var rFnc = rAppraisal.AddTransition("Begin First Nation Consultation", assess, status.First(s => s.Code == "AS-FNC"), 4);
            rFnc.AddTransition("Deny", assess, status.First(s => s.Code == "DE"), 5);

            // ASSESS-EXEMPTION
            var subExe = exempt.AddStatus(status.First(s => s.Code == "AS-EXE"), 1);
            preSubmit.AddTransition("Submit with Exemption", subExe);
            var rDocsExe = subExe.AddTransition("Review Documentation", exempt, status.First(s => s.Code == "AS-D"), 2);
            var rApprasialExe = rDocsExe.AddTransition("Review Appraisal", exempt, status.First(s => s.Code == "AS-AP"), 3);
            var rFncExe = rApprasialExe.AddTransition("Begin First Nation Consultation", exempt, status.First(s => s.Code == "AS-FNC"), 4);
            var exReview = rFncExe.AddTransition("Review Exemption", exempt, status.First(s => s.Code == "AS-EXP"), 5);
            exReview.AddTransition("Deny", exempt, status.First(s => s.Code == "DE"), 6);

            // ASSESS-EX-DISPOSAL
            var aEx = asExempt.AddStatus(status.First(s => s.Code == "AP-EXE"), 1);
            exReview.AddTransition("Approve Exemption", aEx);
            aEx.AddTransition("Transfer within GRE", asExempt, status.First(s => s.Code == "T-GRE"), 6);
            var aNotSpl = aEx.AddTransition("Approve not included in SPL", asExempt, status.First(s => s.Code == "AP-!SPL"), 7);
            aNotSpl.AddTransition("Dispose Properties", asExempt, status.First(s => s.Code == "DIS"), 9);
            aEx.AddTransition("Cancel Project", asExempt, status.First(s => s.Code == "CA"), 8);

            // ERP
            var aErp = erp.AddStatus(status.First(s => s.Code == "AP-ERP"), 1);
            rFnc.AddTransition("Approve for ERP", aErp);
            var erpBegin = aErp.AddTransition("Begin ERP", erp, status.First(s => s.Code == "ERP-ON"), 2);
            var erpOnHold = erpBegin.AddTransition("Place on Hold", erp, status.First(s => s.Code == "ERP-OH"), 3);
            erpBegin.AddTransition("Transfer within GRE", erp, status.First(s => s.Code == "T-GRE"), 4);
            erpOnHold.AddTransition("Transfer within GRE", erp, status.First(s => s.Code == "T-GRE"), 4);
            var aErpNotSpl = erpBegin.AddTransition("Approve not included in SPL", erp, status.First(s => s.Code == "AP-!SPL"), 5);
            aErpNotSpl.AddTransition("Dispose Properties", erp, status.First(s => s.Code == "DIS"), 7);
            var aErpNotSplOh = erpOnHold.AddTransition("Approve not included in SPL", erp, status.First(s => s.Code == "AP-!SPL"), 5);
            aErpNotSplOh.AddTransition("Dispose Properties", erp, status.First(s => s.Code == "DIS"), 7);
            erpBegin.AddTransition("Cancel Project", erp, status.First(s => s.Code == "CA"), 6);
            erpOnHold.AddTransition("Cancel Project", erp, status.First(s => s.Code == "CA"), 6);

            // SPL
            var aSpl = spl.AddStatus(status.First(s => s.Code == "AP-SPL"), 1);
            exReview.AddTransition("Approve for SPL", aSpl);
            erpBegin.AddTransition("Approve for SPL", aSpl);
            erpOnHold.AddTransition("Approve for SPL", aSpl);
            var SplPm = aSpl.AddTransition("Begin Pre-Marketing", spl, status.First(s => s.Code == "SPL-PM"), 2);
            var SplM = SplPm.AddTransition("Begin Marketing", spl, status.First(s => s.Code == "SPL-M"), 3);
            var splContractInPlace = SplM.AddTransition("Contract in Place - Conditional", spl, status.First(s => s.Code == "SPL-CIP-C"), 4);
            splContractInPlace.AddTransition("Dispose Properties", spl, status.First(s => s.Code == "DIS"), 5);
            splContractInPlace.AddTransition("Cancel Project", spl, status.First(s => s.Code == "CA"), 6);

            return workflows;
        }

        /// <summary>
        /// Creates a default list of workflows and adds them to the specified 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static List<Entity.Workflow> CreateDefaultWorkflows(this PimsContext context)
        {
            var workflows = CreateDefaultWorkflows();
            context.Workflows.AddRange(workflows);
            return workflows;
        }

        /// <summary>
        /// Creates a default list of workflows, project status, their relationship and tansitions and adds them to the specified 'context'.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static List<Entity.Workflow> CreateDefaultWorkflowsWithStatus(this PimsContext context)
        {
            var workflows = CreateDefaultWorkflowsWithStatus();
            context.Workflows.AddRange(workflows);
            return workflows;
        }
    }
}

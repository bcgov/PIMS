PRINT 'Update Agencies - Ministries'

MERGE INTO dbo.[Agencies] [Target]
USING ( VALUES
(
 'Advanced Education & Skills Training'
 , 'AEST'
 , 'AEST'
 , ''
 , null -- parent Id
 , 'kevin.brewster@gov.bc.ca'
 , 'Kevin'
 , 0 -- disabled
 , 1 -- send email
), (
 'Agriculture, Food and Fisheries'
 , 'AGRI'
 , 'AGRI'
 , ''
 , null -- parent Id
 , 'wes.boyd@gov.bc.ca'
 , 'Wes'
 , 0 -- disabled
 , 1 -- send email
), (
 'Attorney General'
 , 'AG'
 , 'AG'
 , ''
 , null -- parent Id
 , 'tracy.campbell@gov.bc.ca'
 , 'Tracy'
 , 0 -- disabled
 , 1 -- send email
), (
 'Children & Family Development'
 , 'MCF'
 , 'MCF'
 , ''
 , null -- parent Id
 , 'rob.byers@gov.bc.ca'
 , 'Rob'
 , 0 -- disabled
 , 1 -- send email
), (
 'Citizens'' Services'
 , 'CITZ'
 , 'CITZ'
 , ''
 , null -- parent Id
 , 'dean.skinner@gov.bc.ca'
 , 'Dean'
 , 0 -- disabled
 , 1 -- send email
), (
 'Education'
 , 'EDUC'
 , 'EDUC'
 , ''
 , null -- parent Id
 , 'reg.bawa@gov.bc.ca'
 , 'Reg'
 , 0 -- disabled
 , 1 -- send email
), (
 'Energy, Mines and Low Carbon Innovation'
 , 'EMLCI'
 , 'EMPR'
 , ''
 , null -- parent Id
 , 'wes.boyd@gov.bc.ca'
 , 'Wes'
 , 0 -- disabled
 , 1 -- send email
), (
 'Environment & Climate Change Strategy'
 , 'ENV'
 , 'ENV'
 , ''
 , null -- parent Id
 , 'wes.boyd@gov.bc.ca'
 , 'Wes'
 , 0 -- disabled
 , 1 -- send email
), (
 'Finance'
 , 'FIN'
 , 'FIN'
 , ''
 , null -- parent Id
 , 'teri.spaven@gov.bc.ca'
 , 'Teri'
 , 0 -- disabled
 , 1 -- send email
), (
 'Forests, Lands, Natural Resource Operations & Rural Development'
 , 'FLNRD'
 , 'FLNRD'
 , ''
 , null -- parent Id
 , 'trish.dohan@gov.bc.ca'
 , 'Trish'
 , 0 -- disabled
 , 1 -- send email
), (
 'Health'
 , 'HLTH'
 , 'HLTH'
 , ''
 , null -- parent Id
 , 'philip.twyford@gov.bc.ca'
 , 'Philip'
 , 0 -- disabled
 , 1 -- send email
), (
 'Indigenous Relations & Reconciliation'
 , 'IRR'
 , 'IRR'
 , ''
 , null -- parent Id
 , 'wes.boyd@gov.bc.ca'
 , 'Wes'
 , 0 -- disabled
 , 1 -- send email
), (
 'Jobs, Economic Recovery and Innovation'
 , 'JERI'
 , 'JERI'
 , ''
 , null -- parent Id
 , 'joanna.white@gov.bc.ca'
 , 'Joanna'
 , 0 -- disabled
 , 1 -- send email
), (
 'Labour'
 , 'LBR'
 , 'LBR'
 , ''
 , null -- parent Id
 , 'joanna.white@gov.bc.ca'
 , 'Joanna'
 , 0 -- disabled
 , 1 -- send email
), (
 'Mental Health & Addictions'
 , 'MMHA'
 , 'MMHA'
 , ''
 , null -- parent Id
 , 'dara.landry@gov.bc.ca'
 , 'Dara'
 , 0 -- disabled
 , 1 -- send email
), (
 'Municipal Affairs'
 , 'MUNI'
 , 'MUNI'
 , ''
 , null -- parent Id
 , 'david.curtis@gov.bc.ca'
 , 'David'
 , 0 -- disabled
 , 1 -- send email
), (
 'Public Safety & Solicitor General & Emergency B.C.'
 , 'PSSGEB'
 , 'PSSG'
 , ''
 , null -- parent Id
 , 'tracy.campbell@gov.bc.ca'
 , 'Tracy'
 , 0 -- disabled
 , 1 -- send email
), (
 'Social Development & Poverty Reduction'
 , 'SDPR'
 , 'SDPR'
 , ''
 , null -- parent Id
 , 'jonathan.dube@gov.bc.ca'
 , 'Jonathan'
 , 0 -- disabled
 , 1 -- send email
), (
 'Tourism, Arts, Culture and Sport'
 , 'TACS'
 , 'TACS'
 , ''
 , null -- parent Id
 , 'joanna.white@gov.bc.ca'
 , 'Joanna'
 , 0 -- disabled
 , 1 -- send email
), (
 'Transportation & Infrastructure'
 , 'TRAN'
 , 'TRAN'
 , ''
 , null -- parent Id
 , 'nancy.bain@gov.bc.ca'
 , 'Nancy'
 , 0 -- disabled
 , 1 -- send email
), (
 'BC Public Service Agency'
 , 'BCPSA'
 , 'BCPSA'
 , ''
 , null -- parent Id
 , 'bruce.richmond@gov.bc.ca'
 , 'Bruce'
 , 0 -- disabled
 , 1 -- send email
)) AS [Source] (
    [Name]
    , [OriginalCode]
    , [Code]
    , [Description]
    , [ParentId]
    , [Email]
    , [AddressTo]
    , [IsDisabled]
    , [SendEmail]
) ON [Target].[Code] = [Source].[OriginalCode]
WHEN MATCHED THEN
    UPDATE
        SET [Target].[Name] = [Source].[Name]
            , [Target].[Code] = [Source].[Code]
            , [Target].[Description] = [Source].[Description]
            , [Target].[ParentId] = [Source].[ParentId]
            , [Target].[Email] = [Source].[Email]
            , [Target].[AddressTo] = [Source].[AddressTo]
            , [Target].[SendEmail] = [Source].[SendEmail]
            , [Target].[IsDisabled] = [Source].[IsDisabled]
WHEN NOT MATCHED THEN
    INSERT (
        [Name]
        , [Code]
        , [Description]
        , [ParentId]
        , [Email]
        , [AddressTo]
        , [SendEmail]
        , [IsDisabled]
    ) VALUES (
        [Source].[Name]
        , [Source].[Code]
        , [Source].[Description]
        , [Source].[ParentId]
        , [Source].[Email]
        , [Source].[AddressTo]
        , [Source].[SendEmail]
        , [Source].[IsDisabled]
    );

PRINT 'Adding Agencies'

SET IDENTITY_INSERT dbo.[Agencies] ON

MERGE INTO dbo.[Agencies] dest
USING (
    -- Child Agencies for MAH.
    VALUES (
        42
        , 8
        , 'PRHC'
        , 'Provincial Rental Housing Corporation'
        , 0
        , 0
    )

    -- Child Agencies for MAG.
    , (
        51
        , 11
        , 'LDB'
        , 'BC Liquor Distribution Branch'
        , 0
        , 0
    )

    -- Child Agencies for EDUC.
    , (
        150
        , 4
        , 'SD 06'
        , 'School District 06'
        , 0
        , 0
    ), (
        151
        , 4
        , 'SD 19'
        , 'School District 19'
        , 0
        , 0
    ), (
        152
        , 4
        , 'SD 20'
        , 'School District 20'
        , 0
        , 0
    ), (
        153
        , 4
        , 'SD 22'
        , 'School District 22'
        , 0
        , 0
    ), (
        154
        , 4
        , 'SD 23'
        , 'School District 23'
        , 0
        , 0
    ), (
        155
        , 4
        , 'SD 28'
        , 'School District 28'
        , 0
        , 0
    ), (
        156
        , 4
        , 'SD 33'
        , 'School District 33'
        , 0
        , 0
    ), (
        157
        , 4
        , 'SD 35'
        , 'School District 35'
        , 0
        , 0
    ), (
        158
        , 4
        , 'SD 36'
        , 'School District 36'
        , 0
        , 0
    ), (
        159
        , 4
        , 'SD 37'
        , 'School District 37'
        , 0
        , 0
    ), (
        160
        , 4
        , 'SD 38'
        , 'School District 38'
        , 0
        , 0
    ), (
        161
        , 4
        , 'SD 40'
        , 'School District 40'
        , 0
        , 0
    ), (
        162
        , 4
        , 'SD 41'
        , 'School District 41'
        , 0
        , 0
    ), (
        163
        , 4
        , 'SD 42'
        , 'School District 42'
        , 0
        , 0
    ), (
        164
        , 4
        , 'SD 43'
        , 'School District 43'
        , 0
        , 0
    ), (
        165
        , 4
        , 'SD 44'
        , 'School District 44'
        , 0
        , 0
    ), (
        166
        , 4
        , 'SD 47'
        , 'School District 47'
        , 0
        , 0
    ), (
        167
        , 4
        , 'SD 62'
        , 'School District 62'
        , 0
        , 0
    ), (
        168
        , 4
        , 'SD 63'
        , 'School District 63'
        , 0
        , 0
    ), (
        169
        , 4
        , 'SD 68'
        , 'School District 68'
        , 0
        , 0
    ), (
        170
        , 4
        , 'SD 70'
        , 'School District 70'
        , 0
        , 0
    ), (
        171
        , 4
        , 'SD 71'
        , 'School District 71'
        , 0
        , 0
    ), (
        172
        , 4
        , 'SD 72'
        , 'School District 72'
        , 0
        , 0
    ), (
        173
        , 4
        , 'SD 73'
        , 'School District 73'
        , 0
        , 0
    ), (
        174
        , 4
        , 'SD 75'
        , 'School District 75'
        , 0
        , 0
    ), (
        175
        , 4
        , 'SD 78'
        , 'School District 78'
        , 0
        , 0
    ), (
        176
        , 4
        , 'SD 79'
        , 'School District 79'
        , 0
        , 0
    ), (
        177
        , 4
        , 'SD 83'
        , 'School District 83'
        , 0
        , 0
    ), (
        178
        , 4
        , 'SD 91'
        , 'School District 91'
        , 0
        , 0
    )

    -- Child Agencies for TRAN.
    , (
        132
        , 9
        , 'BCTFA'
        , 'BC Transportation Financing Authority'
        , 0
        , 0
    )
) AS src (
    [Id]
    , [ParentId]
    , [Code]
    , [Name]
    , [IsDisabled]
    , [SendEmail]
)
ON dest.[Id] = src.[Id]
WHEN MATCHED THEN
    UPDATE
        SET
            dest.[ParentId] = src.[ParentId]
            , dest.[Code] = src.[Code]
            , dest.[Name] = src.[Name]
            , dest.[IsDisabled] = src.[IsDisabled]
            , dest.[SendEmail] = src.[SendEmail]
WHEN NOT MATCHED THEN
    INSERT (
        [Id]
        , [ParentId]
        , [Code]
        , [Name]
        , [IsDisabled]
        , [SendEmail]
    ) VALUES (
        src.[id]
        , src.[ParentId]
        , src.[Code]
        , src.[Name]
        , src.[IsDisabled]
        , src.[SendEmail]
    );

SET IDENTITY_INSERT dbo.[Agencies] OFF


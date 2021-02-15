PRINT 'Adding/Updating School District Agencies'

DECLARE @ParentId INT = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'EDUC')

MERGE INTO dbo.[Agencies] [Target]
USING ( VALUES
(
 'School District 1 Fernie'
 , 'SD 01'
 , 'Changed to 5 Southeast Kootenay'
 , 1
),(
 'School District 2 Cranbrook'
 , 'SD 02'
 , 'Changed to 5 Southeast Kootenay'
 , 1
),(
 'School District 3 Kimberley'
 , 'SD 03'
 , 'Changed to 6 Rocky Mountain'
 , 1
),(
 'School District 4 Windermere'
 , 'SD 04'
 , 'Changed to 6 Rocky Mountain'
 , 1
),(
 'School District 5 Southeast Kootenay'
 , 'SD 05'
 , ''
 , 0
),(
 'School District 6 Rocky Mountain'
 , 'SD 06'
 , ''
 , 0
),(
 'School District 7 Nelson'
 , 'SD 07'
 , 'Changed to 8 Kootenay Lake'
 , 1
),(
 'School District 8 Kootenay Lake'
 , 'SD 08'
 , ''
 , 0
),(
 'School District 9 Castlegar'
 , 'SD 09'
 , 'Changed to 20 Kootenay-Columbia'
 , 1
),(
 'School District 10 Arrow Lakes'
 , 'SD 10'
 , ''
 , 0
),(
 'School District 11 Trail'
 , 'SD 11'
 , 'Changed to 20 Kootenay-Columbia'
 , 1
),(
 'School District 12 Grand Forks'
 , 'SD 12'
 , 'Changed to 	51 Boundary'
 , 1
),(
 'School District 13 Kettle Valley'
 , 'SD 13'
 , 'Changed to 	51 Boundary'
 , 1
),(
 'School District 14 Southern Okanagan'
 , 'SD 14'
 , 'Changed to 53 Okanagan Similkameen'
 , 1
),(
 'School District 15 Penticton'
 , 'SD 15'
 , 'Changed to 67 Okanagan Skaha'
 , 1
),(
 'School District 16 Keremeos'
 , 'SD 16'
 , 'Changed to 53 Okanagan Similkameen'
 , 1
),(
 'School District 17 Princeton'
 , 'SD 17'
 , 'Changed to 58 Nicola-Similkameen'
 , 1
),(
 'School District 18 Golden'
 , 'SD 18'
 , 'Changed to 6 Rocky Mountain'
 , 1
),(
 'School District 19 Revelstoke'
 , 'SD 19'
 , ''
 , 0
),(
 'School District 20 Kootenay-Columbia'
 , 'SD 20'
 , ''
 , 0
),(
 'School District 21 Armstrong-Spallumcheen'
 , 'SD 21'
 , 'Changed to 83 North Okanagan-Shuswap'
 , 1
),(
 'School District 22 Vernon'
 , 'SD 22'
 , ''
 , 0
),(
 'School District 23 Central Okanagan'
 , 'SD 23'
 , ''
 , 0
),(
 'School District 24 Kamloops'
 , 'SD 24'
 , 'Changed to 73 Kamloops/Thompson'
 , 1
),(
 'School District 25'
 , 'SD 25'
 , ''
 , 0
),(
 'School District 26 North Thompson'
 , 'SD 26'
 , 'Changed to 73 Kamloops/Thompson'
 , 1
),(
 'School District 27 Cariboo-Chilcotin'
 , 'SD 27'
 , ''
 , 0
),(
 'School District 28 Quesnel'
 , 'SD 28'
 , ''
 , 0
),(
 'School District 29 Lillooet'
 , 'SD 29'
 , 'Changed to 74 Gold Trail'
 , 1
),(
 'School District 30 South Cariboo'
 , 'SD 30'
 , 'Changed to 74 Gold Trail'
 , 1
),(
 'School District 31 Merritt'
 , 'SD 31'
 , 'Changed to 58 Nicola-Similkameen'
 , 1
),(
 'School District 32 Hope'
 , 'SD 32'
 , 'Changed to 78 Fraser-Cascade'
 , 1
),(
 'School District 33 Chilliwack'
 , 'SD 33'
 , ''
 , 0
),(
 'School District 34 Abbotsford'
 , 'SD 34'
 , ''
 , 0
),(
 'School District 35 Langley'
 , 'SD 35'
 , ''
 , 0
),(
 'School District 36 Surrey'
 , 'SD 36'
 , ''
 , 0
),(
 'School District 37 Delta'
 , 'SD 37'
 , ''
 , 0
),(
 'School District 38 Richmond'
 , 'SD 38'
 , ''
 , 0
),(
 'School District 39 Vancouver'
 , 'SD 39'
 , ''
 , 0
),(
 'School District 40 New Westminster'
 , 'SD 40'
 , ''
 , 0
),(
 'School District 41 Burnaby'
 , 'SD 41'
 , ''
 , 0
),(
 'School District 42 Maple Ridge-Pitt Meadows'
 , 'SD 42'
 , ''
 , 0
),(
 'School District 43 Coquitlam'
 , 'SD 43'
 , ''
 , 0
),(
 'School District 44 North Vancouver'
 , 'SD 44'
 , ''
 , 0
),(
 'School District 45 West Vancouver'
 , 'SD 45'
 , ''
 , 0
),(
 'School District 46 Sunshine Coast'
 , 'SD 46'
 , ''
 , 0
),(
 'School District 47 Powell River'
 , 'SD 47'
 , ''
 , 0
),(
 'School District 48 Sea to Sky'
 , 'SD 48'
 , ''
 , 0
),(
 'School District 49 Central Coast'
 , 'SD 49'
 , ''
 , 0
),(
 'School District 50 Haida Gwaii'
 , 'SD 50'
 , ''
 , 0
),(
 'School District 51 Boundary'
 , 'SD 51'
 , ''
 , 0
),(
 'School District 52 Prince Rupert'
 , 'SD 52'
 , ''
 , 0
),(
 'School District 53 Okanagan Similkameen'
 , 'SD 53'
 , ''
 , 0
),(
 'School District 54 Bulkley Valley'
 , 'SD 54'
 , ''
 , 0
),(
 'School District 55 Burns Lake'
 , 'SD 55'
 , 'Changed to 91 Nechako Lakes'
 , 1
),(
 'School District 56 Nechako'
 , 'SD 56'
 , 'Changed to 91 Nechako Lakes'
 , 1
),(
 'School District 57 Prince George'
 , 'SD 57'
 , ''
 , 0
),(
 'School District 58 Nicola-Similkameen'
 , 'SD 58'
 , ''
 , 0
),(
 'School District 59 Peace River South'
 , 'SD 59'
 , ''
 , 0
),(
 'School District 60 Peace River North'
 , 'SD 60'
 , ''
 , 0
),(
 'School District 61 Greater Victoria'
 , 'SD 61'
 , ''
 , 0
),(
 'School District 62 Sooke'
 , 'SD 62'
 , ''
 , 0
),(
 'School District 63 Saanich'
 , 'SD 63'
 , ''
 , 0
),(
 'School District 64 Gulf Islands'
 , 'SD 64'
 , ''
 , 0
),(
 'School District 65 Cowichan'
 , 'SD 65'
 , 'Changed to 79 Cowichan Valley'
 , 1
),(
 'School District 66 Lake Cowichan'
 , 'SD 66'
 , 'Changed to 79 Cowichan Valley'
 , 1
),(
 'School District 67 Okanagan Skaha'
 , 'SD 67'
 , ''
 , 0
),(
 'School District 68 Nanaimo-Ladysmith'
 , 'SD 68'
 , ''
 , 0
),(
 'School District 69 Qualicum'
 , 'SD 69'
 , ''
 , 0
),(
 'School District 70 Alberni'
 , 'SD 70'
 , ''
 , 0
),(
 'School District 71 Comox Valley'
 , 'SD 71'
 , ''
 , 0
),(
 'School District 72 Campbell River'
 , 'SD 72'
 , ''
 , 0
),(
 'School District 73 Kamloops/Thompson'
 , 'SD 73'
 , ''
 , 0
),(
 'School District 74 Gold Trail'
 , 'SD 74'
 , ''
 , 0
),(
 'School District 75 Mission'
 , 'SD 75'
 , ''
 , 0
),(
 'School District 76 Agassiz-Harrison'
 , 'SD 76'
 , 'Changed to 78 Fraser-Cascade'
 , 1
),(
 'School District 77 Summerland'
 , 'SD 77'
 , 'Changed to 67 Okanagan Skaha'
 , 1
),(
 'School District 78 Fraser-Cascade'
 , 'SD 78'
 , ''
 , 0
),(
 'School District 79 Cowichan Valley'
 , 'SD 79'
 , ''
 , 0
),(
 'School District 80 Kitimat'
 , 'SD 80'
 , 'Changed to 82 Coast Mountains'
 , 1
),(
 'School District 81 Fort Nelson'
 , 'SD 81'
 , ''
 , 0
),(
 'School District 82 Coast Mountains'
 , 'SD 82'
 , ''
 , 0
),(
 'School District 83 North Okanagan-Shuswap'
 , 'SD 83'
 , ''
 , 0
),(
 'School District 84 Vancouver Island West'
 , 'SD 84'
 , ''
 , 0
),(
 'School District 85 Vancouver Island North'
 , 'SD 85'
 , ''
 , 0
),(
 'School District 86 Creston-Kaslo'
 , 'SD 86'
 , 'Changed to 8 Kootenay Lake'
 , 1
),(
 'School District 87 Stikine'
 , 'SD 87'
 , ''
 , 0
),(
 'School District 88 Terrace'
 , 'SD 88'
 , 'Changed to 82 Coast Mountains'
 , 1
),(
 'School District 89 Shuswap'
 , 'SD 89'
 , 'Changed to 83 North Okanagan-Shuswap'
 , 1
),(
 'School District 90'
 , 'SD 90'
 , ''
 , 0
),(
 'School District 91 Nechako Lakes'
 , 'SD 91'
 , ''
 , 0
),(
 'School District 92 Nisga''a'
 , 'SD 92'
 , ''
 , 0
),(
 'School District 93 Conseil scolaire francophone'
 , 'SD 93'
 , ''
 , 0
),(
 'School District 94'
 , 'SD 94'
 , ''
 , 0
),(
 'School District 95'
 , 'SD 95'
 , ''
 , 0
),(
 'School District 96'
 , 'SD 96'
 , ''
 , 0
),(
 'School District 97'
 , 'SD 97'
 , ''
 , 0
),(
 'School District 98'
 , 'SD 98'
 , ''
 , 0
),(
 'School District 99'
 , 'SD 99'
 , ''
 , 0
),(
 'School District 100'
 , 'SD 100'
 , ''
 , 0
)) AS [Source] (
    [Name]
    , [Code]
    , [Description]
    , [IsDisabled]
) ON [Target].[Code] = [Source].[Code]
WHEN MATCHED THEN
    UPDATE
        SET [Target].[Name] = [Source].[Name]
            , [Target].[Description] = [Source].[Description]
            , [Target].[ParentId] = @ParentId
            , [Target].[IsDisabled] = [Source].[IsDisabled]
WHEN NOT MATCHED THEN
    INSERT (
        [Name]
        , [Code]
        , [Description]
        , [ParentId]
        , [SendEmail]
        , [IsDisabled]
    ) VALUES (
        [Source].[Name]
        , [Source].[Code]
        , [Source].[Description]
        , @ParentId
        , 0
        , [Source].[IsDisabled]
    );

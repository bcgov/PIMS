PRINT 'Adding municipalities'

MERGE INTO dbo.[AdministrativeAreas] Target
USING ( VALUES
(
 'Village of Anmore',
 'Anmore',
 'Metro Vancouver Regional District'
), (
 'Village of Belcarra',
 'Belcarra',
 'Metro Vancouver Regional District'
), (
 'Bowen Island Municipality',
 'Bowen Island',
 'Metro Vancouver Regional District'
), (
 'City of Burnaby',
 'Burnaby',
 'Metro Vancouver Regional District'
), (
 'City of Coquitlam',
 'Coquitlam',
 'Metro Vancouver Regional District'
), (
 'City of Delta',
 'Delta',
 'Metro Vancouver Regional District'
), (
 'City of Langley',
 'Langley - City',
 'Metro Vancouver Regional District'
), (
 'City of Maple Ridge',
 'Maple Ridge',
 'Metro Vancouver Regional District'
), (
 'City of New Westminster',
 'New Westminster',
 'Metro Vancouver Regional District'
), (
 'City of North Vancouver',
 'North Vancouver - City',
 'Metro Vancouver Regional District'
), (
 'City of Pitt Meadows',
 'Pitt Meadows',
 'Metro Vancouver Regional District'
), (
 'City of White Rock',
 'White Rock',
 'Metro Vancouver Regional District'
), (
 'Village of Lions Bay',
 'Lions Bay',
 'Metro Vancouver Regional District'
), (
 'The Corporation of the Township of Langley',
 'Langley - District',
 'Metro Vancouver Regional District'
), (
 'The Corporation of the District of North Vancouver',
 'North Vancouver - District',
 'Metro Vancouver Regional District'
), (
 'Village of Keremeos',
 'Keremeos',
 'Regional District of Okanagan-Similkameen'
), (
 'Town of Osoyoos',
 'Osoyoos',
 'Regional District of Okanagan-Similkameen'
), (
 'The Corporation of the City of Penticton',
 'Penticton',
 'Regional District of Okanagan-Similkameen'
), (
 'Town of Princeton',
 'Princeton',
 'Regional District of Okanagan-Similkameen'
), (
 'Town of Oliver',
 'Oliver',
 'Regional District of Okanagan-Similkameen'
), (
 'The Corporation of the District of Summerland',
 'Summerland',
 'Regional District of Okanagan-Similkameen'
), (
 'District of Lillooet',
 'Lillooet',
 'Squamish-Lillooet Regional District'
), (
 'District of Squamish',
 'Squamish',
 'Squamish-Lillooet Regional District'
), (
 'Resort Municipality of Whistler',
 'Whistler',
 'Squamish-Lillooet Regional District'
), (
 'Village of Pemberton',
 'Pemberton',
 'Squamish-Lillooet Regional District'
), (
 'The Corporation of the Village of Ashcroft',
 'Ashcroft',
 'Thompson-Nicola Regional District'
), (
 'Village of Chase',
 'Chase',
 'Thompson-Nicola Regional District'
), (
 'Village of Clinton',
 'Clinton',
 'Thompson-Nicola Regional District'
), (
 'City of Kamloops',
 'Kamloops',
 'Thompson-Nicola Regional District'
), (
 'District of Logan Lake',
 'Logan Lake',
 'Thompson-Nicola Regional District'
), (
 'District of Barriere',
 'Barriere',
 'Thompson-Nicola Regional District'
), (
 'Village of Cache Creek',
 'Cache Creek',
 'Thompson-Nicola Regional District'
), (
 'District of Clearwater',
 'Clearwater',
 'Thompson-Nicola Regional District'
), (
 'Village of Lytton',
 'Lytton',
 'Thompson-Nicola Regional District'
), (
 'City of Merritt',
 'Merritt',
 'Thompson-Nicola Regional District'
), (
 'City of Port Coquitlam',
 'Port Coquitlam',
 'Metro Vancouver Regional District'
), (
 'City of Port Moody',
 'Port Moody',
 'Metro Vancouver Regional District'
), (
 'City of Richmond',
 'Richmond',
 'Metro Vancouver Regional District'
), (
 'City of Surrey',
 'Surrey',
 'Metro Vancouver Regional District'
), (
 'City of Vancouver',
 'Vancouver',
 'Metro Vancouver Regional District'
), (
 'District Municipality of West Vancouver',
 'West Vancouver',
 'Metro Vancouver Regional District'
), (
 'The Corporation of the Village of Burns Lake',
 'Burns Lake',
 'Regional District of Bulkley-Nechako'
), (
 'District of Fort St James',
 'Fort St James',
 'Regional District of Bulkley-Nechako'
), (
 'Village of Fraser Lake',
 'Fraser Lake',
 'Regional District of Bulkley-Nechako'
), (
 'Village of Granisle',
 'Granisle',
 'Regional District of Bulkley-Nechako'
), (
 'District of Houston',
 'Houston',
 'Regional District of Bulkley-Nechako'
), (
 'Town of Smithers',
 'Smithers',
 'Regional District of Bulkley-Nechako'
), (
 'The Corporation of the Village of Telkwa',
 'Telkwa',
 'Regional District of Bulkley-Nechako'
), (
 'District of Vanderhoof',
 'Vanderhoof',
 'Regional District of Bulkley-Nechako'
), (
 'District of 100 Mile House',
 '100 Mile House',
 'Cariboo Regional District'
), (
 'City of Quesnel',
 'Quesnel',
 'Cariboo Regional District'
), (
 'District of Wells',
 'Wells',
 'Cariboo Regional District'
), (
 'City of Williams Lake',
 'Williams Lake',
 'Cariboo Regional District'
), (
 'District of Mackenzie',
 'Mackenzie',
 'Regional District of Fraser-Fort George'
), (
 'The Corporation of the Village of McBride',
 'McBride',
 'Regional District of Fraser-Fort George'
), (
 'City of Prince George',
 'Prince George',
 'Regional District of Fraser-Fort George'
), (
 'Village of Valemount',
 'Valemont',
 'Regional District of Fraser-Fort George'
), (
 'District of Kitimat',
 'Kitimat',
 'Regional District of Kitimat-Stikine'
), (
 'The Corporation of the Village of Hazelton',
 'Hazelton',
 'Regional District of Kitimat-Stikine'
), (
 'District of New Hazelton',
 'New Hazelton',
 'Regional District of Kitimat-Stikine'
), (
 'District of Stewart',
 'Stewart',
 'Regional District of Kitimat-Stikine'
), (
 'City of Terrace',
 'Terrace',
 'Regional District of Kitimat-Stikine'
), (
 'Northern Rockies Regional Municipality',
 'NRRM',
 'Province of British Columbia'
), (
 'District of Tumbler Ridge',
 'Tumbler Ridge',
 'Peace River Regional District'
), (
 'District of Chetwynd',
 'Chetwynd',
 'Peace River Regional District'
), (
 'The Corporation of the City of Dawson Creek',
 'Dawson Creek',
 'Peace River Regional District'
), (
 'City of Fort St John',
 'Fort St John',
 'Peace River Regional District'
), (
 'District of Hudsons Hope',
 'Hudson''s Hope',
 'Peace River Regional District'
), (
 'The Corporation of the Village of Pouce Coupe',
 'Pouce Coupe',
 'Peace River Regional District'
), (
 'District of Taylor',
 'Taylor',
 'Peace River Regional District'
), (
 'Village of Queen Charlotte',
 'Queen Charlotte',
 'North Coast Regional District'
), (
 'Village of Masset',
 'Masset',
 'North Coast Regional District'
), (
 'Village of Port Clements',
 'Port Clements',
 'North Coast Regional District'
), (
 'District of Port Edward',
 'Port Edward',
 'North Coast Regional District'
), (
 'City of Prince Rupert',
 'Prince Rupert',
 'North Coast Regional District'
), (
 'City of Kelowna',
 'Kelowna',
 'Regional District of Central Okanagan'
), (
 'District of Lake Country',
 'Lake Country',
 'Regional District of Central Okanagan'
), (
 'The Corporation of the District of Peachland',
 'Peachland',
 'Regional District of Central Okanagan'
), (
 'City of West Kelowna',
 'West Kelowna',
 'Regional District of Central Okanagan'
), (
 'City of Abbotsford',
 'Abbotsford',
 'Fraser Valley Regional District'
), (
 'City of Chilliwack',
 'Chilliwack',
 'Fraser Valley Regional District'
), (
 'Village of Harrison Hot Springs',
 'Harrison Hot Springs',
 'Fraser Valley Regional District'
), (
 'District of Hope',
 'Hope',
 'Fraser Valley Regional District'
), (
 'District of Kent',
 'Kent',
 'Fraser Valley Regional District'
), (
 'District of Mission',
 'Mission',
 'Fraser Valley Regional District'
), (
 'Village of Montrose',
 'Montrose',
 'Regional District of Kootenay Boundary'
), (
 'City of Rossland',
 'Rossland',
 'Regional District of Kootenay Boundary'
), (
 'City of Trail',
 'Trail',
 'Regional District of Kootenay Boundary'
), (
 'Village of Warfield',
 'Warfield',
 'Regional District of Kootenay Boundary'
), (
 'The Corporation of the Village of Fruitvale',
 'Fruitvale',
 'Regional District of Kootenay Boundary'
), (
 'City of Armstrong',
 'Armstrong',
 'Regional District of North Okanagan'
), (
 'The Corporation of the District of Coldstream',
 'Coldstream',
 'Regional District of North Okanagan'
), (
 'The Corporation of the City of Enderby',
 'Enderby',
 'Regional District of North Okanagan'
), (
 'The Corporation of the Village of Lumby',
 'Lumby',
 'Regional District of North Okanagan'
), (
 'The Corporation of the Township of Spallumcheen',
 'Spallumcheen',
 'Regional District of North Okanagan'
), (
 'The Corporation of the City of Vernon',
 'Vernon',
 'Regional District of North Okanagan'
), (
 'City of Port Alberni',
 'Port Alberni',
 'Regional District of Alberni-Clayoquot'
), (
 'Sun Peaks Mountain Resort Municipality',
 'Sun Peaks',
 'Thompson-Nicola Regional District'
), (
 'The Corporation of the City of Nelson',
 'Nelson',
 'Regional District of Central Kootenay'
), (
 'Village of Slocan',
 'Slocan',
 'Regional District of Central Kootenay'
), (
 'The Corporation of the Village of Salmo',
 'Salmo',
 'Regional District of Central Kootenay'
), (
 'The Corporation of the Village of Silverton',
 'Silverton',
 'Regional District of Central Kootenay'
), (
 'Town of Creston',
 'Creston',
 'Regional District of Central Kootenay'
), (
 'Village of Kaslo',
 'Kaslo',
 'Regional District of Central Kootenay'
), (
 'Village of New Denver',
 'New Denver',
 'Regional District of Central Kootenay'
), (
 'Village of Nakusp',
 'Nakusp',
 'Regional District of Central Kootenay'
), (
 'City of Castlegar',
 'Castlegar',
 'Regional District of Central Kootenay'
), (
 'Town of Golden',
 'Golden',
 'Columbia-Shuswap Regional District'
), (
 'City of Revelstoke',
 'Revelstoke',
 'Columbia-Shuswap Regional District'
), (
 'City of Salmon Arm',
 'Salmon Arm',
 'Columbia-Shuswap Regional District'
), (
 'The Corporation of the District of Sicamous',
 'Sicamous',
 'Columbia-Shuswap Regional District'
), (
 'Village of Canal Flats',
 'Canal Flats',
 'Regional District of East Kootenay'
), (
 'The Corporation of the City of Cranbrook',
 'Cranbrook',
 'Regional District of East Kootenay'
), (
 'District of Elkford',
 'Elkford',
 'Regional District of East Kootenay'
), (
 'The Corporation of the City of Fernie',
 'Fernie',
 'Regional District of East Kootenay'
), (
 'District of Invermere',
 'Invermere',
 'Regional District of East Kootenay'
), (
 'Jumbo Glacier Mountain Resort Municipality',
 'Jumbo Glacier',
 'Regional District of East Kootenay'
), (
 'City of Kimberley',
 'Kimberley',
 'Regional District of East Kootenay'
), (
 'Village of Radium Hot Springs',
 'Radium Hot Springs',
 'Regional District of East Kootenay'
), (
 'District of Sparwood',
 'Sparwood',
 'Regional District of East Kootenay'
), (
 'City of Grand Forks',
 'Grand Forks',
 'Regional District of Kootenay Boundary'
), (
 'City of Greenwood',
 'Greenwood',
 'Regional District of Kootenay Boundary'
), (
 'Village of Midway',
 'Midway',
 'Regional District of Kootenay Boundary'
), (
 'Corporation of the Village of Tofino',
 'Tofino',
 'Regional District of Alberni-Clayoquot'
), (
 'District of Ucluelet',
 'Ucluelet',
 'Regional District of Alberni-Clayoquot'
), (
 'The Corporation of the District of Central Saanich',
 'Central Saanich',
 'Capital Regional District'
), (
 'City of Colwood',
 'Colwood',
 'Capital Regional District'
), (
 'The Corporation of the Township of Esquimalt',
 'Esquimalt',
 'Capital Regional District'
), (
 'District of Highlands',
 'Highlands',
 'Capital Regional District'
), (
 'City of Langford',
 'Langford',
 'Capital Regional District'
), (
 'District of Metchosin',
 'Metchosin',
 'Capital Regional District'
), (
 'District of North Saanich',
 'North Saanich',
 'Capital Regional District'
), (
 'The Corporation of the District of Oak Bay',
 'Oak Bay',
 'Capital Regional District'
), (
 'The Corporation of the District of Saanich',
 'Saanich',
 'Capital Regional District'
), (
 'Town of Sidney',
 'Sidney',
 'Capital Regional District'
), (
 'District of Sooke',
 'Sooke',
 'Capital Regional District'
), (
 'The Corporation of the City of Victoria',
 'Victoria',
 'Capital Regional District'
), (
 'Town of View Royal',
 'View Royal',
 'Capital Regional District'
), (
 'Village of Cumberland',
 'Cumberland',
 'Comox Valley Regional District'
), (
 'Town of Comox',
 'Comox',
 'Comox Valley Regional District'
), (
 'The Corporation of the City of Courtenay',
 'Courtenay',
 'Comox Valley Regional District'
), (
 'The Corporation of the City of Duncan',
 'Duncan',
 'Cowichan Valley Regional District'
), (
 'Town of Ladysmith',
 'Ladysmith',
 'Cowichan Valley Regional District'
), (
 'Town of Lake Cowichan',
 'Lake Cowichan',
 'Cowichan Valley Regional District'
), (
 'The Corporation of the District of North Cowichan',
 'North Cowichan',
 'Cowichan Valley Regional District'
), (
 'The Corporation of the Village of Alert Bay',
 'Alert Bay',
 'Regional District of Mount Waddington'
), (
 'Village of Port Alice',
 'Port Alice',
 'Regional District of Mount Waddington'
), (
 'District of Port Hardy',
 'Port Hardy',
 'Regional District of Mount Waddington'
), (
 'Town of Port McNeill',
 'Port McNeill',
 'Regional District of Mount Waddington'
), (
 'City of Parksville',
 'Parksville',
 'Regional District of Nanaimo'
), (
 'District of Lantzville',
 'Lantzville',
 'Regional District of Nanaimo'
), (
 'City of Nanaimo',
 'Nanaimo',
 'Regional District of Nanaimo'
), (
 'Town of Qualicum Beach',
 'Qualicum Beach',
 'Regional District of Nanaimo'
), (
 'City of Powell River',
 'Powell River',
 'qathet Regional District'
), (
 'Town of Gibsons',
 'Gibsons',
 'Sunshine Coast Regional District'
), (
 'District of Sechelt',
 'Sechelt',
 'Sunshine Coast Regional District'
), (
 'City of Campbell River',
 'Campbell River',
 'Strathcona Regional District'
), (
 'Village of Gold River',
 'Gold River',
 'Strathcona Regional District'
), (
 'Village of Sayward',
 'Sayward',
 'Strathcona Regional District'
), (
 'Village of Tahsis',
 'Tahsis',
 'Strathcona Regional District'
),
(
 'Lower Nicola',
 'Nicola',
 'Lower County'
),
(
 'Tsawwassen',
 'Tsawwassen',
 'City of Delta'
),
(
 'The Corporation of the Village of Zeballos',
 'Zeballos',
 'Strathcona Regional District'
)) AS MSrc (Name, Abbreviation, GroupName)
ON Target.Name = MSrc.NAME
WHEN MATCHED THEN
UPDATE
SET Target.Abbreviation = MSrc.Abbreviation, Target.GroupName = MSrc.GroupName
WHEN NOT MATCHED THEN
INSERT (Name, Abbreviation, GroupName) VALUES (MSrc.Name, MSrc.Abbreviation, MSrc.GroupName);

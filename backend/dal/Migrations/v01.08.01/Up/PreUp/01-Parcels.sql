PRINT 'Transfer Capital Management Branch Parcels to School Districts'

DECLARE @CMBId INT = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'CMB')

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 05')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Southeast Kootenay', 'Cranbrook', 'Fernie', 'Elkford', 'Sparwood', 'Hosmer', 'Corbin', 'Fort Steele', 'Elko', 'Jaffray', 'Rooseville', 'Newgate', 'Flathead', 'Grasmere', 'Baker', 'Wardner', 'Bull River', 'Moyie', 'Wycliffe')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 06')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Rocky Mountain', 'Invermere', 'Kimberley', 'Radium Hit Springs', 'Golden', 'Field', 'Marysville')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 08')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Kootenay Lake', 'Creston', 'Salmo', 'Nelson', 'Kaslo', 'Slocan', 'Kootenay', 'Duncan Lake', 'Winlaw', 'Taghum', 'Queens Bay', 'Procter', 'Hot Springs', 'Riondel Ainsworth', 'Argenta', 'Gerrard', 'Howser', 'Kitchener', 'Yahk', 'Erickson', 'Kingsgate', 'Rykerts', 'Nelway')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 10')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Arrow Lakes', 'Edgewood', 'Burton', 'Shoreholme', 'Silverton', 'New Denver', 'Nakusp', 'Fauquier')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 19')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Revelstoke', 'Beaton', 'Mica Creek')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 20')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Castlegar', 'Rossland', 'Trail', 'Montrose', 'Warfield', 'Fruitvale', 'Renata', 'Robson', 'Glade')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 22')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Vernon', 'Lumby', 'Coldstream', 'Mabel Lake', 'Cherryville', 'Oyama')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 23')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Central Okanagan', 'Kelowna', 'Peachland', 'Lake Country', 'Westbank', 'West Kelowna')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 27')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('150 Mile House', 'Riske Creek', 'Bridge Lake', 'Mcleese Lake', 'Likely', 'Ulkatcho', 'Anahim Lake', 'Towdystan', 'Kleena Kleene', 'Tatla Lake', 'Redstone', 'Alexis Creek', 'Williams Lake', '100 Mile House', 'Horsefly', 'Quesnel Lake', 'Canim Lake', 'Mahood Lake')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 28')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Quesnel', 'Nazko', 'Wells')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 33')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Chilliwack', 'Rosedale', 'Cultus Lake', 'Sardis')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 34')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Abbotsford')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 35')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Langley', 'Langley City', 'Aldergrove')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 36')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Surrey', 'White Rock')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 37')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Delta', 'Tsawwassen')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 38')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Richmond')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 39')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Vancouver')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 40')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('New Westminster', 'Garibaldi Highlands')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 41')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Burnaby')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 42')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Maple Ridge', 'Pitt Meadows', 'Alvin')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 43')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Coquitlam', 'Port Coquitlam', 'Anmore', 'Belcarra', 'Port Moody')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 44')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('North Vancouver', 'Vancouver City')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 45')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('West Vancouver', 'Lions Bay', 'Bowen Island')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 46')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Sunshine Coast', 'Sechelt', 'Gibsons', 'Egmont', 'Madeira Park', 'Selma Park', 'Roberts Creek', 'Lasqueti Island', 'Texada Island')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 47')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Powell River', 'Lang Bay', 'Saltery Bay', 'Lund', 'Blubber Bay', 'Gillies Bay', 'Cortes Island')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 48')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Sea to Sky', 'Pemberton', 'Whistler', 'Birken', 'Mount Currie', 'Garibaldi', 'Brackendale', 'Squamish', 'Britannia Beach')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 49')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Central Coast', 'Bella Bella', 'Ocean Falls', 'Bella Coola', 'Hagensborg', 'Namu', 'Rivers Inlet', 'Dawsons Landing', 'Goose Bay')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 50')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Haida Gwaii', 'Masset', 'Skidegate', 'Sandspit', 'Queen Charlotte', 'Tamu', 'Queen Charlotte City', 'Juskatla', 'Skidegate Landing', 'Tlell', 'Port Clements')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 51')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Boundary', 'Beaverdell', 'Rock Creek', 'Westbridge', 'Bridesville', 'Kettle Valley', 'Greenwood', 'Midway', 'Grand Forks', 'Christina Lake')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 52')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Prince Rupert', 'Georgetown Mills', 'Port Edward', 'Metlakatla', 'Kitkatla', 'Port Essington', 'Hartley Bay')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 53')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Okanagan Similkameen', 'Hedley', 'Keremeos', 'Oliver', 'Osoyoos', 'Cawston')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 54')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Houston', 'Smithers', 'Telkwa', 'Glentanna')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 57')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Hixon', 'Mackenzie', 'McLeod Lake', 'Summit Lake', 'Reid Lake', 'Prince George', 'Beaverley', 'Baldy Hughes', 'Willow River', 'Longworth', 'Penny', 'Dome Creek', 'McBride', 'Dunster', 'Valemount', 'Albreda', 'Cedarside', 'Tete Jaune Cache')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 58')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Nicola-Similkameen', 'Princeton', 'Merritt', 'Quilchena', 'Aspen Grove', 'Bankeir', 'Coalmont', 'Manning Park', 'Lower Nicola')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 59')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Peace River South', 'Chetwynd', 'Dawson Creek', 'Pine Valley', 'Tumbler Ridge', 'Kelly Lake', 'Tomslake', 'Pouce Coupe', 'Doe River', 'Rolla', 'Arras', 'East Pine', 'Lone Prairie', 'Moberly Lake')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 60')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Peace River North', 'Fort St. John', 'Taylor', 'Clayhurst', 'Goodlow', 'Doig River', 'Rose Prairie', 'Buick', 'Wonowon', 'Trutch', 'Pink Mountain', 'Upper Halfway', 'Hudson''s Hope', 'Ware', 'Ingenika Mine')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 61')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Greater Victoria', 'Victoria', 'Saanich', 'View Royal', 'Oak Bay', 'Esquimalt')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 62')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Sooke', 'Metchosin', 'Colwood', 'Langford', 'Highlands', 'Jordan River', 'Port Renfrew')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 63')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Sidney', 'North Saanich', 'Central Saanich', 'Saanichton')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 64')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Gulf Islands', 'Saltspring Island', 'Prevost Island', 'Galiano Island', 'Mayne Island', 'Pender Islands', 'Pender Island', 'Saturna Island', 'Ganges', 'Kincolith')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 67')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Okanagan Skaha', 'Summerland', 'Penticton', 'Naramata', 'Kaleden', 'Okanagan Falls')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 68')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Nanaimo-Ladysmith', 'Nanaimo', 'Ladysmith', 'Cedar', 'Wellington', 'Lantzville', 'Gabriola Island', 'Cassidy')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 69')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Qualicum', 'Qualicum Beach', 'French Creek', 'Parksville', 'Nanoose Bay', 'Errington', 'Qualicum Bay')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 70')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Pacific Rim', 'Ahousaht', 'Hesquiat', 'Hot Springs Cove', 'Clayoquot', 'Tofino', 'Port Albion', 'Ucluelet', 'Sproat Lake', 'Port Alberni', 'Nahmint', 'Bamfield')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 71')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Comox Valley', 'Comox', 'Black Creek', 'Grantham', 'Courtenay', 'Cumberland', 'Fanny Bay', 'Hornby Island', 'Denman Island')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 72')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Campbell River', 'Sayward', 'Quathiaski Cove', 'Read Island', 'Quadra Island')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 73')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Kamloops-Thompson', 'Thompson', 'Blue River', 'Stillwater', 'Avola', 'Vavenby', 'Clearwater', 'Little Fort', 'Darfield', 'Barriere', 'McLure', 'Adams Lake', 'Chase', 'Pritchard', 'Monte Lake', 'Kamloops', 'Savona', 'Lac Le Jeune', 'Logan Lake')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 74')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Gold Trail', 'Bib Bar Creek', 'Clinton', 'Pavilion', 'Ogden', 'Shalalth', 'Lillooet', 'Cahce Creek', 'Ashcroft', 'Boston Flats', 'Spences Bridge', 'Lytton', 'Agate', 'Kanaka Bar', 'Goldbridge')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 75')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Mission', 'Deroche', 'Lake Errock')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 78')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Fraser-Cascade', 'Cache Creek', 'Kent', 'Agassiz', 'Harrison Hot Springs', 'Skookumchuck', 'Boston Bar', 'Yale', 'Hope')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 79')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Cowichan Valley', 'Gordon River', 'Lake Cowichan', 'Cowichan Lake', 'Youbou', 'Cowichan Bay', 'Chemainus', 'Mill Bay', 'Duncan', 'North Cowichan', 'Thetis Island', 'Shawnigan Lake', 'Cobble Hill')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 81')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Fort Nelson', 'Toad River', 'Liard River', 'Muncho Lake', 'Snake River', 'Prophet River', 'Fontas')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 82')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Coast Mountains', 'Terrace', 'Stikine', 'Stewart', 'Alice Arm', 'Cranberry Junction', 'Gitanyow', 'Kispiox', 'Hazelton', 'New Hazelton', 'Rosswood', 'Lakelse Lake', 'Kitimat', 'Nechako', 'Kitamaat Village', 'Kildala Arm', 'Kemano', 'Kemano Beach', 'Butedale', 'Klemtu')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 83')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('North Okanagan-Shuswap', 'Albas', 'St. Ives', 'Saint Ives', 'Sicamous', 'Tappen', 'Canoe', 'Grindrod', 'Enderby', 'Salmon Arm', 'Spallumcheen', 'Armstrong', 'Falkland', 'Scotch Creek')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 84')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Vancouver Island West', 'Gold River', 'Tahsis', 'Zeballos', 'Kyuquot', 'Esperanza')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 85')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Vancouver Island North', 'Holberg', 'Quatsino', 'Coal Harbour', 'Port Hardy', 'Sointula', 'Alert Bay', 'Port McNeill', 'Port Alice', 'Telegraph Cove', 'Nimpkish', 'Woss', 'Kingcome Inlet', 'Minstrel Island', 'Sullivan Bay')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 87')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Stikine', 'Dease Lake', 'Atlin', 'Cassiar', 'Tulsequash', 'Telegraph Creek', 'Boulder City', 'Lower Post', 'Kinaskan Lake', 'Cry Lake')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 91')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Francois Lake', 'Nechako Lakes', 'Bear Lake', 'Tchentlo Lakes', 'Takla Lake', 'Fort Babine', 'Smithers Landing', 'Granisle', 'Topley Landing', 'Babine Lake', 'Topley', 'Chuchi Lake', 'Trembleur Lake', 'Grand Rapids', 'Tachie', 'Pinchi', 'Fort St. James', 'Dog Creek', 'Donald Landing', 'Decker Lake', 'Bulkley Lake', 'Burns Lake', 'Fraser Lake', 'Fort Fraser', 'Vanderhoof', 'Fancois Lake', 'Grassy Plains', 'Tahtsa Lake', 'Whitesail Reach', 'Ootsa Lake', 'Whitesail Lake', 'Eutsuk Lake', 'Cheslatta Lake', 'Newstubb Lake', 'Natalkuz Lake')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 92')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Nisga''a', 'Kitwanga', 'Nass Camp', 'New Aiyansh', 'Laxgalts''ap')
    AND p.[AgencyId] = @CMBId

UPDATE p
    SET p.[AgencyId] = (SELECT [Id] FROM dbo.[Agencies] WHERE [Code] = 'SD 93')
FROM dbo.[Parcels] p
JOIN dbo.[Addresses] a ON p.AddressId = a.Id
WHERE a.[AdministrativeArea] IN ('Conseil scolaire francophone')
    AND p.[AgencyId] = @CMBId

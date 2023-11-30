PRINT 'Update AdministrativeAreas'

-- Insert the new regional districts into the AdministrativeAreas tsble.
INSERT INTO dbo.[AdministrativeAreas] ([Name], [Abbreviation])
VALUES
('Regional District of Bulkley-Nechako', 'RDBN'),
('Cariboo Regional District', 'CRD'),
('Regional District of Fraser-Fort George', 'RDFFG'),
('Regional District of Kitimat-Stikine', 'RDKS'),
('Peace River Regional District', 'PRRD'),
('North Coast Regional District', 'NCRD'),
('Regional District of Central Okanagan', 'RDCO'),
('Fraser Valley Regional District', 'FVRD'),
('Metro Vancouver Regional District', 'MVRD'),
('Regional District of Okanagan-Similkameen', 'RDOS'),
('Squamish-Lillooet Regional District', 'SLRD'),
('Thompson-Nicola Regional District', 'TNRD'),
('Regional District of Central Kootenay', 'RDCK'),
('Columbia Shuswap Regional District', 'CSRD'),
('Regional District of East Kootenay', 'RDEK'),
('Regional District of Kootenay Boundary', 'RDKB'),
('Regional District of North Okanagan', 'RDNO'),
('Regional District of Alberni-Clayoquot', 'RDAC'),
('Capital Regional District', 'CAPRD'),
('Central Coast Regional District', 'CCRD'),
('Comox Valley Regional District', 'CMXRD'),
('Cowichan Valley Regional District', 'CVRD'),
('Regional District of Mount Waddington', 'RDMW'),
('Regional District of Nanaimo', 'RDN'),
('qathet Regional District', 'qRD'),
('Sunshine Coast Regional District', 'SCRD'),
('Strathcona Regional District', 'STRD'),
('Stikine Region (Unincorporated)', 'STIK');
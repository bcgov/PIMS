# Property Check Scripts

## Purpose

This script allows users to perform numerous tasks on a property dataset given. See flags section for full information on all the operations this script can perform. 
This script was created to help resolve some bad data stored within PIMS. [Firework Cluster Ticket](https://citz-imb.atlassian.net/browse/PIMS-1681) was the start of this work and it spiraled from there.


## Setup

1. Python must be installed on your local system for this to work.
   - To check if Python is installed on your system try running the following on a command line:

     `python --version` OR `python3 --version`
     
     If you get a result similar to "Python x.x.x" you may procede.

     If you get a result similar to "python: command not found" please navigate to the [Python download site](https://www.python.org/downloads/) to download.

2. shapely must be installed to run with flags: run, p, and l. To install please run

    `pip install shapely` OR `pip3 install shapely`

    If you are unsure if the package is correctly installed try running the script. If shapely is not installed you will get a message similar to "Must have the following packages to run: ['shapely']." 

Place the file you would like to process in the 'data' folder.
3. Run the script with the following structure. Use python3 if that is what worked in step 1: 

    `python(3) <path_to_property_check.py>property_check.py.py <flag1> <file1>`

    If you would like to run with multiple flags and files include them in the same pattern proceeding the first flag and file. eg: 

    `python3 property_check.py.py -run data.csv -m other_data.csv`

    This command will run process 'run' on the file data.csv and the process 'm' on the file other_data.csv. 

## Flags

The following flags can be used when running the script. Note that each of the flags must be followed with a file name of a file stored within the 'data' folder. 

### -run 

Running the script followed by a '-run' flag will start the proess laid out in process_data.py. The scructure of this process can be viewed in [process_data.drawio.png](./process_data.drawio.png)

Required Column(s): "Address1", "City", "Point", "PID"

Example: `python3 property_check.py.py -run data_to_check.csv`

### -m

Running the script followed by a '-m' flag will go through the given file and remove any rows that have Ministries matching those found on line 21 in file property_check.py

Required Column(s): "Ministry"

Example: `python3 property_check.py.py -m data_with_many_ministries.csv`

### -p

Running the script followed by a '-p' flag will go through the given file and check the polygon returned from openmaps.gov.bc.ca by sending in the stored PID. Lines will be removed if the point stored falls within the polygon.

Required Column(s): "Point", "PID"

Example: `python3 property_check.py.py -p check_point_by_PID.csv`

### -l

Running the script followed by a '-l' flag will go through the given file and check the PID returned from openmaps.gov.bc.ca by sending in the stored point. Lines will be removed if the PID stored doesn't match the returned PID.

Required Column(s): "Point", "PID"

Example: `python3 property_check.py.py -l check_PID_by_point.csv`

### -c

Running the script followed by a '-c' flag will go through the given file and check the city (municipality) returned from openmaps.gov.bc.ca by sending in the stored PID. Lines will be removed if the city stored doesn't match the returned city.

Required Column(s): "Point", "PID", "City"

Example: `python3 property_check.py.py -c check_city_by_pid.csv`


## Notes

Any output files will be written into the data folder. 

Any files used in the command line to run the script need to be in the data folder at the time that you run the script. 

Don't include the path with '/data/' in the filename when running the script.

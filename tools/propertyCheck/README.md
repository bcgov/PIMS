# Property Check Scripts

## Purpose

This script allows users to perform numerous tasks on a property dataset given. See flags section for full information on all the operations this script can perform. 
This script was created to help resolve some bad data stored within PIMS. [Firework Cluster Ticket](https://citz-imb.atlassian.net/browse/PIMS-1681) was the start of this work and it spiraled from there.

## Instructions

### Setup

1. Python must be installed on your local system for this to work.
   - To check if Python is installed on your system try running the following on a command line:

     `python --version` OR `python3 --version`
     
     If you get a result similar to "Python x.x.x" you may procede.

     If you get a result similar to "python: command not found" please navigate to the [Python download site](https://www.python.org/downloads/) to download.
2. Place the file you would like to process in the 'data' folder.
3. Run the script with the following structure. Use python3 if that is what worked in step 1: 

    `python(3) <path_to_propertyCheck>propertyCheck.py <flag1> <file1>`

    If you would like to run with multiple flags and files include them in the same pattern proceeding the first flag and file. eg: 

    `python3 propertyCheck.py -run data.csv -m other_data.csv`

## Flags

The following flags can be used when running the script. Note that each of the flags must be followed with a file name of a file stored within the 'data' folder. 

### -run TAYLOR PUT LINK TO PROCESS IMG HERE 

Running the script followed by a '-run' flag will start the proess laid out in process_data.py. The scructure of this process can be viewed in 'file name here'

Required Column(s): "Address1", "City", "Point", "PID"

Example: `python3 propertyCheck.py -run data_to_check.csv`

### -m

Running the script followed by a '-m' flag will go through the given file and remove any rows that have Ministries matching those found on line 21 in file property_check.py

Required Column(s): "Ministry"

Example: `python3 propertyCheck.py -m data_with_many_ministries.csv`

### -p

Running the script followed by a '-p' flag will go through the given file and check the polygon returned from openmaps.gov.bc.ca by sending in the stored PID. Lines will be removed if the point stored falls within the polygon.

Required Column(s): "Point", "PID"

Example: `python3 propertyCheck.py -m check_data_by_PID.csv`

### -l

### -c

### Notes

- Make sure to switch the integration information in your `.env` between extract and import commands.

#!/bin/bash
MNAME=$1;
cd backend/dal;

FILE1=./Migrations/$(basename ./Migrations/*_$MNAME.cs);
echo "Updating migration '$FILE1'";

sed -i "2iusing Pims.Dal.Helpers.Migrations;" $FILE1;

search=":\ Migration";
replace=":\ SeedMigration";
sed -i "s/$search/$replace/" $FILE1;

fl1=$(grep -n "protected override void Up(MigrationBuilder migrationBuilder)" $FILE1 | head -n 1 | cut -d: -f1);
l1=$(($fl1 + 2));
sed -i "${l1}i\ \ \ \ \ \ \ \ \ \ \ \ PreUp(migrationBuilder);" $FILE1;

fl=$(grep -n "protected override void Down(MigrationBuilder migrationBuilder)" $FILE1 | head -n 1 | cut -d: -f1);
l2=$(($fl - 2));
sed -i "${l2}i\ \ \ \ \ \ \ \ \ \ \ \ PostUp(migrationBuilder);" $FILE1;

l3=$(($fl + 3));
sed -i "${l3}i\ \ \ \ \ \ \ \ \ \ \ \ PreDown(migrationBuilder);" $FILE1;

eofl=$(wc -l $FILE1 | awk '{ print $1 }');
l4=$(($eofl - 2));
sed -i "${l4}i\ \ \ \ \ \ \ \ \ \ \ \ PostDown(migrationBuilder);" $FILE1;

code -r $FILE1


import re
import json
import argparse
from datetime import datetime

def update_md_table(md_file_path, json_data):
    with open(md_file_path, 'r') as file:
        md_content = file.read()

    start_pattern = r'<!-- START_UPDATE_TABLE -->'
    end_pattern = r'<!-- END_UPDATE_TABLE -->'

    start_match = re.search(start_pattern, md_content)
    end_match = re.search(end_pattern, md_content)

    if start_match and end_match:
        start_index = start_match.end()
        end_index = end_match.start()

        table_content = md_content[start_index:end_index].strip()
        updated_table_content = generate_updated_table(table_content, json_data)

        updated_md_content = md_content[:start_index] + '\n' + updated_table_content + '\n' + md_content[end_index:]

        with open(md_file_path, 'w') as f:
            f.write(updated_md_content)

        print("Markdown file updated successfully.")
    else:
        print("Unable to find start or end pattern in the Markdown file.")

def generate_updated_table(existing_table, json_data):
    header, rows = existing_table.split('\n|', 1)
    updated_rows = ''

    for entry in json_data["data"]:
        row = f"| {entry['Target']} | {entry['Latest Build Image Tag']} | {entry['Deployed Image Tag in DEV']} | {entry['Deployed Image Tag in TEST']} | {entry['Deployed Image Tag in PROD']} |"
        updated_rows += row + '\n'

    markings = "|:------------:|:------------:|:------------:|:------------:|:------------:|"
    
    updated_table = f"{header}\n{markings}\n{updated_rows}"

    return updated_table

def update_json_data(md_file_path, target, column, value):
    # Read wiki.md to extract the existing table data
    with open(md_file_path, 'r') as file:
        content = file.read()

    # Extract table data using regular expressions
    table_start = "<!-- START_UPDATE_TABLE -->"
    table_end = "<!-- END_UPDATE_TABLE -->"
    table_pattern = re.compile(f'{table_start}(.*?){table_end}', re.DOTALL)
    existing_table_match = table_pattern.search(content)

    if existing_table_match:
        existing_table = existing_table_match.group(1).strip()
    else:
        print("Error: Could not find the existing table in wiki.md.")
        exit(1)

    # Parse the existing table and update the JSON data
    header, *rows = (line.split("|") for line in existing_table.split("\n") if line.strip())

    data = {"data": []}

    for row in rows:
        values = [cell.strip() for cell in row]

        # Skip the row if the "Target" column has a value of ':------------:'
        if values[1] == ':------------:':
            continue

        # Remove empty key-value pairs from the entry
        entry = {header[i].strip(): values[i] if values[i].isdigit() else values[i] for i in range(1, len(header)) if header[i].strip() != ""}
        data["data"].append(entry)

    # Get the current date and time
    current_datetime = datetime.now()

    # Format the date and time
    formatted_date = current_datetime.strftime('%b %d, %Y')  # Example: Nov 15, 2023
    # Update the JSON data based on user input
    for entry in data["data"]:
        if entry["Target"] == target:
            entry[column] = f"[{value}](https://github.com/bcgov/PIMS/pull/{value})<br>📅 `{formatted_date}`"

    return data

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update Markdown file based on user input.")
    parser.add_argument("md_file", help="Path to the Markdown file (wiki.md)")
    parser.add_argument("target", help="Target value")
    parser.add_argument("column", help="Column name")
    parser.add_argument("value", help="Value to set in the specified column")
    
    args = parser.parse_args()

    json_data = update_json_data(args.md_file, args.target, args.column, args.value)

    update_md_table(args.md_file, json_data)

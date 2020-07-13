# Excel Converter Tool

The Excel Converter Tool provides a way to transform an Excel Worksheet into a JSON file.

By default any files in the `./Data` folder will not be included in source. This provides a simple place to keep your data.

## Configuration

You can control the JSON serialization and the column conversions.

| Key                                                  | Type   | Default                                | Description                                                               |
| ---------------------------------------------------- | ------ | -------------------------------------- | ------------------------------------------------------------------------- |
| ASPNETCORE_ENVIRONMENT                               | string | [Local, Development, Test, Production] | The environment controls what configuration files is used                 |
| Serialization\_\_Json\_\_IgnoreNullValues            | bool   | true                                   | Whether to ignore null values when serializing JSON [true, false].        |
| Serialization\_\_Json\_\_PropertyNameCaseInsensitive | bool   | true                                   | Whether to ignore case sensitivity when deserializing JSON [true, false]. |
| Serialization\_\_Json\_\_PropertyNamingPolicy        | string | CamelCase                              | What property naming policy to use when serializing JSON [CamelCase].     |
| Serialization\_\_Json\_\_WriteIndented               | bool   | true                                   | Whether to indent serialized JSON [true, false].                          |
| Converter\_\_Sources                                 | array  |                                        | The configuration for each source.                                        |

> Note **Converter:Sources** can be overridden in the `.env` file by using the **index** position (i.e. `Converter\_\_Sources\_\_0\_\_File`).

### Sources Configuration

| Key               | Type       | Default          | Description                                                                             |
| ----------------- | ---------- | ---------------- | --------------------------------------------------------------------------------------- |
| Sources:File      | string     | ./Data/data.xlsx | The Excel file to convert                                                               |
| Sources:Output    | string     | ./Data/data.json | The path to the output JSON file                                                        |
| Sources:SheetName | string     | ReportingExport  | The name of the Worksheet to convert into JSON                                          |
| Sources:Columns   | dictionary |                  | A mapping configuration to convert each Excel column into the appropriate JSON property |

### Column Mapping Configuration

For each column you can configure the desired JSON output.

| Key                                   |  Type  | Default | Description                                                                       |
| :------------------------------------ | :----: | :------ | :-------------------------------------------------------------------------------- |
| Columns:{Excel Column Name}           | string |         | The column name from Excel                                                        |
| Columns:{Excel Column Name}:Name      | string |         | The name of the property in the JSON output                                       |
| Columns:{Excel Column Name}:Type      | string |         | The type name of the property in the JSON output                                  |
| Columns:{Excel Column Name}:Converter | string |         | The name of the function to convert the Excel column data [_ConvertToFiscalYear_] |

## Setup

Create a `.env` file and configure the source Excel file and the output path.

```conf
Converter__File=./Data/{YOUR EXCEL FILE NAME}.xlsx
Converter__Output=./Data/data.json
```

Copy your Excel file to the above configured location and run the application.

## Run

```sh
dotnet run
```

The output JSON file will be generated.

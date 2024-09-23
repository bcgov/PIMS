# Check if arguments were forgotten.
if [ $# -eq 0 ]
then
  echo "
  No arguments detected. Valid commands are as follows: 
    - npm run migration create <migrationName> 
    - npm run migration generate <migrationName> 
    - npm run migration run 
    - npm run migration revert"
  exit 1
fi

# Colours for text output.
RED='\033[0;31m'
NC='\033[0m' # No Color

# If the recommended name argument was missing, run commands with default name.
function missing_name {
  echo "${RED}WARNING: Missing argument for migration name.${NC} Using default name 'migration'.";
  if [ $1 = "create" ]
  then
    npm run typeorm -- migration:$1 ./src/typeorm/migrations/migration
  else
    npm run typeorm -- migration:$1 -d ./src/appDataSource.ts ./src/typeorm/migrations/migration
  fi
  exit 0
}

# Switch statement decides migration action.
case $1 in
  "create") 
    if [ -z "$2"]
    then
      missing_name $1
    fi
    npm run typeorm -- migration:create ./src/typeorm/migrations/$2
    ;;
  "generate")
    if [ -z "$2"]
    then
      missing_name $1
    fi
    npm run typeorm -- migration:generate -d ./src/appDataSource.ts ./src/typeorm/migrations/$2
    ;;
  "run")
    npm run typeorm -- migration:run -d ./src/appDataSource.ts
    ;;
  "revert")
    npm run typeorm -- migration:revert -d ./src/appDataSource.ts
    ;;
esac

import * as React from 'react';

/**
 * Help Text for the Property Inventory List topic.
 */
const InventoryListHelpText = () => {
  return (
    <p>
      Properties are returned in a table format. Each row provides a summary of the property
      attributes. If a property is a parcel it can be expanded to display all buildings associated
      with it. Click the ‘view’ link to go to the Property Detail View page. The active list of
      properties can be exported to both Excel and CSV. Use the Edit icon (pencil) to toggle editing
      on and off in this table.
    </p>
  );
};

export default InventoryListHelpText;

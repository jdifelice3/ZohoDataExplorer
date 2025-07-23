import React, { useRef, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';

const ContactsDetailRenderer = (props) => {
  const gridRef = useRef();

  useEffect(() => {
    props.api.setDetailGridInfo(`detail_${props.data.id}`, {
      api: gridRef.current.api,
      columnApi: gridRef.current.columnApi
    });
  }, [props]);

  const handleAddContact = () => {
    console.log(`Add contact for ${props.data.clientName}`);
    // Your custom logic here (open modal, call API, etc.)
  };

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <button onClick={handleAddContact}>Add Contact</button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 200, width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          rowData={props.data.contacts}
          columnDefs={[
            { field: 'name' },
            { field: 'email' },
          ]}
          defaultColDef={{ flex: 1 }}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default ContactsDetailRenderer;

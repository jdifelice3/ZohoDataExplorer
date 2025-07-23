import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import QueryBuilder from 'react-querybuilder';
import { fetchContacts } from '../services/db/fetchContacts.js';
import { contactsQueryFields } from '../constants/queryBuilder/contactsFields.js';

// Hooks
import useSyncRefWithState from '../hooks/useSyncRefWithState';
import useGridInit from '../hooks/useGridInit.js';

const Contacts = () => {
  const gridRef = useRef();
  const [query, setQuery] = useState({ combinator: 'and', rules: [] });
  const queryRef = useRef(query);
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef('');

   useSyncRefWithState(queryRef, query);
   useGridInit(gridRef);

  const columnDefs = useMemo(() => [
    { field: 'Client Name' },
    { field: 'First Name' },
    { field: 'Last Name' },
    { field: 'Email' },
    { field: 'Associated Tags' }
  ], []);


  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }), []);

const onGridReady = useCallback((params) => {
    console.log('✅ Grid ready');
    console.log('API:', Object.keys(params.api));

    const datasource = {
      getRows(params) {
        const activeSearchTerm = searchRef.current; // ✅ current value

        fetchContacts({
          search: activeSearchTerm,
          query: queryRef.current,
          startRow: params.request.startRow,
          endRow: params.request.endRow,
          sortModel: params.request.sortModel,
          filterModel: params.request.filterModel
        })
        .then(data => {
          console.log("📦 Full API response:", data);
          console.log("📦 Total Count:", data.lastRow);
          params.successCallback(data.rows, data.lastRow);
        })
        .catch(() => {
          params.failCallback();
        });
      }
    };
    
    params.api.setServerSideDatasource(datasource);

  }, [searchTerm]);


  return (
    <div style={{ padding: '10px', height: '50vh', width: '100%' }}>
      <div className="ag-theme-alpine" style={{ marginBottom: '10px', fontSize: '20pt', fontWeight:'bold'}}>
        Contacts
    </div>
      <div>
        <QueryBuilder
          fields={contactsQueryFields}
          query={query}
          onQueryChange={(q) => {
            console.log("Original query:", query);
            setQuery(q);
            console.log("New query:", query);
          }}
          controlElements={{
            addGroupAction: () => '',
          }}
        />
        <div className="advancedFilterContainer">
          <button className="advancedFilter" onClick={() => gridRef.current.api.purgeServerSideCache()}>Apply Filter</button>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowModelType="serverSide"
          pagination={true}
          paginationPageSize={50}
          cacheBlockSize={100}
          rowSelection="single"
          getRowId={(params) => params.data.id}
          onGridReady={onGridReady}
          serverSideStoreType="partial"
        />

      </div>
    </div>
  );
};

export default Contacts;


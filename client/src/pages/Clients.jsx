 import React, { useRef, useState, useCallback, useMemo } from 'react';
 import { AgGridReact } from 'ag-grid-react';
 import QueryBuilder from 'react-querybuilder';
 import { fetchClients } from '../services/db/fetchClients.js';
 import { fetchContacts } from '../services/db/fetchContacts.js';
 import { putClient } from '../services/db/putClient.js';
 import { clientsQueryFields } from '../constants/queryBuilder/clientsFields';
 import { industryValues } from '../constants/queryBuilder/industryValues.js';
 import useSyncRefWithState from '../hooks/useSyncRefWithState';
 import useGridInit from '../hooks/useGridInit.js';
 
 const Clients = () => {
   const [query, setQuery] = useState({ combinator: 'and', rules: [] });
   const queryRef = useRef(query);
   const gridRef = useRef();
   const [searchTerm, setSearchTerm] = useState('');
   const searchRef = useRef('');
 
   useSyncRefWithState(queryRef, query);
   useGridInit(gridRef);
 
   const customTranslations = {
     addRule: '➕ New Condition'
   }  
 
   const columnDefs = useMemo(() => [
     {
       headerName: '',
       field: 'expand',
       width: 75,
       suppressMenu: true,
       suppressNavigable: true,
       cellRendererFramework: (params) => {
         const isExpanded = params.node.expanded;
         return (
           <span
             onClick={(e) => {
               e.stopPropagation();
               params.node.setExpanded(!isExpanded);
               params.api.refreshCells({
                 columns: ['expand'],
                 rowNodes: [params.node],
                 force: true,
               });
             }}
             style={{ cursor: 'pointer', fontSize: '1.5rem' }}
           >
             {isExpanded ? '▾' : '▸'}
           </span>
         );
       }
     },
     { field: 'Client Name' },
     { field: 'Number of Contacts' },
     {
       field: 'Industry',
       editable: true,
       cellEditor: 'agSelectCellEditor',
       cellEditorParams: { values: industryValues }
     }
   ], []);
 
   const contactColumnDefs = useMemo(() => [
     { field: 'First Name' },
     { field: 'Last Name' },
     { field: 'Email' },
     { field: 'Associated Tags' }
   ], []);
 
   const defaultColDef = useMemo(() => ({
     sortable: true,
     resizable: true,
     filter: true,
     editable: true
   }), []);
 
   const onGridReady = useCallback((params) => {
     const datasource = {
       getRows: (params) => {
         fetchClients({
           search: searchRef.current,
           query: queryRef.current,
           startRow: params.request.startRow,
           endRow: params.request.endRow,
           sortModel: params.request.sortModel,
           filterModel: params.request.filterModel,
         })
           .then(data => params.successCallback(data.rows, data.lastRow))
           .catch(err => {
             console.error("Error fetching clients:", err);
             params.failCallback();
           });
       }
     };
     params.api.setServerSideDatasource(datasource);
   }, []);
 
   const getDetailRowData = useCallback((params) => {
     const clientId = params.data.id;
     fetchContacts({ clientId })
       .then(data => {
         console.log('✅ Contacts fetched for', clientId);
         console.log('✅ Contacts fetched for', clientId);
         params.successCallback(data.rows);
       })
       .catch(err => {
         console.error('❌ Failed to fetch contacts:', err);
         params.successCallback([]);
       });
   }, []);
 
   const handleCellValueChanged = async (params) => {
     const formData = new URLSearchParams();
     formData.append('id', params.data.id);
     formData.append('industry', params.newValue);
 
     try {
       const response = await putClient(formData);
     } catch (error) {
       console.error('Error updating client:', error);
     }  
  };

  return (
     <div style={{ padding: '10px', height: '50vh', width: '100%' }}>
       <div className="ag-theme-alpine" style={{ marginBottom: '10px', fontSize: '20pt', fontWeight: 'bold' }}>
         Clients
       </div>
 
       <div>
         <QueryBuilder
           fields={clientsQueryFields}
           query={query}
           onQueryChange={(q) => setQuery(q)}
           controlElements={{ addGroupAction: () => '' }}
           translations={customTranslations}
         />
       </div>
       <div className="advancedFilterContainer">
         <button className="advancedFilter" onClick={() => gridRef.current.api.purgeServerSideCache()}>Apply Filter</button>
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
           getRowId={params => params.data.id}
           onGridReady={onGridReady}
           serverSideStoreType="partial"
           onCellValueChanged={handleCellValueChanged}
           domLayout='normal'
           masterDetail={true}
           detailCellRendererParams={{
             getDetailRowData,
             detailGridOptions: {
               columnDefs: contactColumnDefs,
               defaultColDef: {
                 flex: 1,
                 minWidth: 150,
                 sortable: true,
                 filter: true,
                 resizable: true
               }
             }
           }}
           isRowMaster={() => true}
           detailRowHeight={300}
         />
       </div>
     </div>
   );
 };
 
 export default Clients;
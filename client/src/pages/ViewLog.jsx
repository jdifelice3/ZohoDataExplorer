import React, { useRef, useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import QueryBuilder from 'react-querybuilder';
import { fetchViewLog } from '../services/db/fetchViewLog.js';
import { viewLogQueryFields } from '../constants/queryBuilder/viewLogFields.js';
import useSyncRefWithState from '../hooks/useSyncRefWithState.js';
import useGridInit from '../hooks/useGridInit.js';

const ViewLog = () => {
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
    { field: 'Timestamp', width: 230 },
    { field: 'Source', width: 100 },
    { field: 'Action' },
    { field: 'Endpoint' },
    { field: 'StatusCode', width:125 },
    { field: 'DurationMs', width:140, headerName: 'Duration (ms)' },
    { field: 'ErrorText', headerName: 'Status Message' }
  ], []);

  const metaColumnDefs = useMemo(() => [
    { field: 'userAgent' },
    { field: 'referer' }//,
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
        fetchViewLog({
          search: searchRef.current,
          query: queryRef.current,
          startRow: params.request.startRow,
          endRow: params.request.endRow,
          sortModel: params.request.sortModel,
          filterModel: params.request.filterModel,
        })
          .then(data => params.successCallback(data.rows, data.lastRow))
          .catch(err => {
            console.error("Error fetching viewLog:", err);
            params.failCallback();
          });
      }
    };
    params.api.setServerSideDatasource(datasource);
  }, []);

  const getDetailRowData = useCallback((params) => {
    const results = [];
    if(params.data.Meta){
      const meta = JSON.parse(params.data.Meta);
      
      results.push(meta);
    } else {

    }
    params.successCallback(results);
  }, []);

  return (
    <div style={{ padding: '10px', height: '50vh', width: '100%' }}>
      <div className="ag-theme-alpine" style={{ marginBottom: '10px', fontSize: '20pt', fontWeight: 'bold' }}>
        View Log
      </div>

      <div>
        <QueryBuilder
          fields={viewLogQueryFields}
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
          domLayout='normal'
          masterDetail={true}
          detailCellRendererParams={{
            getDetailRowData,
            detailGridOptions: {
              columnDefs: metaColumnDefs,
              defaultColDef: {
                flex: 1,
                minWidth: 100,
                sortable: true,
                filter: true,
                resizable: true
              }
            }
          }}
          isRowMaster={() => true}
          detailRowHeight={154}
        />
      </div>
    </div>
  );
};

export default ViewLog;
export const viewLogQueryFields = [
    // { name: 'Timestamp', label: 'Timestamp', valueEditorType: 'text', 
    //     operators: [
    //       { name: '=', label: '=' },
    //       { name: '!=', label: '≠' },
    //       { name: 'contains', label: 'contains' },
    //       { name: 'is null', label: 'is null' },
    //       { name: 'is not null', label: 'is not null' }
          
    //     ]},
      { name: 'Source', label: 'Source', 
        valueEditorType: 'select',
            values: [
            { name: 'API', label: 'API' },
            { name: 'DB', label: 'DB' },
            { name: 'SYNC', label: 'SYNC' },
    ],
        operators: [
          { name: '=', label: '=' },
          { name: '>', label: '>' },
          { name: '<', label: '<'}
        ]},
      { name: 'Action', label: 'Action', valueEditorType: 'text',
        operators: [
          { name: '=', label: '=' },
          { name: '!=', label: '≠' },
          { name: 'contains', label: 'contains'},
            { name: 'is null', label: 'is null' },
            { name: 'is not null', label: 'is not null' } 
        ]},
        { name: 'Endpoint', label: 'Endpoint', valueEditorType: 'text',
            operators: [
              { name: '=', label: '=' },
              { name: '!=', label: '≠' },
              { name: 'contains', label: 'contains'},
                { name: 'is null', label: 'is null' },
                { name: 'is not null', label: 'is not null' } 
            ]},
            { name: 'Durationms', label: 'Duration (ms)', valueEditorType: 'text',
                operators: [
                  { name: '=', label: '=' },
                  { name: '!=', label: '≠' },
                  { name: '>', label: '>'}
                ]
            },
   
            { name: 'StatusCode', label: 'Status Code', valueEditorType: 'text',
                operators: [
                  { name: '=', label: '=' },
                  { name: '!=', label: '≠' }
                ]
            },
            { name: 'ErrorText', label: 'Error Text', valueEditorType: 'text',
                operators: [
                { name: '=', label: '=' },
                { name: '!=', label: '≠' },
                { name: 'contains', label: 'contains'},
                { name: 'is null', label: 'is null' },
                { name: 'is not null', label: 'is not null' } 
                ]}   
  ]

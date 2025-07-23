export const clientsQueryFields = [
  { name: 'Client_Name', label: 'Client Name', valueEditorType: 'text', 
      operators: [
        { name: '=', label: '=' },
        { name: '!=', label: '≠' },
        { name: 'contains', label: 'contains' },
        { name: 'is null', label: 'is null' },
        { name: 'is not null', label: 'is not null' }
        
      ]},
    { name: 'cnt', label: 'Number of Contacts', valueEditorType: 'text',
      operators: [
        { name: '=', label: '=' },
        { name: '>', label: '>' },
        { name: '<', label: '<'}
      ]},
    { name: 'Industry', label: 'Industry', valueEditorType: 'text',
      operators: [
        { name: '=', label: '=' },
        { name: '!=', label: '≠' },
        { name: 'contains', label: 'contains'},
          { name: 'is null', label: 'is null' },
          { name: 'is not null', label: 'is not null' } 
      ]}
]
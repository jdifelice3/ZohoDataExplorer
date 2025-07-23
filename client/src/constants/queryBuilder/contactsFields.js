export const contactsQueryFields = [
  { name: 'Client_Name', label: 'Client Name', valueEditorType: 'text', 
    operators: [
      { name: '=', label: '=' },
      { name: '!=', label: '≠' },
      { name: 'contains', label: 'contains' },
      { name: 'is null', label: 'is null' },
      { name: 'is not null', label: 'is not null' }
      
    ]},
  { name: 'First_Name', label: 'First Name', valueEditorType: 'text',
    operators: [
      { name: '=', label: '=' },
      { name: '!=', label: '≠' },
      { name: 'contains', label: 'contains'},
      { name: 'is null', label: 'is null' } ,
      ({ name: 'is not null', label: 'is not null' })
    ]},
  { name: 'Last_Name', label: 'Last Name', valueEditorType: 'text',
    operators: [
      { name: '=', label: '=' },
      { name: '!=', label: '≠' },
      { name: 'contains', label: 'contains'},
        { name: 'is null', label: 'is null' },
        { name: 'is not null', label: 'is not null' } 
    ]},
  { name: 'Email', label: 'Email', valueEditorType: 'text',
    operators: [
      { name: '=', label: '=' },
      { name: '!=', label: '≠' },
      { name: 'contains', label: 'contains'},
      { name: 'is null', label: 'is null' },
      { name: 'is not null', label: 'is not null' } 
    ]
   },
  { name: 'Associated_Tags', label: 'Associated Tags', valueEditorType: 'text',
    operators: [
      { name: '=', label: '=' },
      { name: '!=', label: '≠' },
      { name: 'contains', label: 'contains'},
        { name: 'is null', label: 'is null' },
        { name: 'is not null', label: 'is not null' }
    ]}
]
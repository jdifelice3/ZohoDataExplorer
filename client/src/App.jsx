// App.jsx
import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { getEtlJobStatus } from './services/db/getEtlJobStatus';
import { postEtlStartJob } from './services/db/postEtlStartJob';
import { ToastContainer, toast } from 'react-toastify';
import './index.css';

const App = () => {
  const [buttonCaption, setButtonCaption] = useState('Zoho Sync');
  
  useEffect(() => {
    const fetchStatus = async () => {
      const isRunning = await getEtlJobStatus();
      const caption = isRunning ? "Syncing..." : "Zoho Sync"; 
      setButtonCaption(caption);
    };
    fetchStatus();
  }, []); // Empty dependency array: run only on mount

  const handleClick = async () => {
    try {
      const response = await getEtlJobStatus();
      const jobStatus = response.running;
      console.error('Inside handleClick, jobStatus:', jobStatus);

      if (jobStatus) {
        toast(
            <div style={{ textAlign: 'left', fontSize: '12pt', fontWeight: 'bold', verticalAlign: 'top'}}>
              <span>❌</span><br />
              <span>
                  Zoho Sync job is already<br />
                  running. Please wait until<br /> 
                  it finishes. 
              </span>
            </div>
            );
        return;
      } 

      setButtonCaption("Syncing...");

      const resEtlStartJob = await postEtlStartJob();

    } catch (error) {
      console.error('Error fetching job status:', error);
    }
  };

return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div>
      <ToastContainer
        width={300}
        position="top-right"
        autoClose={5000} // in ms
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
    <table style={{width: '100%'}}>
      <colgroup>
        <col span="1"/>
        <col span="1"/>
      </colgroup>
      <tbody>
        <tr>
          <td>
            <img className="logo" src="/images/Zoho-Data-Explorer-logo.png" alt="Logo" />
          </td>
          <td style={{textAlign: 'right'}}>
            <button className="advancedFilter" style={{backgroundColor: '#004BB733',fontSize: '12pt',color:'black', fontWeight:'bold',border: '2px solid black'}} 
                onClick={handleClick} >
              {buttonCaption}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

      <nav>
          <Link to="/clients">Clients Page</Link>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/contacts">Contacts Page</Link>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link to="/viewlog">View Log</Link>
      </nav>
      <div>&nbsp;</div>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default App;
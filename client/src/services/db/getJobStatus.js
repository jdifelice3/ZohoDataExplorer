  const getJobStatus = async () => {
    try {
      const response = await fetch(`${endpoints.VITE_APP_SERVER_URL}/etl-job-status`);
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching job status:', error);
      return 'Error';
    }
  };
import { useEffect } from 'react';

export default function useGridInitLogger(gridRef) {
  useEffect(() => {
    if (!gridRef.current) return;

    const api = gridRef.current.api;
    const interval = setInterval(() => {
      if (api) {
        console.log("🧠 AG Grid model type:", api.getModel()?.getType());
        console.log("🧠 Page size:", api.paginationGetPageSize?.());
        console.log("🧠 Row count:", api.paginationGetRowCount?.());
        console.log("🧠 Current page:", api.paginationGetCurrentPage?.());
        console.log("🧠 Is last page known:", api.paginationIsLastPageFound?.());

        if (api.paginationGetTotalPages?.() > 1) {
          console.log("👟 Jumping to page 2");
          api.paginationGoToPage(1);
        }

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [gridRef]);
}

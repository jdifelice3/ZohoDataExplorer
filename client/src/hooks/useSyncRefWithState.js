// client/src/hooks/useSyncRefWithState.js
import { useEffect } from 'react';

export default function useSyncRefWithState(ref, value) {
  useEffect(() => {
    ref.current = value;
  }, [value]);
}

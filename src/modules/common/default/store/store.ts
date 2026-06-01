import { configureStore } from '@reduxjs/toolkit';

import { authSlice } from '@app/modules/common/default/store/reducers/auth';
import { uiSlice } from '@app/modules/common/default/store/reducers/ui';
import { createLogger } from 'redux-logger';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createLogger()) as any,
});

export default store;

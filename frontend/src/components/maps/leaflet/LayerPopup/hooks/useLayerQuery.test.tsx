import { renderHook } from '@testing-library/react-hooks';
import { useLayerQuery } from 'components/maps/leaflet/LayerPopup';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ToastContainer, toast } from 'react-toastify';

const mockStore = configureMockStore([thunk]);
const getStore = (values?: any) => mockStore(values ?? { parcel: { draftParcels: [] } });
const getWrapper = (store: any) => ({ children }: any) => (
  <Provider store={store}>
    <ToastContainer
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
    />
    {children}
  </Provider>
);
const mockAxios = new MockAdapter(axios);
const toastErrorSpy = jest.spyOn(toast, 'error');

const getRenderedHook = () => {
  const {
    result: { current },
  } = renderHook(() => useLayerQuery('test'), {
    wrapper: getWrapper(getStore()),
  });
  return current;
};

describe('useLayerQuery hook tests', () => {
  beforeEach(() => {
    mockAxios.reset();
    toastErrorSpy.mockReset();
  });
  afterEach(async () => {});
  describe('findOneWhereContains tests', () => {
    it('Displays a warning when a warehouse request fails', async () => {
      const { findOneWhereContains } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findOneWhereContains({ lat: 1, lng: 1 } as any);
      } catch (err) {}

      expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    });
    it('retries failed wfs requests', async () => {
      const { findOneWhereContains } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findOneWhereContains({ lat: 1, lng: 1 } as any);
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(3);
    });
    it('does not show the data warehouse error if the retry passes', async () => {
      const { findOneWhereContains } = getRenderedHook();
      mockAxios
        .onGet()
        .replyOnce(500)
        .onAny()
        .reply(200);
      try {
        await findOneWhereContains({ lat: 1, lng: 1 } as any);
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(2);
      expect(toastErrorSpy).not.toHaveBeenCalled();
    });
  });
  describe('findByAdministrative tests', () => {
    it('Displays a warning when a warehouse request fails', async () => {
      const { findByAdministrative } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findByAdministrative('city');
      } catch (err) {}

      expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    });
    it('retries failed wfs requests', async () => {
      const { findByAdministrative } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findByAdministrative('city');
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(3);
    });
    it('does not show the data warehouse error if the retry passes', async () => {
      const { findByAdministrative } = getRenderedHook();
      mockAxios
        .onGet()
        .replyOnce(500)
        .onAny()
        .reply(200);
      try {
        await findByAdministrative('city');
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(2);
      expect(toastErrorSpy).not.toHaveBeenCalled();
    });
  });
  describe('findByPid tests', () => {
    it('Displays a warning when a warehouse request fails', async () => {
      const { findByPid } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findByPid('pid');
      } catch (err) {}

      expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    });
    it('retries failed wfs requests', async () => {
      const { findByPid } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findByPid('pid');
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(3);
    });
    it('does not show the data warehouse error if the retry passes', async () => {
      const { findByPid } = getRenderedHook();
      mockAxios
        .onGet()
        .replyOnce(500)
        .onAny()
        .reply(200);
      try {
        await findByPid('pid');
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(2);
      expect(toastErrorSpy).not.toHaveBeenCalled();
    });
  });
  describe('findByPin tests', () => {
    it('Displays a warning when a warehouse request fails', async () => {
      const { findByPin } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findByPin('pin');
      } catch (err) {}

      expect(toastErrorSpy).toHaveBeenCalledTimes(1);
    });
    it('retries failed wfs requests', async () => {
      const { findByPin } = getRenderedHook();
      mockAxios.onGet().reply(500);
      try {
        await findByPin('pin');
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(3);
    });
    it('does not show the data warehouse error if the retry passes', async () => {
      const { findByPin } = getRenderedHook();
      mockAxios
        .onGet()
        .replyOnce(500)
        .onAny()
        .reply(200);
      try {
        await findByPin('pin');
      } catch (err) {}

      expect(mockAxios.history.get.length).toBe(2);
      expect(toastErrorSpy).not.toHaveBeenCalled();
    });
  });
});

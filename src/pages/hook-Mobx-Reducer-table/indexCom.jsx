import React, {
  useState, useEffect, useReducer
} from 'react';
import { Observer, useObserver, useLocalStore } from 'mobx-react';
import TableStore from 'store/tablestore';

const tableStore = new TableStore();
const initialState = {
  selectedRowKeys: [],
  selectedRows: [],
  searchFilter: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'selectedRowKeys':
      return { selectedRowKeys: action.selectedRowKeys };
    case 'searchFilter':
      return { searchFilter: action.searchFilter };
    case 'selectedRowKeysselectedRows':
      return { selectedRowKeys: action.selectedRowKeys, selectedRows: action.selectedRows };
    default:
      throw new Error();
  }
}

function useTableList(fetchurl) {
  const store = useLocalStore(() => tableStore);
  const [state, dispatch] = useReducer(reducer, initialState);

  const doQuery = (params = {}) => {
    const { searchFilter } = state;
    const param = {
      loadingFlag: false,
      url: fetchurl,
      method: 'post',
      data: {
        numPerpage: store.dataObj.pagination.pageSize,
        page: store.dataObj.pagination.current,
        filter: searchFilter,
        ...params
      }
    };
    store.fetchTabData(param);
  };

  useEffect(() => {
    doQuery();
  });

  function searchFn(value) {
    store.dataObj.pagination.current = 1;
    dispatch({
      type: 'searchFilter',
      searchFilter: value
    });
    // this.setState({ searchFilter: value }, () => {
    //   doQuery();
    // });
  }

  function onSelectChange(selectedRowKeys, selectedRows) {
    dispatch({
      type: 'selectedRowKeysselectedRows',
      selectedRowKeys,
      selectedRows
    });
    // this.setState({ selectedRowKeys, selectedRows });
  }

  function handleTableChange(pagination, filter, sorter) {
    store.dataObj.pagination.current = pagination.current;
    store.dataObj.pagination.pageSize = pagination.pageSize;
    doQuery();
  }

  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange
  };

  const dataSource = store.dataObj.list.slice();
  const { pagination } = store.dataObj;
  const { searchFilter } = state;

  return {
    pagination, handleTableChange, rowSelection, searchFilter, dataSource, searchFn, doQuery
  };
}
export default useTableList;
